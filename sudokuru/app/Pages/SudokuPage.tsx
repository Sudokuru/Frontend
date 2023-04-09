// @ts-nocheck
import React, {useEffect} from 'react';
import { StyleSheet, View } from "react-native";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { makePuzzle, pluck, makeBoard } from '../Components/Sudoku Board/sudoku';
import { List } from 'immutable';
import Header from "../Components/Header";
import {getKeyString} from "../Functions/Auth0/token";
import {USERACTIVEGAMESBFFURL} from '@env'
import {parseApiAndAddNotes, strPuzzleToArray} from "./DrillPage";
import Alert from "react-native-awesome-alerts";
import {useTheme} from "react-native-paper";

// Sudokuru Package Import
const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js");

// Sudokuru Package Constants
const Puzzles = sudokuru.Puzzles;

// startGame - https://www.npmjs.com/package/sudokuru#:~:text=sudokuru.Puzzles%3B-,Puzzles.startGame(),-Description%3A%20Returns%20puzzle

let strategies = ["AMEND_NOTES", "SIMPLIFY_NOTES", "NAKED_SINGLE", "HIDDEN_SINGLE"]; // TODO: Get strategies from previous page

updateBoard = (newBoard) => {
  let { history } = this.state;
  const { historyOffSet } = this.state;
  history = history.slice(0, historyOffSet + 1);
  history = history.push(newBoard);
  this.setState({ board: newBoard, history, historyOffSet: history.size - 1 });
};

// USAGE
// board = addNumberAsNote(...)
function addNumberAsNote (number, board, i, j) {
  let selectedCell = board.get('puzzle').getIn([i, j]);
  if (!selectedCell)
  {
    return;
  }
  const prefilled = selectedCell.get('prefilled');
  if (prefilled)
  {
    return;
  }
  let notes = selectedCell.get('notes') || new Set();
  notes = notes.add(number);
  selectedCell = selectedCell.set('notes', notes);
  board = board.setIn(['puzzle', i, j], selectedCell);
  return board;
};

function componentBoardValsToArray(board)
{
  let boardArray = [];
  let temp = [];
  for (let i = 0; i < 9; i++)
  {
    temp = [];
    for (let j = 0; j < 9; j++)
    {
      currVal = board.get('puzzle').getIn([i, j, 'value']);
      temp.push(!currVal ? "0" : currVal.toString());
    }
    boardArray.push(temp);
  }
  return boardArray;
}

function componentBoardNotesToArray(board)
{
  let notesArray = [];
  let temp = [];
  for (let i = 0; i < 9; i++)
  {
    for (let j = 0; j < 9; j++)
    {
      temp = [];
      let notesSetFromComponent = board.get('puzzle').getIn([i, j, 'notes']);
      if (!notesSetFromComponent) 
      {
        notesArray.push(temp);
        continue;
      }
      for (let k = 1; k <= 9; k++)
      {
        if (notesSetFromComponent.includes(k))
        {
          temp.push((k).toString());
        }
      }
      notesArray.push(temp);
    }
  }
  return notesArray;
}

function componentSolutionValsToArray(solution)
{
  let solArray = [];
  let temp = [];
  for (let i = 0; i < 9; i++)
  {
    temp = [];
    for (let j = 0; j < 9; j++)
    {
      temp.push(solution[9 * j + i].toString());
    }
    solArray.push(temp);
  }
  return solArray;
}

