// @ts-nocheck
import React, { Component } from 'react';
import { StyleSheet, Text, View, Pressable, Image, Dimensions, useWindowDimensions } from 'react-native';
import { Set, List, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import Svg, { Path } from "react-native-svg"

import EraseComponent from '../../assets/eraseComponent';
import HintComponent from '../../assets/hintComponent.jsx';
import NoteOnComponent from '../../assets/noteOnComponent.jsx';
import NoteOffComponent from '../../assets/noteOffComponent.jsx';
import UndoComponent from '../../assets/undoComponent.jsx';

import { makePuzzle, pluck, isPeer as areCoordinatePeers, range } from './sudoku';
import {Button} from "react-native-paper";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Add parameterized colors here

// we need to check for the height, as the total height of the app will be:
//      cellHeight * 9 + Top(cellHeight) + Bottom(cellHeight),
//      where Top(cellHeight) will be the height of the difficulty, time, and pause section
//      and Bottom(cellHeight) will be the height of the hint, undo, and number input sections

/* 
    Top(cellHeight) = cellHeight * (32 / 40)
*/ 
/*
    Bottom(cellHeight) = Actions(cellHeight) + numberControl(cellHeight),
    where Actions(cellHeight) = cellHeight * (48 / 40)
    // TODO: VERIFY THE BELOW
    and numberControl(cellHeight) = cellHeight * 1.25,
    and so
    Bottom(cellHeight) = cellHeight * (48 / 40) + cellHeight * 1.25
*/

let fallbackHeight = 30;

const styles = (cellSize) => StyleSheet.create({
    hardLineThickness : {thickness: cellSize * (3 / 40)},
    numberContainer: {
        width: cellSize ? cellSize : fallbackHeight,
        height: cellSize ? cellSize * 1.25 : fallbackHeight * 1.25,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    numberControlRow: {
        width: cellSize ? cellSize * 9 : fallbackHeight * 9,
        height: cellSize ? cellSize * 1.25 : fallbackHeight * 9,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    numberControlText: {
        fontFamily: 'Inter_400Regular',
        fontSize: cellSize ? cellSize / 2 : fallbackHeight / 2,
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
    bottomActions: {
        marginTop: 0.25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: 0.5,
        width: cellSize * 9
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
        fontSize: cellSize ? cellSize / 4 : fallbackHeight / 4,
        fontFamily: 'Inter_100Thin',
    },
    cellView: {
        height: cellSize ? cellSize : fallbackHeight,
        width: cellSize ? cellSize : fallbackHeight,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: cellSize ? cellSize / 40 : fallbackHeight / 40,
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
    actionControlRow: {
        width: cellSize ? cellSize * 9 : 80,
        height: cellSize ? cellSize * (50 / 60) : 80,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
    },
    actionControlButton: {
        height: cellSize ? cellSize * (0.8) : 1000,
        width: cellSize ? cellSize * (0.8) : 1000,
        aspectRatio: 1,
    },
    actionControlSvg: {
        width: '100%',
        height: '100%'
    }
});

const NumberControl = ({ number, onClick, completionPercentage }) => {
    const cellSize = getCellSize();
    return (
        <Pressable onPress={onClick}>
            <View
                key={number}
                className="number"
                style={styles(cellSize).numberContainer}
            >
                <View><Text style={styles(cellSize).numberControlText}>{number}</Text></View>
            </View>
        </Pressable>
    )
}

NumberControl.propTypes = {
    number: PropTypes.number.isRequired,
    onClick: PropTypes.func,
    completionPercentage: PropTypes.number.isRequired,
};

NumberControl.defaultProps = {
    onClick: null,
};

const Cell = (props) => {
    const { value, onClick, onKeyPress, isPeer, isSelected, sameValue, prefilled, notes, conflict, x, y } = props;
    const cellSize = getCellSize();
    return (
        <Pressable onPress={() => onClick(x, y)}>
            <View style={[styles(cellSize).cellView,
                (x % 3 === 0) && {borderLeftWidth: styles(cellSize).hardLineThickness.thickness},
                (y % 3 === 0) && {borderTopWidth: styles(cellSize).hardLineThickness.thickness},
                (x === 8) && {borderRightWidth: styles(cellSize).hardLineThickness.thickness},
                (y === 8) && {borderBottomWidth: styles(cellSize).hardLineThickness.thickness},

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
                                    <View style={styles(cellSize).noteViewElement} >{notes.has(1) && <Text style={styles(cellSize).noteText}>{1}</Text>}</View>
                                    <View style={styles(cellSize).noteViewElement} >{notes.has(4) && <Text style={styles(cellSize).noteText}>{4}</Text>}</View>
                                    <View style={styles(cellSize).noteViewElement} >{notes.has(7) && <Text style={styles(cellSize).noteText}>{7}</Text>}</View>
                                </View>
                                <View>
                                    <View style={styles(cellSize).noteViewElement} >{notes.has(2) && <Text style={styles(cellSize).noteText}>{2}</Text>}</View>
                                    <View style={styles(cellSize).noteViewElement} >{notes.has(5) && <Text style={styles(cellSize).noteText}>{5}</Text>}</View>
                                    <View style={styles(cellSize).noteViewElement} >{notes.has(8) && <Text style={styles(cellSize).noteText}>{8}</Text>}</View>
                                </View>
                                <View>
                                    <View style={styles(cellSize).noteViewElement} >{notes.has(3) && <Text style={styles(cellSize).noteText}>{3}</Text>}</View>
                                    <View style={styles(cellSize).noteViewElement} >{notes.has(6) && <Text style={styles(cellSize).noteText}>{6}</Text>}</View>
                                    <View style={styles(cellSize).noteViewElement} >{notes.has(9) && <Text style={styles(cellSize).noteText}>{9}</Text>}</View>
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
    onKeyPress: PropTypes.func.isRequired,
    isPeer: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    sameValue: PropTypes.bool.isRequired,
    prefilled: PropTypes.bool.isRequired,
    notes: PropTypes.instanceOf(Set),
    conflict: PropTypes.bool.isRequired,
};

Cell.defaultProps = {
    notes: null,
    value: null,
};

const ActionRow = (props) => {
    const { history, prefilled, inNoteMode, undo, toggleNoteMode, eraseSelected, fillSelectedWithSolution } = props;
    const cellSize = getCellSize();
    return (
        <View style={styles(cellSize).actionControlRow}>
            {/* Undo */}
            <Button onPress={history.size ? undo : null}>
                <MaterialCommunityIcons name="undo" size={styles(cellSize).actionControlButton.height/1.5}/>
            </Button>

            {/* Note mode */}
            <Button onPress={toggleNoteMode}>
                {inNoteMode
                        ? // note mode on
                    <MaterialCommunityIcons name="pencil-outline" size={styles(cellSize).actionControlButton.height/1.5}/>
                        : // note mode off
                    <MaterialCommunityIcons name="pencil-off-outline" size={styles(cellSize).actionControlButton.height/1.5}/>
                }
            </Button>
            {/* Erase */}
            <Button onPress={!prefilled ? eraseSelected : null}>
                <MaterialCommunityIcons name="eraser" size={styles(cellSize).actionControlButton.height/2}/>
            </Button>
            {/* Hint */}
            <Button style={{height: '100%'}} onPress={!prefilled ? fillSelectedWithSolution : null}>
                <MaterialCommunityIcons name="help" size={styles(cellSize).actionControlButton.height/3}/>
            </Button>
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
};

/*
 * This function retrieves the user's device size and calculates the cell size
 */
function getCellSize() {
    const size = useWindowDimensions();
    console.log(Math.min(size.width, size.height) / 12);
    return Math.min(size.width, size.height) / 12;
}

function makeCountObject() {
    const countObj = [];
    for (let i = 0; i < 10; i += 1) countObj.push(0);
    return countObj;
}

function makeBoard({ puzzle }) {
    const rows = Array.from(Array(9).keys()).map(() => makeCountObject());
    const columns = Array.from(Array(9).keys()).map(() => makeCountObject());
    const squares = Array.from(Array(9).keys()).map(() => makeCountObject());
    const result = puzzle.map((row, i) => (
        row.map((cell, j) => {
            if (cell) {
                rows[i][cell] += 1;
                columns[j][cell] += 1;
                squares[((Math.floor(i / 3)) * 3) + Math.floor(j / 3)][cell] += 1;
            }
            return {
                value: puzzle[i][j] > 0 ? puzzle[i][j] : null,
                prefilled: !!puzzle[i][j],
            };
        })
    ));
    return fromJS({ puzzle: result, selected: false, inNoteMode: false, choices: { rows, columns, squares } });
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

export default class SudokuBoard extends React.Component {
    state = {};

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

    generateGame = (finalCount = 20) => {
        const solution = makePuzzle();
        let output = solution[0].map((_, colIndex) => solution.map(row => row[colIndex]));
        console.log(output);
        const { puzzle } = pluck(solution, finalCount);
        const board = makeBoard({ puzzle });
        this.setState({
            board, history: List.of(board), historyOffSet: 0, solution,
        });
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
        let actualValue = solution[x][y];
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
        let actualValue = solution[x][y];
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

    handleKeyDown = (event) => {
        let { board } = this.state;
        let inNoteMode = board.get('inNoteMode');
        let numberInput = Number(event.key);

        if (inNoteMode) this.addNumberAsNote(numberInput);
        else this.fillNumber(numberInput);

    };

    renderCell = (cell, x, y) => {
        const { board } = this.state;
        const selected = this.getSelectedCell();
        const { value, prefilled, notes } = cell.toJSON();
        const conflict = this.isConflict(x, y);
        const peer = areCoordinatePeers({ x, y }, board.get('selected'));
        const sameValue = !!(selected && selected.get('value') &&
            value === selected.get('value'));

        const isSelected = cell === selected;

        return (
            <Cell
                prefilled={prefilled}
                notes={notes}
                sameValue={sameValue}
                isSelected={isSelected}
                isPeer={peer}
                value={value}
                onClick={(x, y) => { this.selectCell(x, y); }} // console.log(`Cell clicked at (${x}, ${y})`)
                onKeyPress={(event) => this.handleKeyDown(event)}
                key={y}
                x={x}
                y={y}
                conflict={conflict}
            />
        );
    };


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
            <View style={ styles().numberControlRow }>
                {range(9).map((i) => {
                    const number = i + 1;
                    const onClick = !prefilled
                        ? () => {
                            inNoteMode
                                ? this.addNumberAsNote(number)
                                : this.fillNumber(number);
                        }
                        : undefined;

                    return (
                        <NumberControl
                            style={styles().controlStyle}
                            key={number}
                            number={number}
                            onClick={onClick}
                            completionPercentage={this.getNumberValueCount(number) / 9}
                        />
                    );
                })}
            </View>
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
            this.generateGame();
        }
    }

    render = () => {
        const { board } = this.state;
        if (!board)
        {
            this.generateGame();
            // console.log(this.solution);
        }
        return (
            <View style={styles().board}>
                {board && this.renderPuzzle()}
                {board && this.renderControls()}
            </View>
        );
    }
}
/*
    if the user clicks off of a cell with notes,
        if the user does not have the correct(solution) value as a note for that cell

*/
