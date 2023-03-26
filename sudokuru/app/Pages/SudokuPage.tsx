// @ts-nocheck
import React from 'react';
import LoginButton from "../Components/Auth0/LoginButton";
import { StyleSheet, View } from "react-native";
import { Text } from 'react-native-paper';
import ProfileButton from "../Components/Profile/ProfileButton";
import StatisticsButton from "../Components/Statistics/StatisticsButton";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { makePuzzle, pluck, makeBoard } from '../Components/Sudoku Board/sudoku';
import { List } from 'immutable';
import Header from "../Components/Header";
import {getKeyString} from "../Functions/Auth0/token";
import {USERACTIVEGAMESBFFURL} from '@env'
import {useNavigation} from "@react-navigation/native";
import {parseApiAndAddNotes, strPuzzleToArray} from "./DrillPage";

// Sudokuru Package Import
const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js");

// Sudokuru Package Constants
const Puzzles = sudokuru.Puzzles;

// startGame - https://www.npmjs.com/package/sudokuru#:~:text=sudokuru.Puzzles%3B-,Puzzles.startGame(),-Description%3A%20Returns%20puzzle
let difficulty = .1; // TODO: Get difficulty from slider
let strategies = ["NAKED_PAIR"]; // TODO: Get strategies from previous page

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
    console.log("ERROR when accessing board puzzle. Index: [" + i + "][" + j + "]");
    return;
  }
  const prefilled = selectedCell.get('prefilled');
  if (prefilled)
  {
    console.log("ERROR current cell is prefilled. Index: [" + i + "][" + j + "]");
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

const SudokuPage = ({route, navigation}) => { // TODO: Take in props from previous page instead of static values

    const { gameOrigin } = route.params;

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
                        console.log(game);
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
                        console.log(game);
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
    
    function getHint(board) 
    {
      let boardArray = componentBoardValsToArray(board);
      let notesArray = componentBoardNotesToArray(board);
      let hint;
      // TODO: Strategies need to be sorted in increasing order
      try {
        hint = Puzzles.getHint(boardArray, notesArray, strategies);
      } catch (e) {
        console.log("No hints found for " + strategies);
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
                        <SudokuBoard generatedGame={generateGame(USERACTIVEGAMESBFFURL)} isDrill={false} getHint={getHint}/>
                        <StatusBar style="auto" />
                    </View>
                </View>
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