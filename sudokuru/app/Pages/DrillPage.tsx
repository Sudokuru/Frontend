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
import { Set, List } from 'immutable';
import Header from "../Components/Header";
import {USERACTIVEGAMESBFFURL} from '@env'

const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js"); // -- What works for me

// Sudokuru Package Constants
const Puzzles = sudokuru.Puzzles;
const Drills = sudokuru.Drills;

function strPuzzleToArray(str) {
  let arr = [];
  for (let i = 0; i < str.length; i += 9) {
    arr.push(str.slice(i, i + 9).split('').map(Number));
  }
  output = arr[0].map((_, colIndex) => arr.map(row => row[colIndex]));
  return { puzzle: output };
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
          board = addNumberAsNote(currNoteIndex + 1, board, j, i);
      }
    }
  }
  return board;
}

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

const DrillPage = (props) => {
  let strategy = props.route.params ? props.route.params.params : "no props.route.params in DrillPage"
  console.log(strategy);
  let [fontsLoaded] = useFonts({
      Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  async function generateGame(url, strategies, token) {
    let board = await Drills.getGame(url, strategies, token).then(game =>
    {
      let board = makeBoard(strPuzzleToArray(game.puzzleCurrentState))
      board = parseApiAndAddNotes(board, game.puzzleCurrentNotesState);
      return board;
    });

    return {
      board, history: List.of(board), historyOffSet: 0,
    };
  }

  function getHint(board) {
    let boardArray = componentBoardValsToArray(board);
    let notesArray = componentBoardNotesToArray(board);
    let hint = Puzzles.getHint(boardArray, notesArray, strategy)
    console.log(hint);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Header page={'Sudoku'}/>
        <View style={homeScreenStyles.home}>
          <View style={styles.container}>
            {/* The game now required the info about it to be rendered, which is given in generateGame() */}
            <SudokuBoard generatedGame={generateGame(USERACTIVEGAMESBFFURL,  ["NAKED_SINGLE"], "token")} isDrill={true} getHint={getHint}/>
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