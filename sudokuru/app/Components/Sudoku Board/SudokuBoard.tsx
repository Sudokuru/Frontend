// @ts-nocheck
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, useWindowDimensions, Platform } from 'react-native';
import { Set, List, fromJS } from 'immutable';
import PropTypes from 'prop-types';

import { makePuzzle, pluck, isPeer as areCoordinatePeers, range } from './sudoku';
import { MaterialCommunityIcons } from "@expo/vector-icons";

let fallbackHeight = 30;

const styles = (cellSize) => StyleSheet.create({
  hardLineThickness : {thickness: cellSize * (3 / 40)},
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
    fontSize: cellSize ? cellSize / 4 : fallbackHeight / 4,
    fontFamily: 'Inter_100Thin',
  },
  removalNoteText: {
    fontSize: cellSize ? cellSize / 4 : fallbackHeight / 4,
    fontFamily: 'Inter_300Light',
    color: "#FF0000"
  },
  cellView: {
    height: cellSize ? cellSize : fallbackHeight,
    width: cellSize ? cellSize : fallbackHeight,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: cellSize ? cellSize / 40 : fallbackHeight / 40,
    backgroundColor: 'white',
  },
  cellText: {
    fontFamily: 'Inter_400Regular',
    fontSize: cellSize ? cellSize * (3 / 4) + 1 : fallbackHeight * (3 / 4) + 1,
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
    // FIXME why does this need border width 0 to not be thick
    borderWidth: 0,
  },
  selectedConflict: {
    // styles for cells with isSelected and conflict props
    color: '#FF0000',
    backgroundColor: '#FF7C75',
  },
  bottomActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  actionControlRow: {
    width: cellSize ? cellSize * 11 : fallbackHeight * 11,
    height: cellSize ? cellSize * (3 / 4): fallbackHeight * (3 / 4),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: cellSize ? cellSize * (1 / 2): fallbackHeight * (1 / 2),
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
});

const formatTime = (seconds) => {
  // Get minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  // Pad with zeros if needed
  const paddedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const paddedSeconds = secs < 10 ? "0" + secs : secs;
  // Return formatted string
  return `${paddedMinutes}:${paddedSeconds}`;
};  

