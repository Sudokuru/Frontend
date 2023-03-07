// @ts-nocheck
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, useWindowDimensions } from 'react-native';
import { Set, List, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import Svg, { Path } from "react-native-svg"

import EraseComponent from '../../assets/eraseComponent';
import HintComponent from '../../assets/hintComponent.jsx';
import NoteOnComponent from '../../assets/noteOnComponent.jsx';
import NoteOffComponent from '../../assets/noteOffComponent.jsx';
import UndoComponent from '../../assets/undoComponent.jsx';

import { makePuzzle, pluck, isPeer as areCoordinatePeers, range } from './sudoku';

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
        height: cellSize ? cellSize * (0.5) : 1000,
        width: cellSize ? cellSize * (0.5) : 1000,
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
        <TouchableOpacity onPress={onClick}>
            <View
                key={number}
                className="number"
                style={styles(cellSize).numberContainer}
            >
                <View><Text style={styles(cellSize).numberControlText}>{number}</Text></View>
            </View>
        </TouchableOpacity>
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
        <TouchableOpacity onPress={() => onClick(x, y)}>
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
        </TouchableOpacity>
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
            <TouchableOpacity style={styles(cellSize).actionControlButton} onPress={history.size ? undo : null}>
                <Svg height="100%" width="100%" viewBox="0 0 50 50">
                    <Path d="M14 38v-3h14.45q3.5 0 6.025-2.325Q37 30.35 37 26.9t-2.525-5.775Q31.95 18.8 28.45 18.8H13.7l5.7 5.7-2.1 2.1L8 17.3 17.3 8l2.1 2.1-5.7 5.7h14.7q4.75 0 8.175 3.2Q40 22.2 40 26.9t-3.425 7.9Q33.15 38 28.4 38Z"/>
                </Svg> 
            </TouchableOpacity>

            {/* Note mode */}
            <TouchableOpacity style={styles(cellSize).actionControlButton} onPress={toggleNoteMode}>
                {inNoteMode 
                    ? // note mode on
                    <Svg height="100%" width="100%" viewBox="0 0 50 50">
                        <Path d="M9 39h2.2l22.15-22.15-2.2-2.2L9 36.8Zm30.7-24.3-6.4-6.4 2.1-2.1q.85-.85 2.1-.85t2.1.85l2.2 2.2q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Zm-5.35-1.05-1.1-1.1 2.2 2.2Z"/>
                    </Svg>
                    : // note mode off
                    <Svg height="100%" width="100%" viewBox="0 0 50 50">
                        <Path d="M39.8 44.2 25 29.4 12.4 42H6v-6.4L18.6 23 3.8 8.2l2.1-2.1 36 36Zm-18-18-1.1-1.1 1.1 1.1 1.1 1.1Zm7.4-1-2.1-2.1 6.25-6.25-2.2-2.2-6.25 6.25-2.1-2.1 8.4-8.4 6.4 6.4Zm10.5-10.5-6.4-6.4 2.1-2.1q.85-.85 2.125-.825 1.275.025 2.125.875L41.8 8.4q.85.85.875 2.075Q42.7 11.7 41.8 12.6ZM26 22ZM9 39h2.2l11.7-11.7-2.2-2.2L9 36.8Z" />
                    </Svg>
                }
            </TouchableOpacity>
            {/* Erase */}
            <TouchableOpacity style={styles(cellSize).actionControlButton} onPress={!prefilled ? eraseSelected : null}>
                <Svg height="100%" width="100%" viewBox="0 0 50 50">
                    <Path d="m22.4 31.7 5.6-5.6 5.6 5.6 2.15-2.15L30.1 24l5.55-5.55-2.15-2.15-5.5 5.6-5.6-5.6-2.15 2.15L25.9 24l-5.65 5.55ZM6 24l8.45-11.95q.65-.9 1.55-1.475.9-.575 2-.575h21q1.25 0 2.125.875T42 13v22q0 1.25-.875 2.125T39 38H18q-1.1 0-2-.575-.9-.575-1.55-1.475Zm3.75 0 7.7 11H39V13H17.45ZM39 24V13v22Z" />
                </Svg>
            </TouchableOpacity>
            {/* Hint */}
            <TouchableOpacity style={styles(cellSize).actionControlButton} onPress={!prefilled ? fillSelectedWithSolution : null}>
                <Svg height="100%" width="100%" viewBox="0 0 50 50">
                    <Path d="M24.2 35.65q.8 0 1.35-.55t.55-1.35q0-.8-.55-1.35t-1.35-.55q-.8 0-1.35.55t-.55 1.35q0 .8.55 1.35t1.35.55Zm-1.75-7.3h2.95q0-1.3.325-2.375T27.75 23.5q1.55-1.3 2.2-2.55.65-1.25.65-2.75 0-2.65-1.725-4.25t-4.575-1.6q-2.45 0-4.325 1.225T17.25 16.95l2.65 1q.55-1.4 1.65-2.175 1.1-.775 2.6-.775 1.7 0 2.75.925t1.05 2.375q0 1.1-.65 2.075-.65.975-1.9 2.025-1.5 1.3-2.225 2.575-.725 1.275-.725 3.375ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.975Q41 31.05 41 24q0-7.1-4.95-12.05Q31.1 7 24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24 41Zm0-17Z"/>
                </Svg>
            </TouchableOpacity>
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

        // output the selected cell to console
        console.log('selected cell', selected);

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
        const { puzzle } = pluck(solution, finalCount);
        const board = makeBoard({ puzzle });
        this.setState({
            board, history: List.of(board), historyOffSet: 0, solution,
        });
    }

    addNumberAsNote = (number) => {
        let { board } = this.state;
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
        if (notes.has(number)) {
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

    eraseSelected = () => {
        const selectedCell = this.getSelectedCell();
        if (!selectedCell) return;
        this.fillNumber(false);
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
