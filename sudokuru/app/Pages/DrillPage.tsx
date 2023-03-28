// @ts-nocheck
import React from 'react';
import LoginButton from "../Components/Auth0/LoginButton";
import { StyleSheet, View } from "react-native";
import { Text, Button } from 'react-native-paper';
import ProfileButton from "../Components/Profile/ProfileButton";
import StatisticsButton from "../Components/Statistics/StatisticsButton";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { makePuzzle, pluck, makeBoard } from '../Components/Sudoku Board/sudoku';
import { Set, List } from 'immutable';
import Header from "../Components/Header";
import {getKeyString} from "../Functions/Auth0/token";
import {USERACTIVEGAMESBFFURL} from '@env'
import {useNavigation} from "@react-navigation/native";

const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js"); // -- What works for me

// Sudokuru Package Constants
const Puzzles = sudokuru.Puzzles;
const Drills = sudokuru.Drills;

export function strPuzzleToArray(str) {
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

export function parseApiAndAddNotes(board, puzzleCurrentNotesState, isDrill)
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

        if (puzzleCurrentNotesState.charAt(stringIndex) == 1){
            if (isDrill){
                board = addNumberAsNote(currNoteIndex + 1, board, j, i);
            } else {
                board = addNumberAsNote(currNoteIndex + 1, board, i, j);
            }
        }
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
  let [fontsLoaded] = useFonts({
      Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
  });

  const navigation: any = useNavigation();

  function getHint(board) {
    let boardArray = componentBoardValsToArray(board);
    let notesArray = componentBoardNotesToArray(board);
    let hint;
    try {
      hint = Puzzles.getHint(boardArray, notesArray, strategy)
    } catch (e) {
      console.log("No hints found for " + strategy);
    }
    return hint;
  }

  if (!fontsLoaded) {
    return null;
  }

  async function generateGame(url, strategies) {
    let token = null;
    await getKeyString("access_token").then(
      result => {
        token = result;
        console.log(token)
      });


    let { board, originalBoard } = await Drills.getGame(url, strategies, token).then(game => {
      // null check to verify that game is loaded in.
      if (game == null){
          console.log("Drill game did not load!");
          navigation.navigate("Home");
          return;
      }
      let board = makeBoard(strPuzzleToArray(game.puzzleCurrentState), game.puzzleCurrentState);
      board = parseApiAndAddNotes(board, game.puzzleCurrentNotesState, true);
      let originalBoard = makeBoard(strPuzzleToArray(game.puzzleCurrentState), game.puzzleCurrentState);
      originalBoard = parseApiAndAddNotes(originalBoard, game.puzzleCurrentNotesState, true);
      return { board, originalBoard };
    });

    let drillSolutionCells = getDrillSolutionCells(board);
    console.log(drillSolutionCells);

    return {
      board, history: List.of(board), historyOffSet: 0, drillSolutionCells, originalBoard
    };
  }

  // for each cell that is a part of the hint, store the coordinates and the resulting state
  // if there is a notes field for the cell, the notes must match
  // if there is a value field for the cell, the value must match
  function getDrillSolutionCells(board)
  {
    let drillSolutionCells = [];
    let hint = getHint(board);
    if (hint)
    {
      for (let i = 0; i < hint.removals.length; i++)
      {
        let temp = {};
        let currRemoval = hint.removals[i];
        temp.x = currRemoval[0];
        temp.y = currRemoval[1];
        temp.notes = board.get('puzzle').getIn([temp.x, temp.y]).get('notes');
        for (let j = 2; j < currRemoval.length; j++)
        {
          temp.notes = temp.notes.delete(currRemoval[j]);
        }
        drillSolutionCells.push(temp);
      }

      if (hint.placements[0])
      {
        let temp = {}
        temp.x = hint.placements[0][0];
        temp.y = hint.placements[0][1];
        temp.value = hint.placements[0][2];
        drillSolutionCells.push(temp);
      }
      console.log("drillSolutionCells");
      console.log(drillSolutionCells);
    }
    return drillSolutionCells;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>

        <Header page={'Sudoku'}/>
        <View style={homeScreenStyles.home}>

          <View style={styles.container}>
            {/* The game now required the info about it to be rendered, which is given in generateGame() */}
            <SudokuBoard generatedGame={generateGame(USERACTIVEGAMESBFFURL, strategy)} isDrill={true} getHint={getHint} navigation={navigation}/>
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
    backButton: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        top: 100,
        position: 'absolute',
    },
});

const homeScreenStyles = StyleSheet.create({
    home: {
        display: "flex",
        flexDirection: 'row',
    },
});

export default DrillPage;