const NumberControl = (props) => {
  const { prefilled, inNoteMode, fillNumber, addNumberAsNote } = props;
  const cellSize = getCellSize();
  return (
    <View style={ styles(cellSize).numberControlRow }>
      {range(9).map((i) => {
        const number = i + 1;
        const onClick = !prefilled
          ? () => {
            inNoteMode
              ? addNumberAsNote(number)
              : fillNumber(number);
          }
          : undefined;
        return (
          <Pressable key={number} onPress={onClick} style={ styles(cellSize).numberContainer }>
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
};

NumberControl.defaultProps = {
};

// function that converts x,y cell coords to a number
const getCellNumber = (x, y) => {
  return y + x * 9;
};

// function that returns the cell number of the top-left cell of a box based on the box number
const findBox = (box) => {
  if (box === 0) return 0;
  if (box === 1) return 27;
  if (box === 2) return 54;
  if (box === 3) return 3;
  if (box === 4) return 30;
  if (box === 5) return 57;
  if (box === 6) return 6;
  if (box === 7) return 33;
  if (box === 8) return 60;
}

const getCausesFromHint = (hint) => {
  let causes = []
  let temp = []
  for (let i = 0; i < hint.cause.length; i++)
  {
    temp = []
    temp.push(3)
    temp.push(hint.cause[i][0])
    temp.push(hint.cause[i][1])
    temp.push(darkBrown)
    causes.push(temp)
  }
  return causes
}

const getGroupsFromHint = (hint) => {
  let groups = []
  let temp = []
  for (let i = 0; i < hint.groups.length; i++)
  {
    temp = []
    temp.push(hint.groups[i][0])
    temp.push(hint.groups[i][1])
    temp.push("#FFFFFF")
    groups.push(temp)
  }
  return groups
}

const getPlacementsFromHint = (hint) => {
  let placements = []
  let temp = []
  for (let i = 0; i < hint.placements.length; i++)
  {
    temp = []
    temp.push(4)
    temp.push(hint.placements[i][0])
    temp.push(hint.placements[i][1])
    temp.push(hint.placements[i][2])
    placements.push(temp)
  }
  return placements
}

const getRemovalsFromHint = (hint) => {
  let removals = []
  let temp = []
  for (let i = 0; i < hint.removals.length; i++)
  {
    temp = []
    temp.push(5)
    temp.push([hint.removals[i][0], hint.removals[i][1]])
    for (let j = 2; j < hint.removals[i].length; j++)
    {
      temp.push(hint.removals[i][j])
    }
    removals.push(temp)
  }
  return removals
}

// cause cells
const darkBrown = "#A64732";

// placement/removal cells
const gold = "#F2CA7E";

// let demoHighlightInput = [[0,7, darkBrown], [1,5, darkBrown], [2,0], [3, 4, 6, gold]];

const Cell = (props) => {
  const { value, onClick, onValueChange, isPeer, isSelected, sameValue, prefilled, notes, conflict, x, y, eraseSelected, inHintMode, hint } = props;
  const cellSize = getCellSize();

  let backColor = '#808080';
  let isRemoval = [false, false, false, false, false, false, false, false, false]
  if (hint)
  {
    for (let i = 0; i < hint.length; i++) {

      if (hint[i][0] === 1) { // Row Border Highlighting
        const cellNum = getCellNumber(x, y);
        if (cellNum % 9 === hint[i][1] % 9)
        {
          backColor = hint[i][2] ? hint[i][2] : "white";
        }
      }

      if (hint[i][0] === 0) { // Column Border Highlighting
        const cellNum = getCellNumber(x, y);
        if (Math.trunc(cellNum / 9) === hint[i][1])
        {
          backColor = hint[i][2] ? hint[i][2] : "white";
        }
      }


      if (hint[i][0] === 2) { // Box Border Highlighting
        const cellNum = getCellNumber(x, y); // Number of the cell being checked
        const boxNum = findBox(hint[i][1]); // Number of the box being highlighted
        switch (cellNum - boxNum)
        {
          case 0:
          case 1:
          case 2:
          case 9:
          case 10:
          case 11:
          case 18:
          case 19:
          case 20:
            backColor = hint[i][2] ? hint[i][2] : "white";
            break;
        }
      }
      if (hint[i][0] === 3) { // Individual Cell Highlighting
        if (x === hint[i][1] && y === hint[i][2])
          backColor = hint[i][3] ? hint[i][3] : "white";
      }
      if (hint[i][0] === 5) { // Note Removal Highlighting
        if (x === hint[i][1][0] && y === hint[i][1][1])
        {
          // text color of every value  match from hint[i][2] to hint[i].length should be red
          // boolean array for whether or not values should be red or not
          // isRed[0] being true means that the "1" note in the current cell should be red
          for (let j = 2; j < hint[i].length; j++)
          {
            isRemoval[hint[i][j] - 1] = true;
          }
        }
      }
    }
  }

  const handleKeyDown = (event) => {
    const inputValue = event.nativeEvent.key;
    if (/^[1-9]$/.test(inputValue)) { // check if input is a digit from 1 to 9
      onValueChange(x, y, parseInt(inputValue, 10));
    }
    if (inputValue == "Delete" || inputValue == "Backspace")
      eraseSelected();
  };

  const getNoteContents = (noteVal) =>
  {
    if (notes.has(noteVal))
    {
      let styleVal = isRemoval[noteVal - 1] ? styles(cellSize).removalNoteText : styles(cellSize).noteText
      return <Text style={styleVal}>{noteVal}</Text>
    }
  }  

  return (
    <Pressable onPress={() => onClick(x, y)} onKeyDown={handleKeyDown}>
      <View style={[styles(cellSize).cellView,
        (x % 3 === 0) && {borderLeftWidth: styles(cellSize).hardLineThickness.thickness},
        (y % 3 === 0) && {borderTopWidth: styles(cellSize).hardLineThickness.thickness},
        (x === 8) && {borderRightWidth: styles(cellSize).hardLineThickness.thickness},
        (y === 8) && {borderBottomWidth: styles(cellSize).hardLineThickness.thickness},

        // Border Highlighting
        (inHintMode) && backColor && {backgroundColor: backColor},

        conflict && styles(cellSize).conflict,
        isPeer && styles(cellSize).peer,
        sameValue && styles(cellSize).sameValue,
        (conflict && isSelected) && styles(cellSize).selectedConflict,
        isSelected && styles(cellSize).selected]}>
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
            : value && <Text style={[styles(cellSize).cellText,
            conflict && styles(cellSize).conflict,
            (conflict && isSelected) && styles(cellSize).selectedConflict,
            prefilled && styles(cellSize).prefilled]}>{value}
          </Text>
        }
      </View>
    </Pressable>
  );
};

Cell.propTypes = {
    value: PropTypes.number,
    onClick: PropTypes.func.isRequired,
    onValueChange: PropTypes.func.isRequired,
    isPeer: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    sameValue: PropTypes.bool.isRequired,
    prefilled: PropTypes.bool.isRequired,
    notes: PropTypes.instanceOf(Set),
    conflict: PropTypes.bool.isRequired,
    eraseSelected: PropTypes.func.isRequired,
    inHintMode: PropTypes.bool,
    hint: PropTypes.any,
};

Cell.defaultProps = {
    notes: null,
    value: null,
    inHintMode: false,
};

const ActionRow = (props) => {
  const { history, prefilled, inNoteMode, undo, toggleNoteMode, eraseSelected, fillSelectedWithSolution, toggleHintMode } = props;
  const cellSize = getCellSize();

  const sizeConst = (Platform.OS == 'web') ? 2 : 2;

  return (
    <View style={styles(cellSize).actionControlRow}>
      {/* Undo */}
      <Pressable onPress={history.size ? undo : null}>
        <MaterialCommunityIcons color="white" name="undo" size={cellSize/(sizeConst)}/>
      </Pressable>
      {/* Note mode */}
      <Pressable onPress={toggleNoteMode}>
        {inNoteMode
            ? // note mode on
          <MaterialCommunityIcons color="white" name="pencil-outline" size={cellSize/(sizeConst)}/>
            : // note mode off
          <MaterialCommunityIcons color="white" name="pencil-off-outline" size={cellSize/(sizeConst)}/>
        }
      </Pressable>
      {/* Erase */}
      <Pressable onPress={!prefilled ? eraseSelected : null}>
        <MaterialCommunityIcons color="white" name="eraser" size={cellSize/(sizeConst)}/>
      </Pressable>
      {/* Hint */}
      <Pressable onPress={!prefilled ? fillSelectedWithSolution && toggleHintMode : null}>
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
  fillSelectedWithSolution: PropTypes.func.isRequired,
  toggleHintMode: PropTypes.func.isRequired,
};

const PauseButton = ({ handlePause, isPaused }) => {
  const cellSize = getCellSize();
  return(
    <Pressable onPress={handlePause}>
      <Text style={styles(cellSize).headerFont}>{isPaused ? 'Resume' : 'Pause'}</Text>
    </Pressable>
  )
}

const HeaderRow = (props) => { //  Header w/ timer and pause button
    const { paused } = props;
    const [time, setTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const cellSize = getCellSize();

    useEffect(() => { // Timer
        let interval = null;
        if (!isPaused && !paused) {
            interval = setInterval(() => {
                setTime(time => time + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [paused, isPaused]);

    const handlePause = () => {
        setIsPaused(prevState => !prevState);
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

/*
 * This function retrieves the user's device size and calculates the cell size
 */
function getCellSize() {
    const size = useWindowDimensions();
    return Math.min(size.width, size.height) / 15;
}

function updateBoardWithNumber({
                                   x, y, number, fill = true, board,
                               }) {
    let cell = board.get('puzzle').getIn([x, y]);
    cell = cell.delete('notes');
    cell = fill ? cell.set('value', number) : cell.delete('value');
    const increment = fill ? 1 : -1;
    const rowPath = ['choices', 'rows', x, number];
    const columnPath = ['choices', 'columns', y, number];
    const squarePath = ['choices', 'squares',
        ((Math.floor(x / 3)) * 3) + Math.floor(y / 3), number];
    return board.setIn(rowPath, board.getIn(rowPath) + increment)
        .setIn(columnPath, board.getIn(columnPath) + increment)
        .setIn(squarePath, board.getIn(squarePath) + increment)
        .setIn(['puzzle', x, y], cell);
}

function getNumberOfGroupsAssignedForNumber(number, groups) {
    return groups.reduce((accumulator, row) =>
        accumulator + (row.get(number) > 0 ? 1 : 0), 0);
}

export default class SudokuBoard extends React.Component<any, any, any> {
    constructor(props) {
        super(props);
    };
    state = this.props.generatedGame;

    componentDidMount = () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then((reg) => {
                    console.log('ServiceWorker scope: ', reg.scope);
                    console.log('service worker registration successful');
                })
                .catch((err) => {
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
        let actualValue = solution[x][y] || -1;
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
      // demoHighlightInput = [[0, 0], [1, 0], [2, 0]] // proof that the highlighting will work when changing values
    }

    toggleHintMode = () => {
      let { board } = this.state;
      let newHintMode = !board.get('inHintMode');
      board = board.set('inHintMode', newHintMode);
      let hint = undefined
      if (newHintMode) hint = this.props.getHint(board)
      let causes = []
      let groups = []
      let placements = []
      // add the causes
      if (hint && hint.cause) causes = getCausesFromHint(hint);
      
      // add the groups
      if (hint && hint.groups) groups = getGroupsFromHint(hint);
      let hintHighlightInput = groups.concat(causes);
      // add the placements
        // TODO: text coloring
        // TODO: ability to add values
      if (hint && hint.placements) 
      {
        placements = getPlacementsFromHint(hint);
        let x = -1
        let y = -1
        let noteVal = -1
        for (let i = 0; i < placements.length; i++)
        {
          x = placements[i][0]
          y = placements[i][1]
          noteVal = placements[i][2]
          board = updateBoardWithNumber({
            x, y, noteVal, fill: true, board,
          });
          this.updateBoard(board);
        }
      }

      // add the removals
      // TODO: text coloring
      /*
        This block of code literally kills the notes which need to be removed,
        which we do not want ideally, we would make the notes highlighted in 
        red, then the user can press a button(ex. arrow) to kill the notes
      */
      if (hint && hint.removals) 
      {
        // they aren't tuples but it makes more sense this way
        // [[5, (x, y), 1, 4, 5], [5, (x', y'), 4, 7, 2], ...]
        removals = getRemovalsFromHint(hint);
        let x = -1
        let y = -1
        let actualRemovals = []
        for (let i = 0; i < removals.length; i++)
        {
          actualRemovals = []
          x = removals[i][1][0]
          y = removals[i][1][1]
          
          actualRemovals.push(5)
          actualRemovals.push([x,y])
          let notes = board.get('puzzle').getIn([x, y]).get('notes') || Set();
          for (let j = 2; j < removals[i].length; j++)
          {
            currRemoval = removals[i][j]
            if (notes.has(currRemoval))
            {
              actualRemovals.push(currRemoval);
              // this is what kills the notes
              // notes = notes.delete(currRemoval);
            }
          }
          board = board.setIn(['puzzle', x, y, 'notes'], notes);
        }
        // if there are actually values that need to be removed
        if (actualRemovals[2])
        {
          actualRemovals.push("#FF0000")
          hintHighlightInput.push(actualRemovals);
        }
        this.updateBoard(board);
      }
      
      // hintHighlightInput = hintHighlightInput.concat(actualRemovals);
      board = board.set('hint', hintHighlightInput);
      this.setState({ board });
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

        let actualValue = solution[x][y] || -1;
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

    fillSelectedWithSolution = () => {
        const { board, solution } = this.state;
        const selectedCell = this.getSelectedCell();
        if (!selectedCell) return;
        if (!solution) return;
        const { x, y } = board.get('selected');
        this.fillNumber(solution[x][y]);
    }

    fillNumber = (number) => {
      let { board } = this.state;
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
      }
      this.updateBoard(board);
    };

    // fillNumberAtPosition = (number, x, y) => {
    //   let { board } = this.state;
    //   const selectedCell = board.get('puzzle').getIn([x, y]);;
    //   if (!selectedCell) return;
    //   const prefilled = selectedCell.get('prefilled');
    //   if (prefilled) return;
    //   const currentValue = selectedCell.get('value');
    //   if (currentValue) {
    //     board = updateBoardWithNumber({
    //       x, y, number: currentValue, fill: false, board: this.state.board,
    //     });
    //   }
    //   const setNumber = currentValue !== number && number;
    //   if (setNumber) {
    //     board = updateBoardWithNumber({
    //       x, y, number, fill: true, board,
    //     });
    //   }
    //   this.updateBoard(board);
    // };

    selectCell = (x, y) => {
        let { board } = this.state;
        board = board.set('selected', { x, y });
        this.setState({ board });
    };

    isConflict = (i, j) => {
        const { value } = this.state.board.getIn(['puzzle', i, j]).toJSON();
        if (!value) return false;
        const rowConflict =
            this.state.board.getIn(['choices', 'rows', i, value]) > 1;
        const columnConflict =
            this.state.board.getIn(['choices', 'columns', j, value]) > 1;
        const squareConflict =
            this.state.board.getIn(['choices', 'squares',
                ((Math.floor(i / 3)) * 3) + Math.floor(j / 3), value]) > 1;
        return rowConflict || columnConflict || squareConflict;
    }

    renderCell = (cell, x, y) => {
        const { board } = this.state;
        const selected = this.getSelectedCell();
        const { value, prefilled, notes } = cell.toJSON();
        const conflict = this.isConflict(x, y);
        const peer = areCoordinatePeers({ x, y }, board.get('selected'));
        const sameValue = !!(selected && selected.get('value') &&
            value === selected.get('value'));
        const isSelected = cell === selected;
        let inHintMode = board.get('inHintMode');
        let hint = board.get('hint');

        const handleValueChange = (x, y, newValue) => {
            let { board } = this.state;
            let inNoteMode = board.get('inNoteMode');

            if (inNoteMode) this.addNumberAsNote(newValue);
            else this.fillNumber(newValue);
        };

        return (
            <Cell
                prefilled={prefilled}
                notes={notes}
                sameValue={sameValue}
                isSelected={isSelected}
                isPeer={peer}
                value={value}
                onClick={(x, y) => { this.selectCell(x, y); }}
                onValueChange={handleValueChange}
                key={y}
                x={x}
                y={y}
                conflict={conflict}
                eraseSelected={this.eraseSelected}
                inHintMode={inHintMode}
                hint={hint}
            />
        );
    };

    renderTopBar = () => {
        return(
            <HeaderRow/>
        );
    }

    renderPuzzle = () => {
        const { board } = this.state;

        return (
            <View style={styles().boardContainer}>
                {board.get('puzzle').map((row, i) => (
                    <View key={i} style={styles().rowContainer}>
                        { row.map((cell, j) => this.renderCell(cell, i, j)).toArray() }
                    </View>
                )).toArray()}
            </View>
        );
    };

    renderNumberControl = () => {
        const { board } = this.state;
        const selectedCell = this.getSelectedCell();
        const prefilled = selectedCell && selectedCell.get('prefilled');
        const inNoteMode = board.get('inNoteMode');
        return (
          <NumberControl
            prefilled={prefilled}
            inNoteMode={inNoteMode}
            getNumberValueCount={this.getNumberValueCount}
            fillNumber={this.fillNumber}
            addNumberAsNote={this.addNumberAsNote}
          />
        );
    }

    renderActions = () => {
        const { board, history } = this.state;
        const selectedCell = this.getSelectedCell();
        const prefilled = selectedCell && selectedCell.get('prefilled');
        const inNoteMode = board.get('inNoteMode');
        const undo = this.undo;
        const toggleNoteMode = this.toggleNoteMode;
        const eraseSelected = this.eraseSelected;
        const fillSelectedWithSolution = this.fillSelectedWithSolution;
        return (
            <ActionRow
                history={history}
                prefilled={prefilled}
                inNoteMode={inNoteMode}
                undo={undo}
                toggleNoteMode={toggleNoteMode}
                eraseSelected={eraseSelected}
                fillSelectedWithSolution={fillSelectedWithSolution}
                toggleHintMode={this.toggleHintMode}
            />
        );
    }

    renderControls = () => {
        return (
            <View style={styles().bottomActions}>
                {this.renderActions()}
                {this.renderNumberControl()}
            </View>
        );
    }

    componentDidMount() {
      if (!this.state.board) {
        this.props.generatedGame.then(game => this.setState(game));
      }
    }

    render = () => {
      const { board } = this.state;
      if (!board)
      {
        this.props.generatedGame.then(game => this.setState(game));
      }
      return (
        <View>
          {board && !this.props.isDrill && this.renderTopBar()}
          {board && this.renderPuzzle()}
          {board &&
            <View style={styles().bottomActions}>
              {this.renderActions()}
              {this.renderNumberControl()}
            </View>
          }
        </View>
      );
    }
}