// @ts-nocheck
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, useWindowDimensions, Platform } from 'react-native';
import {List, Set} from 'immutable';
import PropTypes from 'prop-types';
import {useNavigation} from "@react-navigation/native";

import {highlightBox, highlightColumn, highlightRow, isPeer as areCoordinatePeers, makeBoard, range} from './sudoku';
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";

import {getKeyString} from "../../Functions/Auth0/token";
import {USERACTIVEGAMESBFFURL} from '@env'
import {useFocusEffect} from "@react-navigation/core";
import {PreferencesContext} from "../../Contexts/PreferencesContext";

// Sudokuru Package Import
const sudokuru = require("../../../node_modules/sudokuru/dist/bundle.js");

// Sudokuru Package Constants
const Puzzles = sudokuru.Puzzles;
const Drills = sudokuru.Drills;

// startGame - https://www.npmjs.com/package/sudokuru#:~:text=sudokuru.Puzzles%3B-,Puzzles.startGame(),-Description%3A%20Returns%20puzzle
let url = USERACTIVEGAMESBFFURL;

let drillMode = false;

let landingMode = false;

let fallbackHeight = 30;

// Global variables for activeGame elements
let globalTime = 0;

// const darkBrown = "#A64732";

// cause/removal cells
const gold = "#F2CA7E";

const styles = (cellSize, sizeConst) => StyleSheet.create({
  hardLineThickness : {thickness: cellSize * (3 / 40)},
  hintArrowPlaceholderView: {
    width: cellSize/(sizeConst),
    height: cellSize/(sizeConst),
  },
  hintAndPuzzleContainer: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  boardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cellContainer: {
    height: cellSize ? cellSize : fallbackHeight,
    width: cellSize ? cellSize : fallbackHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteViewParent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteViewElement: {
    width: cellSize ? cellSize / 4 + 1 : fallbackHeight / 4 + 1,
    height: cellSize ? cellSize / 4 + 1 : fallbackHeight / 4 + 1,
    paddingLeft: cellSize ? cellSize / 20 : fallbackHeight / 20
  },
  noteText: {
    fontSize: cellSize ? cellSize / 4.5 : fallbackHeight / 4,
    fontFamily: 'Inter_200ExtraLight',
  },
  removalNoteText: {
    fontSize: cellSize ? cellSize / 4.5 : fallbackHeight / 4,
    fontFamily: 'Inter_300Light',
    color: "#FF0000",
  },
  placementNoteText: {
    fontSize: cellSize ? cellSize / 4.5 : fallbackHeight / 4,
    fontFamily: 'Inter_300Light',
    color: gold,
  },
  cellView: {
    height: cellSize ? cellSize : fallbackHeight,
    width: cellSize ? cellSize : fallbackHeight,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    borderWidth: cellSize ? cellSize / 40 : fallbackHeight / 40,
    backgroundColor: 'white',
  },
  cellText: {
    fontFamily: 'Inter_400Regular',
    fontSize: cellSize ? cellSize * (3 / 4) + 1 : fallbackHeight * (3 / 4) + 1,
    textAlign: 'center',
    alignContent: 'stretch',
    alignItems: 'stretch',
    lineHeight: cellSize ? cellSize : fallbackHeight,
  },  
  borderThick: {
    borderLeftWidth: cellSize ? cellSize / 4 : fallbackHeight / 4,
  },
  conflict: {
    // styles for cells with conflict prop
    color: '#000000',
    backgroundColor: '#FFC3BF',
  },
  peer: {
    // styles for cells with isPeer prop
    color: '#000000',
    backgroundColor: '#C5DDF4',
  },
  sameValue: {
    // styles for cells with sameValue prop
    color: '#000000',
    backgroundColor: '#c8dcc4',
  },
  selected: {
    // styles for cells with isSelected prop
    color: '#000000',
    backgroundColor: '#9cc4ec',
  },
  prefilled: {
    // styles for cells with prefilled prop
  },
  selectedConflict: {
    // styles for cells with isSelected and conflict props
    color: '#000000',
    backgroundColor: '#FF7C75',
  },
  bottomActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  actionControlRow: {
    width: cellSize ? cellSize * 8 : fallbackHeight * 8,
    height: cellSize ? cellSize: fallbackHeight,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: cellSize ? cellSize * (1 / 4): fallbackHeight * (1 / 4),
  },
  actionControlButton: {
    height: cellSize ? cellSize * (0.5) : 1000,
    width: cellSize ? cellSize * (0.5) : 1000,
    aspectRatio: 1,
  },
  numberControlRow: {
    width: cellSize ? cellSize * 9 : fallbackHeight * 9,
    height: cellSize ? cellSize: fallbackHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberContainer: {
    width: cellSize ? cellSize * (50 / 60) : fallbackHeight * (50 / 60),
    height: cellSize ? cellSize : fallbackHeight,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    backgroundColor: '#7EC8D9',
    borderRadius: cellSize ? cellSize * (10 / 60) : fallbackHeight * (10 / 60)
  },
  numberControlText: {
    fontFamily: 'Inter_400Regular',
    fontSize: cellSize ? cellSize * (3 / 4) + 1 : fallbackHeight * (3 / 4) + 1,
  },
  controlStyle: {
    padding: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    transition: 'filter .5s ease-in-out',
    width: '100%'
  },
  headerControlRow: {
    alignSelf: "center",
    width: cellSize ? cellSize * 9 : fallbackHeight * 9,
    height: cellSize ? cellSize * (3 / 4): fallbackHeight * (3 / 4),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: cellSize ? cellSize * (1 / 2): fallbackHeight * (1 / 2),
  },
  headerFont: {
    fontFamily: 'Inter_400Regular',
    fontSize: cellSize ? cellSize * (1 / 3) + 1 : fallbackHeight * (1 / 3) + 1,
    color: '#FFFFFF',
  },
  submitButtonView: {
    width: cellSize ? cellSize * (50 / 30) : fallbackHeight * (50 / 30),
    height: cellSize ? cellSize * (3 / 4) : fallbackHeight * (3 / 4),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: gold,
    borderRadius: cellSize ? cellSize * (10 / 60) : fallbackHeight * (10 / 60),
    marginTop: cellSize ? cellSize * (1 / 2): fallbackHeight * (1 / 2),
  },
  submitButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: cellSize ? cellSize * (1 / 3) + 1 : fallbackHeight * (1 / 3) + 1,
    color: '#FFFFFF',
  },
  hintSectionContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: cellSize ? cellSize * 9 : fallbackHeight * 9,
  },
  hintTextContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: cellSize ? cellSize * 5 : fallbackHeight * 5,
  },
  hintStratNameView: {

  },
  hintStratNameText: {
    fontFamily: 'Inter_700Bold',
    fontSize: cellSize ? cellSize * (1 / 2) : fallbackHeight * (1 / 2) ,
    color: gold,
  },
  hintActionInfoView: {

  },
  hintActionInfoText: {
    fontSize: cellSize ? cellSize * (1 / 4) : fallbackHeight * (1 / 4),
    color: "white",
    textAlign: 'center',
  }
});

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

function getHint(board, solution, strategies)
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