const SudokuPage = ({route, navigation}) => { // TODO: Take in props from previous page instead of static values

    const { gameOrigin } = route.params;
    const { difficulty } = route.params;

    const theme = useTheme();

    const [gameResultsVisible, toggleGameResults] = React.useState(false);

    const [gameResultScore, setGameResultScore] = React.useState(0);
    const [gameResultTime, setGameResultTime] = React.useState(0);
    const [gameResultNumHintsUsed, setGameResultNumHintsUsed] = React.useState(0);
    const [gameResultNumWrongCellsPlayed, setGameResultNumWrongCellsPlayed] = React.useState(0);
    const [banana, setBanana] = React.useState(0);

    const showGameResults = (score: number, time: number, numHintsUsed: number, numWrongCellsPlayed: number, banana: number) => {
        console.log(score, time, numHintsUsed, numWrongCellsPlayed, banana);
        setGameResultScore(score);
        setGameResultTime(time);
        setGameResultNumHintsUsed(numHintsUsed);
        setGameResultNumWrongCellsPlayed(numWrongCellsPlayed);
        setBanana(banana);
    }
    const hideGameResults = () => toggleGameResults(false);

    // we show the game results if time does not equal zero and on score change
    useEffect(() => {
        console.log("HELLO!");
        if (gameResultTime != 0){
            console.log("GREETINGS!");
            toggleGameResults(true);
        }
    }, [banana]);



    let [fontsLoaded] = useFonts({
        Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
    });

    if (!fontsLoaded) {
        return null;
    }

    async function generateGame(url) {
        let token = null;
      
        await getKeyString("access_token").then(result => {
          token = result;
        });

        let gameData = null;

        if (gameOrigin == "start"){
            gameData = await Puzzles.startGame(url, difficulty, strategies, token).then(
                game => {
                    // If game object is not returned, you get redirected to Main Page
                    if (game[0].puzzle == null){
                        navigation.navigate("Home");
                        return;
                    }
                    let board = makeBoard(strPuzzleToArray(game[0].puzzle), game[0].puzzle);
                    return {
                        board,
                        history: List.of(board),
                        historyOffSet: 0,
                        solution: game[0].puzzleSolution,
                        activeGame: game,
                    };
                }
            );
        }
        else if (gameOrigin == "resume"){
            gameData = await Puzzles.getGame(url, token).then(
                game => {
                    // If game object is not returned, you get redirected to Main Page
                    if (game[0].puzzle == null){
                        navigation.navigate("Home");
                        return;
                    }
                    let board = makeBoard(strPuzzleToArray(game[0].moves[game[0].moves.length-1].puzzleCurrentState), game[0].puzzle);
                    board = parseApiAndAddNotes(board, game[0].moves[game[0].moves.length-1].puzzleCurrentNotesState, false);
                    return {
                        board,
                        history: List.of(board),
                        historyOffSet: 0,
                        solution: game[0].puzzleSolution,
                        activeGame: game,
                    };
                }
            );
        }

          return gameData;
    }
    
    function getHint(board, solution)
    {
      let boardArray = componentBoardValsToArray(board);
      let notesArray = componentBoardNotesToArray(board);
      let solutionArray = componentSolutionValsToArray(solution);
      let hint;
      try {
        hint = Puzzles.getHint(boardArray, notesArray, strategies, solutionArray);
      } catch (e) {
        console.log(e);
      }
      return hint;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Header page={'Sudoku'}/>
                <View style={homeScreenStyles.home}>
                    <View style={styles.container}>
                        {/* The game now required the info about it to be rendered, which is given in generateGame() */}
                        <SudokuBoard generatedGame={generateGame(USERACTIVEGAMESBFFURL)} isDrill={false} getHint={getHint} navigation={navigation} showGameResults={showGameResults}/>
                        <StatusBar style="auto" />
                    </View>
                </View>
                <Alert
                    show={gameResultsVisible}
                    title="Game Results"
                    message={'Score: ' + gameResultScore + 'Time: ' + gameResultTime + 'Number of Hints Used: ' + gameResultNumHintsUsed +
                        'Incorrect Cells: ' + gameResultNumWrongCellsPlayed + 'Banana: ' + banana}
                    messageStyle={{maxWidth: 500}}
                    showConfirmButton={true}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    confirmText={"Go Home"}
                    confirmButtonColor={theme.colors.background}
                    onConfirmPressed={() => {
                        hideGameResults();
                        navigation.navigate("Home");
                    }}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    toggleIcons: {
        flexDirection: 'row',
        margin: 5
    },
    profileHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    profileText: {
        fontSize: 20,
    },
    profileButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const homeScreenStyles = StyleSheet.create({
    home: {
        display: "flex",
        flexDirection: 'row',
    },
});

export default SudokuPage;