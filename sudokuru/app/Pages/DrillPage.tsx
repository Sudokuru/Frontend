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

const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js"); // -- What works for me

// Sudokuru Package Constants
const Puzzles = sudokuru.Puzzles;
const Drills = sudokuru.Drills;

function formatPuzzle(str) {
  let arr = [];
  for (let i = 0; i < str.length; i += 9) {
      arr.push(str.slice(i, i + 9).split('').map(Number));
  }
  return { puzzle: arr };
}

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

function parseApiAndAddNotes(board, puzzleCurrentNotesState)
{
  if (!puzzleCurrentNotesState)
  {
    console.log("ERROR in parseApiAndAddNotes: puzzleCurrentNotesState == " + puzzleCurrentNotesState);
    return;
  }
  if (puzzleCurrentNotesState.length != 729)
  {
    console.log("ERROR in parseApiAndAddNotes: puzzleCurrentNotesState should be length 729, but is length: " + puzzleCurrentNotesState.length);
    return;
  }
  let stringIndex = 0;
  for (let i = 0; i < 9; i++)
  {
    for (let j = 0; j < 9; j++)
    {
      for (let currNoteIndex = 0; currNoteIndex < 9; currNoteIndex++)
      {
        stringIndex = 81 * i + 9 * j + currNoteIndex;
        if (puzzleCurrentNotesState.charAt(stringIndex) == 1)
        {
          board = addNumberAsNote(currNoteIndex + 1, board, i, j);
          // console.log("1");
        }
        else
        {
          // console.log("0");
        }
      }
    }
  }
  return board;
}


const DrillPage = () => {

    let [fontsLoaded] = useFonts({
        Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
    });

    if (!fontsLoaded) {
        return null;
    }

    // TODO: This should eventually call greg's API for making the puzzle
    async function generateGame (finalCount = 20) {
      let board = await Drills.getGame("http://localhost:3001/",  ["NAKED_SINGLE"], "token").then(game =>
      {
        console.log(game);
        let board = makeBoard(formatPuzzle(game.puzzleCurrentState))
        board = parseApiAndAddNotes(board, game.puzzleCurrentNotesState);
        return board;
      });
      console.log("Board: ", board);

      return {
        board, history: List.of(board), historyOffSet: 0,
      };
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Header page={'Sudoku'}/>
                <View style={homeScreenStyles.home}>
                    <View style={styles.container}>
                        {/* The game now required the info about it to be rendered, which is given in generateGame() */}
                        <SudokuBoard generatedGame={generateGame()} isDrill={true}/>
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

export default DrillPage;