function parseApiAndAddNotes(board, puzzleCurrentNotesState, isDrill)
{
  if (!puzzleCurrentNotesState)
  {
    return;
  }
  if (puzzleCurrentNotesState.length != 729)
  {
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

function strPuzzleToArray(str) {
  let arr = [];
  for (let i = 0; i < str.length; i += 9) {
    arr.push(str.slice(i, i + 9).split('').map(Number));
  }
  let output = arr[0].map((_, colIndex) => arr.map(row => row[colIndex]));
  return { puzzle: output };
}

async function generateGame(url, props) {

  let token = null;

  await getKeyString("access_token").then(result => {
    token = result;
  });

  let gameData = null;

  if (props.gameType == "StartGame"){
    gameData = await Puzzles.startGame(url, props.difficulty, props.strategies, token).then(
        game => {
          // If game object is not returned, you get redirected to Main Page
          if (game == null){
            //navigation.navigate("Home");
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
  else if (props.gameType == "ResumeGame"){
    gameData = await Puzzles.getGame(url, token).then(
        game => {
          // If game object is not returned, you get redirected to Main Page
          if (game == null){
            //navigation.navigate("Home");
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
  else if (props.gameType == 'StartDrill'){
    let token = null;
    await getKeyString("access_token").then(
        result => {
          token = result;
        });

    let { board, originalBoard, puzzleSolution } = await Drills.getGame(url, props.strategies, token).then(game => {
      // null check to verify that game is loaded in.
      if (game == null){
        //navigation.navigate("Home");
        return;
      }
      let board = makeBoard(strPuzzleToArray(game.puzzleCurrentState), game.puzzleCurrentState);
      board = parseApiAndAddNotes(board, game.puzzleCurrentNotesState, true);
      let originalBoard = makeBoard(strPuzzleToArray(game.puzzleCurrentState), game.puzzleCurrentState);
      originalBoard = parseApiAndAddNotes(originalBoard, game.puzzleCurrentNotesState, true);
      let puzzleSolution = game.puzzleSolution;
      return { board, originalBoard, puzzleSolution };
    });

    let drillSolutionCells = getDrillSolutionCells(board, puzzleSolution, props.strategies);

    return {
      board, history: List.of(board), historyOffSet: 0, drillSolutionCells, originalBoard, solution: puzzleSolution
    };
  }
  else if (props.gameType == 'Demo'){
    game = Puzzles.getRandomGame()
    let board = makeBoard(strPuzzleToArray(game[0].puzzle), game[0].puzzle);
    return {
      board,
      history: List.of(board),
      historyOffSet: 0,
      solution: game[0].puzzleSolution,
      activeGame: game,
    };
  }

  return gameData;
}

// for each cell that is a part of the hint, store the coordinates and the resulting state
// if there is a notes field for the cell, the notes must match
// if there is a value field for the cell, the value must match
function getDrillSolutionCells(board, solution, strategies)
{
  let drillSolutionCells = [];
  let hint = getHint(board, solution, strategies);
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
  }
  return drillSolutionCells;
};

// https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds
const formatTime = (inputSeconds: number) => {
  // Get minutes and remaining seconds
  const days = Math.floor(inputSeconds / (3600*24));
  const hours = Math.floor(inputSeconds % (3600*24) / 3600);
  const minutes = Math.floor(inputSeconds % 3600 / 60);
  const seconds = Math.floor(inputSeconds % 60);
  // Pad with zeros if needed
  const paddedDays = days > 0 ? (days < 10 ? "0" : "") + days + ":" : "";
  const paddedHours = hours > 0 ? (hours < 10 ? "0" : "") + hours + ":" : (hours == 0 && days != 0) ? "00" : "";
  const paddedMinutes = minutes > 0 ? (minutes < 10 ? "0" : "") + minutes + ":" : (minutes == 0 && hours != 0) ? "00" : "";
  const paddedSeconds = seconds > 0 ? (seconds < 10 ? "0" : "") + seconds : (seconds == 0 && minutes != 0) ? "00" : "";

  // Return formatted string
  return `${paddedDays}${paddedHours}${paddedMinutes}${paddedSeconds}`;
};

const NumberControl = (props) => {
  const { prefilled, inNoteMode, fillNumber, addNumberAsNote, inHintMode } = props;
  const cellSize = getCellSize();
  return (
    <View style={ styles(cellSize).numberControlRow }>
      {range(9).map((i) => {
        const number = i + 1;
        const onClick = () => {
            inNoteMode
              ? addNumberAsNote(number)
              : fillNumber(number);
        }
        return ( // Number Keys
          <Pressable key={number} onPress={onClick} disabled={prefilled || inHintMode} style={ styles(cellSize).numberContainer }>
            <Text style={styles(cellSize).numberControlText}>{number}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

NumberControl.propTypes = {
  prefilled: PropTypes.bool.isRequired,
  inNoteMode: PropTypes.bool.isRequired,
  fillNumber: PropTypes.func.isRequired,
  addNumberAsNote: PropTypes.func.isRequired,
  inHintMode: PropTypes.bool.isRequired,
};

NumberControl.defaultProps = {
};

const Puzzle = (props) => {
  const { board, renderCell } = props;
  const cellSize = getCellSize();

  return (
    <View style={styles(cellSize).hintAndPuzzleContainer}>
      <View style={styles().boardContainer}>
        {board.get('puzzle').map((row, i) => (
          <View key={i} style={styles().rowContainer}>
            { row.map((cell, j) => renderCell(cell, i, j)).toArray() }
          </View>
        )).toArray()}
      </View>
    </View>
  );
}

Puzzle.propTypes = {
  board: PropTypes.any,
  inHintMode: PropTypes.bool,
  renderCell: PropTypes.func.isRequired,
  rightArrowClicked: PropTypes.func.isRequired,
  leftArrowClicked: PropTypes.func.isRequired,
  checkMarkClicked: PropTypes.func.isRequired,
  onFirstStep: PropTypes.bool,
  onFinalStep: PropTypes.bool,
};

Puzzle.defaultProps = {
};

// function that converts x,y cell coords to a number
const getCellNumber = (x, y) => {
  return y + x * 9;
};

const getBoxIndexFromCellNum = (cellNum) => {
  return Math.floor((cellNum % 9) / 3);
}

const getBoxIndexFromXY = (x,y) => {
  return Math.floor(x / 3) * 3 + Math.floor(y / 3);
}

const print = (str, contents) => {
  console.log(str)
  console.log(contents)
}

const getCausesFromHint = (hint) => {
  let causes = []
  for (let i = 0; i < hint.cause.length; i++)
  {
    causes.push(hint.cause[i])
  }
  return causes
}

const getGroupsFromHint = (hint) => {
  let groups = []
  let temp = {}
  for (let i = 0; i < hint.groups.length; i++)
  {
    temp = {}
    switch (hint.groups[i][0])
    {
      case 0: // column
        temp.type = "col"
        temp.index = hint.groups[i][1]
        break;
      case 1: // row
        temp.type = "row"
        temp.index = hint.groups[i][1]
        break;
      case 2: // box
        temp.type = "box"
        temp.index = hint.groups[i][1]
        break;
    }
    groups.push(temp)
  }
  return groups
}

const getPlacementsFromHint = (hint) => {
  let placements = []
  let temp = {}
  for (let i = 0; i < hint.placements.length; i++)
  {
    temp = {}
    temp.position = []
    temp.position.push(hint.placements[i][0])
    temp.position.push(hint.placements[i][1])
    temp.value = hint.placements[i][2]
    placements.push(temp)
  }
  return placements
}

const getRemovalsFromHint = (board, hint) => {
  let removals = []
  let temp = {}
  for (let i = 0; i < hint.removals.length; i++)
  {
    let x = hint.removals[i][0]
    let y = hint.removals[i][1]
    temp = {}
    temp.position = []
    temp.position.push(x)
    temp.position.push(y)
    temp.values = []
    temp.values.push()
    for (let j = 2; j < hint.removals[i].length; j++)
      temp.values.push(hint.removals[i][j])

    removals.push(temp)
  }
  return removals
}

// let demoHighlightInput = [[0,7, darkBrown], [1,5, darkBrown], [2,0], [3, 4, 6, gold]];

async function saveGame(activeGame) {
    let token = null;

    await getKeyString("access_token").then(result => {
      token = result;
    });

    activeGame.currentTime = globalTime;

    Puzzles.saveGame(url, activeGame, activeGame.puzzle, token).then(res => {
        if (res) {
            console.log("Game progress was saved successfully!");
        }
    });
}

async function finishGame(activeGame, showResults) {
    let token = null;

    await getKeyString("access_token").then(result => {
        token = result;
    });

    Puzzles.finishGame(url, activeGame.puzzle, token).then(res => {
        if (res) {
          showResults(res.score, res.solveTime, res.numHintsUsed, res.numWrongCellsPlayed, res.difficulty);
        }
    });
}

function replaceChar(origString, replaceChar, index) {
  let firstPart = origString.substr(0, index);
  let lastPart = origString.substr(index + 1);

  let newString = firstPart + replaceChar + lastPart;
  return newString;
}

const checkSolution = (solution, x, y, value) => {
  let cellNum = getCellNumber(y, x); // Flipping x and y because of how the solution string is formatted
  let solutionValue = solution.charAt(cellNum);
  
  if (solutionValue == value)
    return true;
  else
    return false;
}

let puzzleString = "";
let notesString = "";

const Cell = (props) => {
  const { value, onClick, isPeer, isBox, isRow, isColumn, isSelected, sameValue, prefilled, notes, conflict, x, y, inHintMode, hintSteps, currentStep, game, showResults, gameType } = props;
  const cellSize = getCellSize();

  let bgColor = '#808080';
  let isRemovalHighlight = [false, false, false, false, false, false, false, false, false];
  let isPlacementHighlight = [false, false, false, false, false, false, false, false, false];

  const { isHighlightSet, isHighlightBox, isHighlightRow, isHighlightColumn } = React.useContext(PreferencesContext);

  const highlightPeers = (isHighlightBox && isHighlightRow && isHighlightColumn);

  if (inHintMode && currentStep > -1)
  {
    let currentHint = hintSteps[currentStep];

    if (currentHint.groups) // group highlighting
    {
      for (let i = 0; i < currentHint.groups.length; i++)
      {
        // if the col matches hint, highlight the current col
        if (currentHint.groups[i].type == "col" && x === currentHint.groups[i].index)
          bgColor = "white";
        // if the row matches hint, highlight the current row
        if (currentHint.groups[i].type == "row" && y === currentHint.groups[i].index)
          bgColor = "white";
        // if the row matches hint, highlight the current row
        if (currentHint.groups[i].type == "box" && getBoxIndexFromXY(x, y) === currentHint.groups[i].index)
          bgColor = "white";
      }
    }
    if (currentHint.causes) // cause highlighting
    {
      for (let i = 0; i < currentHint.causes.length; i++)
      {
        let currentCause_x = currentHint.causes[i][0];
        let currentCause_y = currentHint.causes[i][1];
        if (currentCause_x == x && currentCause_y == y)
        {
          // naked single hard code override
          if (currentHint.placements) bgColor = "white";
          else bgColor = gold;
        }
      }
    }
    // This handles just the styling, note deletion is not possible since the state would change during a render
    if (currentHint.removals) // removal highlighting
    {
      for (let i = 0; i < currentHint.removals.length; i++)
      {
        let currentRemoval = currentHint.removals[i];
        let currentRemoval_x = currentRemoval.position[0];
        let currentRemoval_y = currentRemoval.position[1];
        if (currentRemoval_x == x && currentRemoval_y == y)
        {
          if (currentRemoval.mode == "highlight")
          {
            for (let j = 0; j < currentRemoval.values.length; j++)
              isRemovalHighlight[currentRemoval.values[j] - 1] = true;
          }
        }
      }
    }

    if (currentHint.placements) // placement highlighting
    {
        let currentPlacement = currentHint.placements;
        let currentPlacement_x = currentPlacement.position[0];
        let currentPlacement_y = currentPlacement.position[1];
        if (currentPlacement_x == x && currentPlacement_y == y)
        {
          if (currentPlacement.mode == "highlight")
          {
            isPlacementHighlight[currentPlacement.value - 1] = true;
          }
        }
    }
  }

  if (!drillMode && !landingMode)
  {
    // Check and see if getCellNumber(x, y) is 0, if so, clear the puzzleString and notesString strings and then add the value of the cell to the puzzleString string, if null, add a 0
    if (getCellNumber(x, y) === 0)
    {
      puzzleString = "";
      notesString = "";
    }

    puzzleString += value ? value : 0;

    // Get the set of the notes for the cell, if null, add a 0, otherwise, add a 1 if the number is in the set, otherwise, add a 0.
    if (notes === null)
    {
      notesString += "000000000";
    }
    else
    {
      for (let i = 1; i <= 9; i++)
      {
        notesString += notes.has(i) ? 1 : 0;
      }
    }

    // Check and see if getCellNumber(x, y) is 80, if so, add the puzzleString and notesString strings to the activeGameData.moves array
    if (getCellNumber(x, y) === 80)
    {

      let flippedPuzzleString = "000000000000000000000000000000000000000000000000000000000000000000000000000000000";

      // flip the puzzleString so it is correct orientation.
      for (let i = 0; i < puzzleString.length/9; i++)
        for (let j = 0; j < puzzleString.length/9; j++)
          flippedPuzzleString = replaceChar(flippedPuzzleString, puzzleString.charAt((j*9+i)), j+(i*9));

      // If there's no moves in the moves array, add the current move to the moves array
      if (game.moves.length === 0) {
        game.moves.push({ puzzleCurrentState: flippedPuzzleString, puzzleCurrentNotesState: notesString });
        saveGame(game);
      }

      // If there's a difference between the last move and the current move, replace previous move with current move
      else if (game.moves[0].puzzleCurrentState !== flippedPuzzleString
      || game.moves[0].puzzleCurrentNotesState !== notesString) {
        game.moves[0].puzzleCurrentState = flippedPuzzleString;
        game.moves[0].puzzleCurrentNotesState = notesString;
        saveGame(game);
      }

      // If all cells are filled in with the correct values, we want to finish the game
      if (flippedPuzzleString == game.puzzleSolution && (gameType != 'Demo')){
          finishGame(game, showResults);
      }
    }
  }

  const getNoteContents = (noteVal) =>
  {
    if (notes.has(noteVal))
    {
      let styleVal = styles(cellSize).noteText;
      if (isRemovalHighlight[noteVal - 1]) styleVal = styles(cellSize).removalNoteText;
      else if (isPlacementHighlight[noteVal - 1]) styleVal = styles(cellSize).placementNoteText;

      return <Text style={styleVal}>{noteVal}</Text>
    }
  }

  return ( // Sudoku Cells
    <Pressable onPress={() => onClick(x, y)} disabled={landingMode}>
      <View style={[styles(cellSize).cellView,
        (x % 3 === 0) && {borderLeftWidth: styles(cellSize).hardLineThickness.thickness},
        (y % 3 === 0) && {borderTopWidth: styles(cellSize).hardLineThickness.thickness},
        (x === 8) && {borderRightWidth: styles(cellSize).hardLineThickness.thickness},
        (y === 8) && {borderBottomWidth: styles(cellSize).hardLineThickness.thickness},

        // Border Highlighting
        (inHintMode) && bgColor && {backgroundColor: bgColor},

        (!inHintMode && conflict) && styles(cellSize).conflict,
        (!inHintMode && !conflict && highlightPeers && isPeer) && styles(cellSize).peer,
        (!inHintMode && !conflict && !highlightPeers && isHighlightBox && isBox && isPeer) && styles(cellSize).peer,
        (!inHintMode && !conflict && !highlightPeers && isHighlightRow && isRow && isPeer) && styles(cellSize).peer,
        (!inHintMode && !conflict && !highlightPeers && isHighlightColumn && isColumn && isPeer) && styles(cellSize).peer,
        (!inHintMode && !conflict && sameValue && isHighlightSet) && styles(cellSize).sameValue,
        (!inHintMode && conflict && isSelected) && styles(cellSize).selectedConflict,
        (!inHintMode && !conflict && isSelected) && styles(cellSize).selected]}>
        {
          notes ?
            <View style={styles(cellSize).noteViewParent}>
              <View style={{ flexDirection: 'row' }}>
                <View>
                  <View style={styles(cellSize).noteViewElement} >{getNoteContents(1)}</View>
                  <View style={styles(cellSize).noteViewElement} >{getNoteContents(4)}</View>
                  <View style={styles(cellSize).noteViewElement} >{getNoteContents(7)}</View>
                </View>
                <View>
                  <View style={styles(cellSize).noteViewElement} >{getNoteContents(2)}</View>
                  <View style={styles(cellSize).noteViewElement} >{getNoteContents(5)}</View>
                  <View style={styles(cellSize).noteViewElement} >{getNoteContents(8)}</View>
                </View>
                <View>
                  <View style={styles(cellSize).noteViewElement} >{getNoteContents(3)}</View>
                  <View style={styles(cellSize).noteViewElement} >{getNoteContents(6)}</View>
                  <View style={styles(cellSize).noteViewElement} >{getNoteContents(9)}</View>
                </View>
              </View>
            </View>
            : value && <Text style={[styles(cellSize, null).cellText,
            (!inHintMode && conflict && styles(cellSize).conflict,
            (!inHintMode && conflict && isSelected) && styles(cellSize).selectedConflict,
            (!inHintMode && prefilled) && styles(cellSize).prefilled)]}>{value}
          </Text>
        }
      </View>
    </Pressable>
  );
};

Cell.propTypes = {
    value: PropTypes.number,
    onClick: PropTypes.func.isRequired,
    isPeer: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    sameValue: PropTypes.bool.isRequired,
    prefilled: PropTypes.bool.isRequired,
    notes: PropTypes.instanceOf(Set),
    conflict: PropTypes.bool.isRequired,
    eraseSelected: PropTypes.func.isRequired,
    inHintMode: PropTypes.bool,
    hintSteps: PropTypes.any,
    currentStep: PropTypes.number,
};

Cell.defaultProps = {
    notes: null,
    value: null,
    inHintMode: false,
};

const ActionRow = (props) => {
  const { history, prefilled, inNoteMode, undo, toggleNoteMode, eraseSelected, toggleHintMode, updateBoardInPlace, inHintMode, boardHasConflict } = props;
  const cellSize = getCellSize();

  const sizeConst = (Platform.OS == 'web') ? 1.5 : 1;

  return (
    <View style={styles(cellSize).actionControlRow}>
      {/* Undo */}
      <Pressable onPress={undo} disabled={!history.size || inHintMode}>
        <MaterialCommunityIcons color="white" name="undo" size={cellSize/(sizeConst)}/>
      </Pressable>
      {/* Note mode */}
      <Pressable onPress={toggleNoteMode} disabled={inHintMode}>
        {inNoteMode
            ? // note mode on
          <MaterialCommunityIcons color="white" name="pencil-outline" size={cellSize/(sizeConst)}/>
            : // note mode off
          <MaterialCommunityIcons color="white" name="pencil-off-outline" size={cellSize/(sizeConst)}/>
        }
      </Pressable>
      {/* Erase */}
      <Pressable onPress={eraseSelected} disabled={prefilled || inHintMode}>
        <MaterialCommunityIcons color="white" name="eraser" size={cellSize/(sizeConst)}/>
      </Pressable>
      {/* Hint */}
      <Pressable onPress={ !boardHasConflict() ? updateBoardInPlace && toggleHintMode : null }>
        <MaterialCommunityIcons color="white" name="help" size={cellSize/(sizeConst)}/>
      </Pressable>
    </View>
  );
};

ActionRow.propTypes = {
  inNoteMode: PropTypes.bool.isRequired,
  prefilled: PropTypes.bool.isRequired,
  undo: PropTypes.func.isRequired,
  toggleNoteMode: PropTypes.func.isRequired,
  eraseSelected: PropTypes.func.isRequired,
  toggleHintMode: PropTypes.func.isRequired,
  updateBoardInPlace: PropTypes.func.isRequired,
  inHintMode: PropTypes.bool.isRequired,
  boardHasConflict: PropTypes.func.isRequired,
};

const SubmitButton = (props) => {
  const { isDrillSolutionCorrect, navigation } = props;
  const cellSize = getCellSize();

  return (
    <Pressable onPress={() => { if (isDrillSolutionCorrect()) navigation.navigate('Main Page') }}>
      <View style={styles(cellSize).submitButtonView}>
        <Text style={styles(cellSize).submitButtonText}>
          Submit
        </Text>
      </View>
    </Pressable>
  );
};

SubmitButton.propTypes = {
  isDrillSolutionCorrect: PropTypes.func.isRequired,
};

const PauseButton = ({ handlePause, isPaused }) => {
  const cellSize = getCellSize();
  const sizeConst = (Platform.OS == 'web') ? 1.5 : 1;
  return(
    <Pressable onPress={handlePause}>
      {
        (isPaused) ?
            <MaterialCommunityIcons color="white" name="play" size={cellSize/(sizeConst)}/> :
            <MaterialCommunityIcons color="white" name="pause" size={cellSize/(sizeConst)}/>
      }
    </Pressable>
  )
}

const HeaderRow = ( props ) => { //  Header w/ timer and pause button
    const { currentTime, activeGame } = props;
    const [time, setTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const cellSize = getCellSize();
    const navigation = useNavigation();

    // If we are resuming game, set starting time to currentTime
    if (time == 0 && currentTime != 0)
    {
      setTime(currentTime);
    }
    // if we are starting a new game, reset globalTime
    else if (time == 0 && globalTime != 0)
    {
      globalTime = 0;
    }

    useFocusEffect(
      React.useCallback(() => {
        let interval = null;
        if (!isPaused) {
            interval = setInterval(() => {
                setTime(time => time + 1);
                globalTime = globalTime + 1;
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
      }, [isPaused])
    );

    const handlePause = () => {
        // setIsPaused(prevState => !prevState);
        // saveGame(activeGame).then(() => {
        //   navigation.replace('Home');
        // });
        saveGame(activeGame);
        navigation.replace('Home');
    };

    return (
        <View style={styles(cellSize).headerControlRow}>
            <Text style={styles(cellSize).headerFont}>Time: {formatTime(time)}</Text>
            <PauseButton handlePause={handlePause} isPaused={isPaused} />
        </View>
    );
}

HeaderRow.propTypes = {
    paused: PropTypes.bool.isRequired,
}

HeaderRow.defaultProps = {
    paused: false,
}

const HintSection = (props) => {
  const { hintStratName, hintInfo, hintAction, currentStep, rightArrowClicked, leftArrowClicked, checkMarkClicked, onFirstStep, onFinalStep } = props;
  const cellSize = getCellSize();
  const sizeConst = (Platform.OS == 'web') ? 1.5 : 1;
  
  const isRightArrowRendered = (onFinalStep) =>
  {
    return !onFinalStep;
  }

  const isLeftArrowRendered = (onFirstStep) =>
  {
    return !onFirstStep;
  }

  const isCheckMarkRendered = (onFinalStep) =>
  {
    return onFinalStep;
  }

  return (
    <View style={styles(cellSize).hintSectionContainer}>
      {(isLeftArrowRendered(onFirstStep))
        ? // checkcircleo
        <Pressable onPress={leftArrowClicked}>
          <AntDesign color="white" name="leftcircleo" size={cellSize/(sizeConst)}/>
        </Pressable>
        :
        <View style={styles(cellSize, sizeConst).hintArrowPlaceholderView}></View>
      }
      <View style={styles(cellSize).hintTextContainer}>
        <View style={styles(cellSize).hintStratNameView}>
          <Text style={styles(cellSize).hintStratNameText}>{hintStratName}</Text>
        </View>
        <View style={styles(cellSize).hintActionInfoView}>
          <Text style={styles(cellSize).hintActionInfoText}>{currentStep == 0 ? hintInfo : hintAction}</Text>
        </View>
      </View>
      {(isRightArrowRendered(onFinalStep))
        ?
        <Pressable onPress={rightArrowClicked}>
          <AntDesign color="white" name="rightcircleo" size={cellSize/(sizeConst)}/>
        </Pressable>
        :
        (isCheckMarkRendered(onFinalStep))
          ?
          <Pressable onPress={checkMarkClicked}>
            <AntDesign color="white" name="checkcircle" size={cellSize/(sizeConst)}/>
          </Pressable>
          :
          <View style={styles(cellSize, sizeConst).hintArrowPlaceholderView}></View>
      }
    </View>
  );
}

/*
 * This function retrieves the user's device size and calculates the cell size
 * board has width and height dimensions of 1 x 1.44444
 */
function getCellSize()
{
  const size = useWindowDimensions();
  
  return Math.min(size.width * 1.44444, size.height) / 15;
}

function updateBoardWithNumber({ x, y, number, fill = true, board }) {

  let cell = board.get('puzzle').getIn([x, y]);
  cell = cell.delete('notes');
  cell = fill ? cell.set('value', number) : cell.delete('value');

  const increment = fill ? 1 : -1;
  const rowPath = ['choices', 'rows', x, number];
  const columnPath = ['choices', 'columns', y, number];
  const squarePath = ['choices', 'squares', ((Math.floor(x / 3)) * 3) + Math.floor(y / 3), number];
  
  return board.setIn(rowPath, board.getIn(rowPath) + increment)
    .setIn(columnPath, board.getIn(columnPath) + increment)
    .setIn(squarePath, board.getIn(squarePath) + increment)
    .setIn(['puzzle', x, y], cell);
}

function getNumberOfGroupsAssignedForNumber(number, groups) {
  return groups.reduce((accumulator, row) =>
    accumulator + (row.get(number) > 0 ? 1 : 0), 0);
}

export default class SudokuBoard extends React.Component<any, any, any, any, any> {
  constructor(props) {
    super(props);
  };
  state = generateGame(USERACTIVEGAMESBFFURL, this.props);

  componentDidMount = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then((reg) => {
        console.log('ServiceWorker scope: ', reg.scope);
        console.log('service worker registration successful');
      }).catch((err) => {
        console.warn('service worker registration failed', err.message);
      });
    }
  }

  getSelectedCell = () => {
    const { board } = this.state;
    const selected = board.get('selected');
    return selected && board.get('puzzle').getIn([selected.x, selected.y]);
  }

  getNumberValueCount = (number) => {
    const rows = this.state.board.getIn(['choices', 'rows']);
    const columns = this.state.board.getIn(['choices', 'columns']);
    const squares = this.state.board.getIn(['choices', 'squares']);
    return Math.min(
      getNumberOfGroupsAssignedForNumber(number, squares),
      Math.min(
        getNumberOfGroupsAssignedForNumber(number, rows),
        getNumberOfGroupsAssignedForNumber(number, columns),
      ),
    );
  }

  addNumberAsNote = (number) => {
    let { board, solution } = this.state;
    let selectedCell = this.getSelectedCell();
    if (!selectedCell) return;
    const prefilled = selectedCell.get('prefilled');
    if (prefilled) return;
    const { x, y } = board.get('selected');
    const currentValue = selectedCell.get('value');
    if (currentValue) {
      board = updateBoardWithNumber({
        x, y, number: currentValue, fill: false, board: this.state.board,
      });
    }
    let notes = selectedCell.get('notes') || Set();
    let actualValue = solution ? solution[x][y] : -1;
    if (notes.has(number)) {
      if (number !== actualValue)
        notes = notes.delete(number);
    } else {
      notes = notes.add(number);
    }
    selectedCell = selectedCell.set('notes', notes);
    selectedCell = selectedCell.delete('value');
    board = board.setIn(['puzzle', x, y], selectedCell);
    this.updateBoard(board);
  };

  updateBoard = (newBoard) => {
    let { history } = this.state;
    const { historyOffSet } = this.state;
    history = history.slice(0, historyOffSet + 1);
    history = history.push(newBoard);
    this.setState({ board: newBoard, history, historyOffSet: history.size - 1 });
  };

  updateBoardInPlace = () => {
    let { board, history } = this.state;
    const { historyOffSet } = this.state;
    history = history.slice(0, historyOffSet + 1);
    history = history.push(board);
    this.setState({ board, history, historyOffSet: history.size - 1 });
  }

  canUndo = () => this.state.historyOffSet > 0

  redo = () => {
    const { history } = this.state;
    let { historyOffSet } = this.state;
    if (history.size) {
      historyOffSet = Math.min(history.size - 1, historyOffSet + 1);
      const board = history.get(historyOffSet);
      this.setState({ board, historyOffSet });
    }
  };

  undo = () => {
    const { history } = this.state;
    let { historyOffSet, board } = this.state;
    if (history.size) {
      historyOffSet = Math.max(0, historyOffSet - 1);
      board = history.get(historyOffSet);
      this.setState({ board, historyOffSet, history });
    }
  };

  toggleNoteMode = () => {
    let { board } = this.state;
    let currNoteMode = board.get('inNoteMode');
    board = board.set('inNoteMode', !currNoteMode);
    this.setState({ board });
  }

  toggleHintMode = () => {
    let { board, solution } = this.state;
    let newHintMode = !board.get('inHintMode');
    board = board.set('inHintMode', newHintMode);

    // Increment global hint value by one
    if ((this.props.gameType != 'StartDrill') && newHintMode) {
      this.state.activeGame[0].numHintsUsed++;
    }

    if (!newHintMode)
    {
      let hintStepsLength = board.get('hintSteps').length;
      let currentStep = board.get('currentStep');

      // if they prematurely exit hint mode, undo the hint
      if (currentStep < hintStepsLength - 1)
      {
        this.undo();
      }

      board = board.set('currentStep', -1);
      board = board.set('hintSteps', []);

      // if they are on the final step, push the hint operation to the history stack
      if (currentStep == hintStepsLength - 1) this.updateBoard(board);
      else this.setState({ board });
      return;
    }
    board = board.set('currentStep', 0);
    let hint = solution ? getHint(board, solution, this.props.strategies) : getHint(board, null, this.props.strategies);

    if (!hint) return;
    const words = hint.strategy.toLowerCase().replaceAll('_', ' ').split(" ");
    for (let i = 0; i < words.length; i++)
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    hintStratName = words.join(" ");
    board = board.set('hintStratName', hintStratName);
    const hintInfo = hint.info;
    board = board.set('hintInfo', hintInfo);
    const hintAction = hint.action;
    board = board.set('hintAction', hintAction);

    let causes = []
    let groups = []
    let placements = []
    let removals = []
    if (hint)
    {
      if (hint.cause) causes = getCausesFromHint(hint);
      if (hint.groups) groups = getGroupsFromHint(hint);
      if (hint.placements) placements = getPlacementsFromHint(hint);
      if (hint.removals) removals = getRemovalsFromHint(board, hint);
    }

    let boxGroups = []
    let nonBoxGroups = []

    let hintSteps = []
    switch (hint.strategy)
    {
      case "AMEND_NOTES": // ...done? TODO: try to get weird undo stuff worked out
        for (let i = 0; i < removals.length; i++)
          board = this.addEveryNote(removals[i].position[0], removals[i].position[1], board);

        // two steps, two objects
        hintSteps.push({})
        hintSteps.push({})

        // highlight the groups, causes, and removals
        hintSteps[0].groups = groups;
        hintSteps[0].causes = causes;
        hintSteps[0].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[0].removals.push({ ...removals[i], mode: "highlight" });

        // highlight the groups, causes, and delete the removals
        hintSteps[1].groups = groups;
        hintSteps[1].causes = causes;
        hintSteps[1].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[1].removals.push({ ...removals[i], mode: "delete" });
        break;
      case "SIMPLIFY_NOTES": // DONE
        // two steps, two objects
        hintSteps.push({})
        hintSteps.push({})

        // highlight the groups, causes, and removals
        hintSteps[0].groups = groups;
        hintSteps[0].causes = causes;
        hintSteps[0].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[0].removals.push({ ...removals[i], mode: "highlight" });

        // highlight the groups, causes, and delete the removals
        hintSteps[1].groups = groups;
        hintSteps[1].causes = causes;
        hintSteps[1].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[1].removals.push({ ...removals[i], mode: "delete" });
        break;
      case "NAKED_SINGLE": // DONE
        // two steps, two objects
        hintSteps.push({})
        hintSteps.push({})

        // highlight the cause and placement
        hintSteps[0].causes = causes;
        hintSteps[0].placements = { ...placements[0], mode: "highlight" };

        // highlight the cause and insert the placement
        hintSteps[1].causes = causes;
        hintSteps[1].placements = { ...placements[0], mode: "place" };
        break;
      case "NAKED_PAIR": // DONE
      case "NAKED_TRIPLET": // DONE
      case "NAKED_QUADRUPLET": // DONE
        // two steps, two objects
        hintSteps.push({})
        hintSteps.push({})

        // highlight the groups, causes, and removals
        hintSteps[0].groups = groups;
        hintSteps[0].causes = causes;
        hintSteps[0].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[0].removals.push({ ...removals[i], mode: "highlight" });

        // highlight the groups, causes, and delete the removals
        hintSteps[1].groups = groups;
        hintSteps[1].causes = causes;
        hintSteps[1].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[1].removals.push({ ...removals[i], mode: "delete" });
        break;
      case "HIDDEN_SINGLE": // DONE
      case "HIDDEN_PAIR": // DONE
      case "HIDDEN_TRIPLET": // DONE
      case "HIDDEN_QUADRUPLET": // DONE
        // two steps, two objects
        hintSteps.push({})
        hintSteps.push({})

        // highlight the groups, causes, and removals
        hintSteps[0].groups = groups;
        hintSteps[0].causes = causes;
        hintSteps[0].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[0].removals.push({ ...removals[i], mode: "highlight" });

        // highlight the groups, causes, and delete the removals
        hintSteps[1].groups = groups;
        hintSteps[1].causes = causes;
        hintSteps[1].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[1].removals.push({ ...removals[i], mode: "delete" });
        break;
      case "POINTING_PAIR":
      case "POINTING_TRIPLET":
        console.log("Pointing Set");
        // three steps, three objects
        hintSteps.push({}) // box and causes
        hintSteps.push({}) // row/col and rem highlight
        hintSteps.push({}) // row/col and rem delete

        // seperate the groups which are boxes and which are not boxes
        for (let i = 0; i < groups.length; i++)
          if (groups[i][0] === 2)
            boxGroups.push(groups[i])
          else
            nonBoxGroups.push(groups[i])
        
        // highlight the boxGroups and causes
        hintSteps[0].groups = boxGroups;
        hintSteps[0].causes = causes;
        hintSteps[0].removals = [];
        
        // highlight the nonBoxGroups, causes, and removals
        hintSteps[1].groups = nonBoxGroups;
        hintSteps[1].causes = causes;
        hintSteps[1].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[1].removals.push({ ...removals[i], mode: "highlight" });
        
        // highlight the nonBoxGroups, causes, and removals
        hintSteps[2].groups = nonBoxGroups;
        hintSteps[2].causes = causes;
        hintSteps[2].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[2].removals.push({ ...removals[i], mode: "delete" });
        break;
      case "BOX_LINE_REDUCTION": // DONE
        // three steps, three objects
        hintSteps.push({}) // box and causes
        hintSteps.push({}) // row/col and rem highlight
        hintSteps.push({}) // row/col and rem delete

        // seperate the groups which are boxes and which are not boxes
        for (let i = 0; i < groups.length; i++)
          if (groups[i].type == "box")
            boxGroups.push(groups[i])
          else
            nonBoxGroups.push(groups[i])
        
        // highlight the nonBoxGroups and causes
        hintSteps[0].groups = nonBoxGroups;
        hintSteps[0].causes = causes;
        hintSteps[0].removals = [];
        
        // highlight the boxGroups, causes, and removals
        hintSteps[1].groups = boxGroups;
        hintSteps[1].causes = causes;
        hintSteps[1].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[1].removals.push({ ...removals[i], mode: "highlight" });
        
        // highlight the nonBoxGroups, causes, and removals
        hintSteps[2].groups = nonBoxGroups;
        hintSteps[2].causes = causes;
        hintSteps[2].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[2].removals.push({ ...removals[i], mode: "delete" });
        break;
      case "X_WING":
        console.log("X Wing");
        break;
      case "SWORDFISH":
        console.log("Swordfish");
        break;
      case "SINGLES_CHAINING":
        console.log("Singles Chaining");
        break;
      default:
        console.log("the switch statement matched none of the strategies :(")
        break;
    }
    board = board.set('hintSteps', hintSteps);
    this.setState({ board });
  }

  addValueFromPlacement = (x, y, valueToAdd, currentStep) => {
    let { board } = this.state;
    board = board.set('currentStep', currentStep);
    board = updateBoardWithNumber({
      x, y, number: valueToAdd, fill: true, board,
    });
    return board;
  }

  deleteValueFromPlacement = (x, y, valueToRemove, currentStep) => {
    let { board } = this.state;
    board = board.set('currentStep', currentStep);
    board = updateBoardWithNumber({
      x, y, number: valueToRemove, fill: false, board,
    });
    board = board.setIn(['puzzle', x, y, 'notes'], Set.of(valueToRemove));
    return board;
  }

  addEveryNote = (x, y, board) => {
    // let { board } = this.state;
    let notes = board.get('puzzle').getIn([x, y]).get('notes') || Set();
    for (let i = 1; i <= 9; i++)
    {
      if (!notes.has(i))
      {
        notes = notes.add(i);
      }
    }
    board = board.setIn(['puzzle', x, y, 'notes'], notes);
    return board;
  }

  addNotesFromRemovals = (x, y, notesToAdd, currentStep, board) => {
    let notes = board.get('puzzle').getIn([x, y]).get('notes') || Set();
    board = board.set('currentStep', currentStep);
    for (let i = 0; i < notesToAdd.length; i++)
    {
      if (!notes.has(notesToAdd[i]))
      {
        notes = notes.add(notesToAdd[i]);
      }
    }
    board = board.setIn(['puzzle', x, y, 'notes'], notes);
    return board;
  }

  deleteNotesFromRemovals = (x, y, notesToRemove, currentStep, board) => {
    board = board.set('currentStep', currentStep);
    let notes = board.get('puzzle').getIn([x, y]).get('notes') || Set();
    for (let i = 0; i < notesToRemove.length; i++)
    {
      if (notes.has(notesToRemove[i]))
      {
        notes = notes.delete(notesToRemove[i]);
      }
    }
    board = board.setIn(['puzzle', x, y, 'notes'], notes);
    return board;
  }

  /*
    * Called when the user hits the 'erase' button
    * If notes are present in selected cell, removes all notes
    * If value is present in selected cell, removes value if value is incorrect
    */
  eraseSelected = () => {
    let { board, solution } = this.state;
    let selectedCell = this.getSelectedCell();
    if (!selectedCell) return;

    const { x, y } = board.get('selected');
    const currentValue = selectedCell.get('value');

    let actualValue = solution ? solution[x][y] : -1;
    if (currentValue) {
      if (currentValue !== actualValue){
        this.fillNumber(false);
      } else {
        // User has attempted to remove a correct value
        return;
      }
    } else {
      selectedCell = selectedCell.set('notes', Set());
      board = board.setIn(['puzzle', x, y], selectedCell);
      this.updateBoard(board);
    }
  }

  fillNumber = (number) => {
    let { board, game } = this.state;
    const selectedCell = this.getSelectedCell();
    if (!selectedCell) return;
    const prefilled = selectedCell.get('prefilled');
    if (prefilled) return;
    const { x, y } = board.get('selected');
    const currentValue = selectedCell.get('value');
    if (currentValue) {
      board = updateBoardWithNumber({
        x, y, number: currentValue, fill: false, board: this.state.board,
      });
    }
    const setNumber = currentValue !== number && number;
    if (setNumber) {
      board = updateBoardWithNumber({
        x, y, number, fill: true, board,
      });

      if ((this.props.gameType != 'StartDrill') && !checkSolution(this.state.activeGame[0].puzzleSolution, x, y, number)){
        this.state.activeGame[0].numWrongCellsPlayed++;
      }
    }
    this.updateBoard(board);
  };

  selectCell = (x, y) => {
    let { board } = this.state;
    board = board.set('selected', { x, y });
    this.setState({ board });
  };

  isConflict = (i, j) => {
    const { value } = this.state.board.getIn(['puzzle', i, j]).toJSON();
    if (!value) return false;

    let cellNum = getCellNumber(j, i); // Flipping x and y because of how the solution string is formatted
    let solutionValue = this.state.solution.charAt(cellNum);

    if (solutionValue == value || value == null)
      return false;
    else 
      return true;
  }

  boardHasConflict = () => {
    for (let i = 0; i < 9; i++)
      for (let j = 0; j < 9; j++)
        if (this.isConflict(i,j))
          return true;

    return false;
  }

  renderCell = (cell, x, y) => {
    const { board } = this.state;
    const selected = this.getSelectedCell();
    const { value, prefilled, notes } = cell.toJSON();
    const conflict = this.isConflict(x, y);
    const peer = areCoordinatePeers({ x, y }, board.get('selected'));
    const box = highlightBox({ x, y }, board.get('selected'));
    const row = highlightRow({ x, y }, board.get('selected'))
    const column = highlightColumn({ x, y }, board.get('selected'));
    const sameValue = !!(selected && selected.get('value') &&
      value === selected.get('value'));
    const isSelected = cell === selected;
    let inHintMode = board.get('inHintMode');
    let hintSteps = board.get('hintSteps');
    let currentStep = board.get('currentStep');

    let game = null;
    if (this.props.gameType != 'StartDrill') game = this.state.activeGame[0];

        return (
            <Cell
                prefilled={prefilled}
                notes={notes}
                sameValue={sameValue}
                isSelected={isSelected}
                isPeer={peer}
                isBox={box}
                isRow={row}
                isColumn={column}
                value={value}
                onClick={(x, y) => { this.selectCell(x, y); }}
                key={y}
                x={x}
                y={y}
                conflict={conflict}
                eraseSelected={this.eraseSelected}
                inHintMode={inHintMode}
                hintSteps={hintSteps}
                currentStep={currentStep}
                game={game}
                showResults={this.props.showGameResults}
                gameType={this.props.gameType}
            />
        );
    };

  renderTopBar = () => {
    return(
      <HeaderRow currentTime = {this.state.activeGame[0].currentTime} activeGame = {this.state.activeGame[0]}/>
    );
  }

  rightArrowClicked = () => {
    let { board } = this.state;
    let hintSteps = board.get('hintSteps');
    let currentStep = board.get('currentStep') + 1;
    if (currentStep == undefined || currentStep == hintSteps.length) return;
    board = board.set('currentStep', currentStep);
    this.setState({ board });
    if (hintSteps[currentStep].removals)
    {
      for (let i = hintSteps[currentStep].removals.length - 1; i >= 0; i--)
      {
        if (hintSteps[currentStep].removals[i].mode === "delete")
        {
          let x = hintSteps[currentStep].removals[i].position[0];
          let y = hintSteps[currentStep].removals[i].position[1];
          let notesToRemove = hintSteps[currentStep].removals[i].values;
          board = this.deleteNotesFromRemovals(x, y, notesToRemove, currentStep, board);
        }
      }
    }
    if (hintSteps[currentStep].placements)
    {
      if (hintSteps[currentStep].placements.mode === "place")
      {
        let x = hintSteps[currentStep].placements.position[0];
        let y = hintSteps[currentStep].placements.position[1];
        let valueToAdd = hintSteps[currentStep].placements.value;
        board = this.addValueFromPlacement(x, y, valueToAdd, currentStep);
      }
    }
    this.setState({ board });
  }

  leftArrowClicked = () => {
    let { board } = this.state;
    let hintSteps = board.get('hintSteps');
    let currentStep = board.get('currentStep') - 1;
    if (currentStep == undefined || currentStep < 0) return;
    board = board.set('currentStep', currentStep);
    if (hintSteps[currentStep].removals)
    {
      for (let i = 0; i < hintSteps[currentStep].removals.length; i++)
      {
        if (hintSteps[currentStep + 1].removals[i].mode === "delete")
        {
          let x = hintSteps[currentStep + 1].removals[i].position[0];
          let y = hintSteps[currentStep + 1].removals[i].position[1];
          let notesToRemove = hintSteps[currentStep + 1].removals[i].values;
          board = this.addNotesFromRemovals(x, y, notesToRemove, currentStep, board)
        }
      }
    }
    if (hintSteps[currentStep].placements)
    {
      if (hintSteps[currentStep + 1].placements.mode === "place")
      {
        let x = hintSteps[currentStep + 1].placements.position[0];
        let y = hintSteps[currentStep + 1].placements.position[1];
        let valueToRemove = hintSteps[currentStep + 1].placements.value;
        board = this.deleteValueFromPlacement(x, y, valueToRemove, currentStep)
      }
    }
    this.setState({ board });
  }

  checkMarkClicked = () => {
    this.toggleHintMode()
  }

  handleKeyDown = (event) => {
    const { board } = this.state;
    let inHintMode = board.get('inHintMode');
    let inNoteMode = board.get('inNoteMode');
    const inputValue = event.nativeEvent.key;
    if (/^[1-9]$/.test(inputValue) && !inHintMode && !landingMode) { // check if input is a digit from 1 to 9
      if (inNoteMode) this.addNumberAsNote(parseInt(inputValue, 10));
      else this.fillNumber(parseInt(inputValue, 10));
    }
    if ((inputValue == "Delete" || inputValue == "Backspace") && !inHintMode)
      this.eraseSelected();
  };

  renderPuzzle = () => {
    const { board } = this.state;
    let onFirstStep = false;
    let onFinalStep = false;
    if (board.get('hintSteps') != undefined)
    {
      let currentStep = board.get('currentStep');
      let numHintSteps = board.get('hintSteps').length;
      if (currentStep + 1 == 1) onFirstStep = true;
      if (currentStep + 1 == numHintSteps) onFinalStep = true;
    }
    return (
      <Puzzle
        inHintMode = { board.get('inHintMode') }
        renderCell = { this.renderCell }
        board = { board }
        rightArrowClicked = { this.rightArrowClicked }
        leftArrowClicked = { this.leftArrowClicked }
        checkMarkClicked = { this.checkMarkClicked }
        onFirstStep = { onFirstStep }
        onFinalStep = { onFinalStep }
      />
    );
  };

  renderNumberControl = () => {
      const { board } = this.state;
      const selectedCell = this.getSelectedCell();
      const prefilled = selectedCell && selectedCell.get('prefilled');
      const inNoteMode = board.get('inNoteMode');
      const inHintMode = board.get('inHintMode');
      return (
        <NumberControl
          prefilled={prefilled}
          inNoteMode={inNoteMode}
          getNumberValueCount={this.getNumberValueCount}
          fillNumber={this.fillNumber}
          addNumberAsNote={this.addNumberAsNote}
          inHintMode={inHintMode}
        />
      );
  }

  renderActions = () => {
    const { board, history } = this.state;
    const selectedCell = this.getSelectedCell();
    const prefilled = selectedCell && selectedCell.get('prefilled');
    const inNoteMode = board.get('inNoteMode');
    const inHintMode = board.get('inHintMode');
    const undo = this.undo;
    const toggleNoteMode = this.toggleNoteMode;
    const eraseSelected = this.eraseSelected;

    return (
      <ActionRow
        history={history}
        prefilled={prefilled}
        inNoteMode={inNoteMode}
        undo={undo}
        toggleNoteMode={toggleNoteMode}
        eraseSelected={eraseSelected}
        toggleHintMode={this.toggleHintMode}
        updateBoardInPlace={this.updateBoardInPlace}
        inHintMode={inHintMode}
        boardHasConflict={this.boardHasConflict}
      />
    );
  }

  renderSubmitButton = () => {
    const { navigation } = this.props;
    const isDrillSolutionCorrect = () => {
      const { drillSolutionCells, originalBoard } = this.state;
      let { board } = this.state;
      for (let i = 0; i < drillSolutionCells.length; i++)
      {
        let x = drillSolutionCells[i].x;
        let y = drillSolutionCells[i].y;
        let solutionNotes = drillSolutionCells[i].notes;
        let solutionPlacement = drillSolutionCells[i].value;
        if (solutionNotes)
        {
          let boardNotes = board.getIn(['puzzle', x, y, 'notes']) || Set();
          if (!boardNotes.equals(solutionNotes))
          {
            board = originalBoard;
            this.setState({ board }, () => {
              this.toggleHintMode();
            });
            return false;
          }
        }
        else if (solutionPlacement)
        {
          let boardValue = board.getIn(['puzzle', x, y, 'value']) || -1;
          if (boardValue != solutionPlacement)
          {
            board = originalBoard;
            this.setState({ board }, () => {
              this.toggleHintMode();
            });
            return false;
          }
        }
      }
      return true;
    }

    return (
      <SubmitButton
        isDrillSolutionCorrect={isDrillSolutionCorrect}
        navigation={navigation}
      />
    );
  }

  renderHintSection = () => {
    const { board } = this.state;
    let onFirstStep = false;
    let onFinalStep = false;
    if (board.get('hintSteps') != undefined)
    {
      let currentStep = board.get('currentStep');
      let numHintSteps = board.get('hintSteps').length;
      if (currentStep + 1 == 1) onFirstStep = true;
      if (currentStep + 1 == numHintSteps) onFinalStep = true;
    }
    hintStratName = board ? board.get('hintStratName') : "Hint";
    currentStep = board ? board.get('currentStep') : -1;
    hintInfo = board ? board.get('hintInfo') : "Info";
    hintAction = board ? board.get('hintAction') : "Action";
    return(
      <HintSection
        hintStratName={ hintStratName }
        hintInfo={ hintInfo }
        hintAction={ hintAction }
        currentStep={ currentStep }
        rightArrowClicked = { this.rightArrowClicked }
        leftArrowClicked = { this.leftArrowClicked }
        checkMarkClicked = { this.checkMarkClicked }
        onFirstStep = { onFirstStep }
        onFinalStep = { onFinalStep }
      />
    );
  }

  autoHint = () => {
    const { board } = this.state;
    if (!board.get('inHintMode'))
    {
      for (let i = 0; i < 9; i++)
      {
        for (let j = 0; j < 9; j++)
        {
          if (!checkSolution(this.state.activeGame[0].puzzleSolution, i, j, board.get('puzzle').getIn([i, j]).get('value')))
          {
            this.toggleHintMode();
            return;
          }
        }
      }
      // no value did not match the solution, so stop trying to get new steps
      clearInterval(this.interval)
    }
    else 
    {
      // if you're on the final index of the hint
      if (board.get('currentStep') + 1 === board.get('hintSteps').length)
      {
        this.checkMarkClicked();
      }
      // if you're not on the final step
      else
      {
        this.rightArrowClicked();
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  initAutoHintTimer = () => {
    if (this.props.gameType == 'Demo')
    {
      this.interval = setInterval(this.autoHint, 1500);
    }
  }

  render = () => {
    const { board } = this.state;
    if (!board)
    {
      generateGame(USERACTIVEGAMESBFFURL, this.props).then(game => {
        this.setState(game, this.initAutoHintTimer)
      })
    }
    
    drillMode = this.props.gameType == 'StartDrill';
    landingMode = this.props.gameType == 'Demo';
    inHintMode = board ? board.get('inHintMode') : false;

    return (
      <View onKeyDown={this.handleKeyDown} styles={{borderWidth: 1}}>
        {board && !landingMode && !drillMode && this.renderTopBar()}
        {board && this.renderPuzzle()}
        {board &&
          <View style={styles().bottomActions}>
            {!landingMode && this.renderActions()}
            {!landingMode && !inHintMode && this.renderNumberControl()}
            {drillMode && !inHintMode && this.renderSubmitButton()}
            {!landingMode && inHintMode && this.renderHintSection()}
          </View>
        }
      </View>
    );
  }
}