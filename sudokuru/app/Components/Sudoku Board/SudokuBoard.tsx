// @ts-nocheck
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Set, List, fromJS } from 'immutable';
import PropTypes from 'prop-types';

import EraseIcon from '../assets/erase.svg';
import HintIcon from '../assets/hint.svg';
import NoteIcon from '../assets/note.svg';
import NoteOffIcon from '../assets/noteoff.svg';
import UndoIcon from '../assets/undo.svg';

import { makePuzzle, pluck, isPeer as areCoordinatePeers, range } from './sudoku';

// Add parameterized colors here

// we need to check for the height, as the total height of the app will be:
//      cellHeight * 9 + Top(cellHeight) + Bottom(cellHeight),
//      where Top(cellHeight) will be the height of the difficulty, time, and pause section
//      and Bottom(cellHeight) will be the height of the hint, undo, and number input sections

let cellHeight = 60;

const styles = StyleSheet.create({
    hardLineThickness : {thickness: 3},
    numberContainer: {
        width: cellHeight,
        height: cellHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    numberControlText: {
        fontFamily: 'Inter_400Regular',
        fontSize: cellHeight / 2,
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
    controls: {
        marginTop: 0.25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: 0.5,
        width: '100%'
    },
    boardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    cellContainer: {
        height: cellHeight,
        width: cellHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // justifycontent space
    noteViewParent: {
        flex: 1,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noteViewElement: {
        width: cellHeight / 4 + 1, height: cellHeight / 4 + 1, paddingLeft: cellHeight / 20
    },
    noteText: {
        fontSize: cellHeight / 4,
        fontFamily: 'Inter_100Thin',
    },
    cellView: {
        height: cellHeight,
        width: cellHeight,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: cellHeight / 40,
    },
    cellText: {
        fontFamily: 'Inter_400Regular',
        fontSize: cellHeight * (3 / 4) + 1, // 31
    },
    borderThick: {
        borderLeftWidth: cellHeight / 4,
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
});

// function getBackGroundColor({
//   conflict, isPeer, sameValue, isSelected,
// }) {
//   if (conflict && isPeer && sameValue) {
//     return DeepOrange200;
//   } else if (sameValue) {
//     return LightBlue300;
//   } else if (isSelected) {
//     return LightBlue200;
//   } else if (isPeer) {
//     return LightBlue100;
//   }
//   return false;
// }

// function getFontColor({ value, conflict, prefilled }) {
//   if (conflict && !prefilled) {
//     return DeepOrange600;
//   } else if (!prefilled && value) {
//     return ControlNumberColor;
//   }
//   return false;
// }

const NumberControl = ({ number, onClick, completionPercentage }) => (
    <TouchableOpacity onPress={onClick}>
        <View
            key={number}
            className="number"
            style={styles.numberContainer}
        >
            <View><Text style={styles.numberControlText}>{number}</Text></View>
        </View>
    </TouchableOpacity>
);

NumberControl.propTypes = {
    number: PropTypes.number.isRequired,
    onClick: PropTypes.func,
    completionPercentage: PropTypes.number.isRequired,
};

NumberControl.defaultProps = {
    onClick: null,
};

// const Cell = (props) => {
//   const {
//     value, onClick, onKeyPress, isPeer, isSelected, sameValue, prefilled, notes, conflict,
//   } = props;
//   const backgroundColor = getBackGroundColor({
//     conflict, isPeer, sameValue, isSelected,
//   });
//   const fontColor = getFontColor({ conflict, prefilled, value });
//   return (
//     <View className="cell" onClick={onClick} onKeyDown={onKeyPress} tabIndex="0">
//     {
//       notes ? range(9).map(i => (
//         <View key={i} className="note-number">
//           {notes.has(i + 1) && <Text>{i + 1}</Text>}
//         </View>
//       )) : value && <Text>{value}</Text>
//     }
//     </View>
//   );
// };

const Cell = (props) => {
    const { value, onClick, onKeyPress, isPeer, isSelected, sameValue, prefilled, notes, conflict, x, y } = props;
    return (
        <TouchableOpacity onPress={() => onClick(x, y)}>
            <View style={[styles.cellView,
                (x % 3 === 0) && {borderLeftWidth: styles.hardLineThickness.thickness},
                (y % 3 === 0) && {borderTopWidth: styles.hardLineThickness.thickness},
                (x === 8) && {borderRightWidth: styles.hardLineThickness.thickness},
                (y === 8) && {borderBottomWidth: styles.hardLineThickness.thickness},

                conflict && styles.conflict,
                isPeer && styles.peer,
                sameValue && styles.sameValue,
                (conflict && isSelected) && styles.selectedConflict,
                isSelected && styles.selected]}>
                {
                    notes ? // range(9).map(i => (
                            //           <View style={styles.noteViewElement} key={i} >
                            //             {notes.has(i + 1) && <Text>{i + 1}</Text>}
                            //           </View>
                            //         ))
                        <View style={styles.noteViewParent}>
                            <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <View style={styles.noteViewElement} >{notes.has(1) && <Text style={styles.noteText}>{1}</Text>}</View>
                                    <View style={styles.noteViewElement} >{notes.has(4) && <Text style={styles.noteText}>{4}</Text>}</View>
                                    <View style={styles.noteViewElement} >{notes.has(7) && <Text style={styles.noteText}>{7}</Text>}</View>
                                </View>
                                <View>
                                    <View style={styles.noteViewElement} >{notes.has(2) && <Text style={styles.noteText}>{2}</Text>}</View>
                                    <View style={styles.noteViewElement} >{notes.has(5) && <Text style={styles.noteText}>{5}</Text>}</View>
                                    <View style={styles.noteViewElement} >{notes.has(8) && <Text style={styles.noteText}>{8}</Text>}</View>
                                </View>
                                <View>
                                    <View style={styles.noteViewElement} >{notes.has(3) && <Text style={styles.noteText}>{3}</Text>}</View>
                                    <View style={styles.noteViewElement} >{notes.has(6) && <Text style={styles.noteText}>{6}</Text>}</View>
                                    <View style={styles.noteViewElement} >{notes.has(9) && <Text style={styles.noteText}>{9}</Text>}</View>
                                </View>
                            </View>
                        </View>
                        : value && <Text style={[styles.cellText,
                        conflict && styles.conflict,
                        (conflict && isSelected) && styles.selectedConflict,
                        prefilled && styles.prefilled]}>{value}
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
            <View style={styles.boardContainer}>
                {board.get('puzzle').map((row, i) => (
                    <View key={i} style={styles.rowContainer}>
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
            <View className="control">
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
                            style={styles.controlStyle}
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
        return (
            <View>
                <TouchableOpacity onPress={history.size ? this.undo : null}>
                    <Text>Undo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.toggleNoteMode}>
                    <Text>{inNoteMode ? "Note ON" : "Note OFF"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={!prefilled ? this.eraseSelected : null}>
                    <Text>Erase</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={!prefilled ? this.fillSelectedWithSolution : null}>
                    <Text>Hint</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderControls = () => {
        return (
            <View style={styles.controls}>
                {this.renderNumberControl()}
                {this.renderActions()}
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
            <View>
                {board && this.renderPuzzle()}
                {board && this.renderControls()}
            </View>
        );
    }
}
