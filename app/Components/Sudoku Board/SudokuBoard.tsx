// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Set } from "immutable";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
import { saveGame } from "./Functions/BoardFunctions";

import { highlightBox, highlightColumn, highlightRow, isPeer } from "./sudoku";

import { useFocusEffect } from "@react-navigation/core";
import { ActivityIndicator, useTheme } from "react-native-paper";
import NumberControl from "./Components/NumberControl";
import {
  isValueCorrect,
  formatTime,
  getCausesFromHint,
  getCellNumber,
  getCellSize,
  getGroupsFromHint,
  getPlacementsFromHint,
  getRemovalsFromHint,
  updateBoardWithNumber,
  getNextHint,
} from "./Functions/BoardFunctions";
import Cell from "./Components/Cell";
import ActionRow from "./Components/ActionRow";
import HintSection from "./Components/HintSection";
import { generateGame } from "./Functions/generateGame";
import Puzzle from "./Components/Puzzle";
import { gameResults, getHint } from "sudokuru";
import { Puzzles } from "../../Functions/Api/Puzzles";
import PauseButton from "./Components/PauseButton";
import {
  addEveryRemovalNoteToBoard,
  getHintObject,
} from "./Functions/HintsParsing";
import Hint from "./Functions/Hint";
import {
  CellProps,
  SudokuBoardProps,
} from "../../Functions/LocalStore/DataStore/LocalDatabase";
import { PreferencesContext } from "../../Contexts/PreferencesContext";

let fallbackHeight = 30;

const styles = (cellSize, sizeConst, theme) =>
  StyleSheet.create({
    headerControlRow: {
      alignSelf: "center",
      width: cellSize ? cellSize * 9 : fallbackHeight * 9,
      height: cellSize ? cellSize * (3 / 4) : fallbackHeight * (3 / 4),
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      marginTop: cellSize ? cellSize * (1 / 2) : fallbackHeight * (1 / 2),
    },
    headerFont: {
      fontFamily: "Inter_400Regular",
      fontSize: cellSize
        ? cellSize * (1 / 3) + 1
        : fallbackHeight * (1 / 3) + 1,
      color: theme,
    },
    submitButtonView: {
      width: cellSize ? cellSize * (50 / 30) : fallbackHeight * (50 / 30),
      height: cellSize ? cellSize * (3 / 4) : fallbackHeight * (3 / 4),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F2CA7E",
      borderRadius: cellSize
        ? cellSize * (10 / 60)
        : fallbackHeight * (10 / 60),
      marginTop: cellSize ? cellSize * (1 / 2) : fallbackHeight * (1 / 2),
    },
    submitButtonText: {
      fontFamily: "Inter_700Bold",
      fontSize: cellSize
        ? cellSize * (1 / 3) + 1
        : fallbackHeight * (1 / 3) + 1,
      color: "#FFFFFF",
    },
  });

const DrillSubmitButton = (props) => {
  const { isDrillSolutionCorrect, navigation } = props;
  const cellSize = getCellSize();

  return (
    <Pressable
      onPress={() => {
        if (isDrillSolutionCorrect()) navigation.navigate("DrillPage");
      }}
    >
      <View style={styles(cellSize).submitButtonView}>
        <Text style={styles(cellSize).submitButtonText}>Submit</Text>
      </View>
    </Pressable>
  );
};

DrillSubmitButton.propTypes = {
  isDrillSolutionCorrect: PropTypes.func.isRequired,
};

const HeaderRow = (props) => {
  //  Header w/ timer and pause button
  const { currentTime, activeGame, timer, setTimer } = props;
  const cellSize = getCellSize();
  const navigation = useNavigation();

  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      let interval = null;
      interval = setInterval(() => {
        if (currentTime && currentTime >= timer) {
          setTimer(currentTime + 1);
        } else {
          setTimer(timer + 1);
        }
      }, 1000);
      return () => clearInterval(interval);
    })
  );

  const handlePause = () => {
    saveGame(activeGame, timer);
    navigation.replace("PlayPage");
  };

  return (
    <View style={styles(cellSize).headerControlRow}>
      <Text
        style={styles(cellSize, null, theme.colors.onBackground).headerFont}
      >
        Time: {formatTime(currentTime > timer ? currentTime : timer)}
      </Text>
      <PauseButton handlePause={handlePause} isPaused={false} />
    </View>
  );
};

HeaderRow.propTypes = {
  paused: PropTypes.bool.isRequired,
};

HeaderRow.defaultProps = {
  paused: false,
};

const SudokuBoard = (props: any) => {
  const [isLoading, setIsLoading] = useState(true);

  // shared states
  // const [board, setBoard] = useState();
  // const [history, setHistory] = useState<any>();
  // const [historyOffSet, setHistoryOffSet] = useState<number>();
  // const [solution, setSolution] = useState();
  // const [activeGame, setActiveGame] = useState();

  // const setTimer = (timer: number) => useTimer(timer);
  // const [timer, useTimer] = useState<number>(0);

  const [sudokuBoard, setSudokuBoard] = useState<SudokuBoardProps>();

  // drill states
  // These could probably stay as props since these values are constant and not altered.
  const [drillSolutionCells, setDrillSolutionCells] = useState();
  const [originalBoard, setOriginalBoard] = useState();

  const autoHint = () => {
    if (!board.get("inHintMode")) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (
            !isValueCorrect(
              activeGame[0].puzzleSolution,
              i,
              j,
              board.get("puzzle").getIn([i, j]).get("value")
            )
          ) {
            toggleHintMode();
            return;
          }
        }
      }
      // previous board was filled, so now get new board
      generateGame(props).then((result) => {
        setBoard(result.board);
        setHistory(result.history);
        setHistoryOffSet(result.historyOffSet);
        setSolution(result.solution);
        setActiveGame(result.activeGame);
      });
    } else {
      // if you're on the final index of the hint
      if (board.get("currentStep") + 1 === board.get("hintSteps").length) {
        checkMarkClicked();
      }
      // if you're not on the final step
      else {
        rightArrowClicked();
      }
    }
  };

  useEffect(() => {
    generateGame(props).then((game) => {
      setSudokuBoard(game);
      setIsLoading(false);
    });
  }, []);

  // useEffect(() => {
  //   if (props.gameType == "Demo" && board) {
  //     const interval = setInterval(() => {
  //       autoHint();
  //     }, 2000);
  //     return () => clearInterval(interval);
  //   }
  // });

  // if we are loading then we return the loading icon
  if (isLoading) return <ActivityIndicator animating={true} color="red" />;

  const getSelectedCell = () => {
    const selected = board.get("selected");
    return selected && board.get("puzzle").getIn([selected.x, selected.y]);
  };

  const addNumberAsNote = (number) => {
    let newBoard = board;
    let selectedCell = getSelectedCell();
    if (!selectedCell) return;
    const prefilled = selectedCell.get("prefilled");
    if (prefilled) return;
    const { x, y } = newBoard.get("selected");
    const currentValue = selectedCell.get("value");
    if (currentValue) {
      newBoard = updateBoardWithNumber({
        x,
        y,
        number: currentValue,
        fill: false,
        board: newBoard,
      });
    }
    let notes = selectedCell.get("notes") || Set();
    let actualValue = solution ? solution[x][y] : -1;
    if (notes.has(number)) {
      if (number !== actualValue) notes = notes.delete(number);
    } else {
      notes = notes.add(number);
    }
    selectedCell = selectedCell.set("notes", notes);
    selectedCell = selectedCell.delete("value");
    newBoard = newBoard.setIn(["puzzle", x, y], selectedCell);
    updateBoard(newBoard);
  };

  /**
   * Adds the previous move (most recent move stored in action history) to board
   * Example:
   * moves: r0c0 insert 5, r1c1 insert 6, r1c1 insert 7
   * actionHistory: r0c0 = 0, r1c1 = 0, r1c1 = 6
   * Undo will insert 6 into r1c1, then insert 0 into r1c1, then insert 0 into r0c0
   */
  const undo = () => {
    // Adding previous move back to the board
    const move = sudokuBoard.actionHistory.pop();
    sudokuBoard.puzzle[move.cellLocation.c][move.cellLocation.r].type =
      move.cell.type;
    sudokuBoard.puzzle[move.cellLocation.c][move.cellLocation.r].entry =
      move.cell.entry;
    // remove from move history
    setSudokuBoard({
      ...sudokuBoard,
      actionHistory: sudokuBoard.actionHistory,
    });
  };

  /**
   * Toggles note mode for the board
   */
  const toggleNoteMode = () => {
    sudokuBoard.inNoteMode = !sudokuBoard.inNoteMode;
    setSudokuBoard({ ...sudokuBoard, inNoteMode: sudokuBoard.inNoteMode });
  };

  // const toggleHintMode = () => {
  //   // Create new board variable to store the temporary hint board state
  //   let newBoard = board;
  //   // Stores whether or not the board is in hint mode
  //   let newHintMode: boolean = !sudokuBoard.inHintMode;
  //   newBoard = newBoard.set("inHintMode", newHintMode);

  //   // Increment global hint value by one
  //   if (props.gameType != "StartDrill" && newHintMode) {
  //     if (activeGame[0].numHintsUsed == null) {
  //       activeGame[0].numHintsUsed = 1;
  //     } else {
  //       activeGame[0].numHintsUsed++;
  //     }
  //   }

  //   // If they are exiting hint mode, update board state by either reverting (if they prematurely exit hint mode) or updating (if they are on the final step)
  //   if (!newHintMode) {
  //     let hintStepsLength = newBoard.get("hintSteps").length;
  //     let currentStep = newBoard.get("currentStep");

  //     // if they prematurely exit hint mode, undo the hint
  //     if (currentStep < hintStepsLength - 1) {
  //       undo();
  //     }

  //     newBoard = newBoard.set("currentStep", -1);
  //     newBoard = newBoard.set("hintSteps", []);

  //     // if they are on the final step, push the hint operation to the history stack
  //     if (currentStep == hintStepsLength - 1) updateBoard(newBoard);
  //     else setBoard(newBoard);
  //     return;
  //   }

  //   // If they are entering hint mode, update board state by adding the hint

  //   newBoard = newBoard.set("currentStep", 0);
  //   let hint = getNextHint(newBoard, solution, props.strategies);

  //   if (!hint) return;
  //   const words = hint.strategy.toLowerCase().replaceAll("_", " ").split(" ");
  //   for (let i = 0; i < words.length; i++)
  //     words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  //   let hintStratName = words.join(" ");
  //   newBoard = newBoard.set("hintStratName", hintStratName);
  //   newBoard = newBoard.set("hintInfo", hint.info);
  //   newBoard = newBoard.set("hintAction", hint.action);

  //   let removals = getRemovalsFromHint(board, hint);

  //   if (hint.strategy === "AMEND_NOTES") {
  //     newBoard = addEveryRemovalNoteToBoard(newBoard, removals);
  //   }

  //   let hintObject: Hint = getHintObject(
  //     hint.strategy,
  //     getGroupsFromHint(hint),
  //     getCausesFromHint(hint),
  //     removals,
  //     getPlacementsFromHint(hint)
  //   );

  //   let hintSteps: any[] = hintObject.getHintSteps();
  //   newBoard = newBoard.set("hintSteps", hintSteps);
  //   setBoard(newBoard);
  // };

  // const addValueFromPlacement = (x, y, valueToAdd, currentStep) => {
  //   let newBoard = board;
  //   newBoard = newBoard.set("currentStep", currentStep);
  //   newBoard = updateBoardWithNumber({
  //     x,
  //     y,
  //     number: valueToAdd,
  //     fill: true,
  //     board: newBoard,
  //   });
  //   return newBoard;
  // };

  // const deleteValueFromPlacement = (x, y, valueToRemove, currentStep) => {
  //   let newBoard = board;
  //   newBoard = newBoard.set("currentStep", currentStep);
  //   newBoard = updateBoardWithNumber({
  //     x,
  //     y,
  //     number: valueToRemove,
  //     fill: false,
  //     board: newBoard,
  //   });
  //   newBoard = newBoard.setIn(["puzzle", x, y, "notes"], Set.of(valueToRemove));
  //   return newBoard;
  // };

  // const addNotesFromRemovals = (x, y, notesToAdd, currentStep, board) => {
  //   let notes = board.get("puzzle").getIn([x, y]).get("notes") || Set();
  //   board = board.set("currentStep", currentStep);
  //   for (let i = 0; i < notesToAdd.length; i++) {
  //     if (!notes.has(notesToAdd[i])) {
  //       notes = notes.add(notesToAdd[i]);
  //     }
  //   }
  //   board = board.setIn(["puzzle", x, y, "notes"], notes);
  //   return board;
  // };

  // const deleteNotesFromRemovals = (x, y, notesToRemove, currentStep, board) => {
  //   board = board.set("currentStep", currentStep);
  //   let notes = board.get("puzzle").getIn([x, y]).get("notes") || Set();
  //   for (let i = 0; i < notesToRemove.length; i++) {
  //     if (notes.has(notesToRemove[i])) {
  //       notes = notes.delete(notesToRemove[i]);
  //     }
  //   }
  //   board = board.setIn(["puzzle", x, y, "notes"], notes);
  //   return board;
  // };

  /**
   * Called when the user hits the 'erase' button
   * If notes are present in selected cell, removes all notes
   * If value is present in selected cell, removes value if value is incorrect
   */
  const eraseSelected = () => {
    updateCellEntry(0);
  };

  /**
   * Inserts a value into the selected cell
   * todo make it so that delete key works even in note mode
   * @param inputValue A number value to be inserted into the selected cell
   */
  const updateCellEntry = (inputValue: number) => {
    if (sudokuBoard.selectedCell == null) {
      return;
    }
    const currentSelectedCell: CellProps = getCurrentSelectedCell();
    const given: boolean = currentSelectedCell.type === "given";
    console.log("ANOTHER TEST 1", sudokuBoard.puzzle);
    console.log("ACTION HISTORY 1", sudokuBoard.actionHistory);

    // We do not need to take action if this is a given value
    if (given) {
      return;
    }

    const r: number = sudokuBoard.selectedCell.r;
    const c: number = sudokuBoard.selectedCell.c;
    const currentEntry = currentSelectedCell.entry;
    const currentType = currentSelectedCell.type;
    console.log("CURRENT VALUE: ", currentEntry, "NEW VALUE: ", inputValue);

    // We do not need to take action if current value matches existing value, or if value is correct
    if (
      currentType === "value" &&
      (currentEntry === inputValue ||
        isValueCorrect(sudokuBoard.puzzleSolution[c][r], currentEntry))
    ) {
      return;
    }

    console.log("CURRENT ENTRY STORED IN HISTORY: ", currentEntry);

    // Storing old value in actionHistory
    sudokuBoard.actionHistory.push({
      type: currentType,
      cell: { entry: currentEntry, type: currentType },
      cellLocation: { c: c, r: r },
    });

    console.log("ACTION HISTORY: ", sudokuBoard.actionHistory);

    // This value will be overridden if we are in note mode
    let newCellEntry: number | number[] = inputValue;

    // update type and newCellEntry of selected cell
    if (sudokuBoard.inNoteMode && currentType === "value" && inputValue !== 0) {
      sudokuBoard.puzzle[c][r].type = "note";
      newCellEntry = [inputValue];
    }
    // update type of selected cell
    else if (
      (!sudokuBoard.inNoteMode && currentType === "note") ||
      inputValue === 0
    ) {
      sudokuBoard.puzzle[c][r].type = "value";
    }
    // set new note value
    else if (sudokuBoard.inNoteMode) {
      const currentEntryCopy = JSON.parse(JSON.stringify(currentEntry));
      if (currentEntryCopy.includes(inputValue)) {
        newCellEntry = currentEntryCopy.filter((word) => word != inputValue);
      } else {
        currentEntryCopy.push(inputValue);
        newCellEntry = currentEntryCopy;
      }
    }

    // updating board entry
    sudokuBoard.puzzle[c][r].entry = newCellEntry;

    setSudokuBoard({
      ...sudokuBoard,
      puzzle: sudokuBoard.puzzle,
      actionHistory: sudokuBoard.actionHistory,
    });

    console.log("ANOTHER TEST", sudokuBoard.puzzle);
    console.log("ACTION HISTORY: ", sudokuBoard.actionHistory);

    // adding to the numWrongCellsPlayed Tracker
    // if (
    //   props.gameType != "StartDrill" &&
    //   !isValueCorrect(sudokuBoard.puzzleSolution[c][r], inputValue)
    // ) {
    //   setSudokuBoard({
    //     ...sudokuBoard,
    //     statistics: {
    //       ...sudokuBoard.statistics,
    //       numWrongCellsPlayed: sudokuBoard.statistics.numWrongCellsPlayed++,
    //     },
    //   });
    // }
  };

  /**
   * Toggles whether or not a cell is selected on click
   * @param r The row of a given cell 0-8
   * @param c the column of a given cell 0-8
   */
  const toggleSelectCell = (r: number, c: number) => {
    if (
      sudokuBoard.selectedCell &&
      sudokuBoard.selectedCell.c === c &&
      sudokuBoard.selectedCell.r === r
    ) {
      setSudokuBoard({ ...sudokuBoard, selectedCell: null });
    } else {
      setSudokuBoard({ ...sudokuBoard, selectedCell: { r: r, c: c } });
    }
  };

  /**
   * Determines if a cell in the puzzle has an incorrect value
   * @param r The row of a given cell 0-8
   * @param c the column of a given cell 0-8
   * @param cell The cell object
   * @returns True if the value in a cell is incorrect, False otherwise
   */
  const isConflict: boolean = (r: number, c: number, cell: CellProps) => {
    if (cell.type == "note" || cell.entry == 0) {
      return false;
    }
    return !(
      sudokuBoard.puzzle[c][r].entry === sudokuBoard.puzzleSolution[c][r]
    );
  };

  /**
   * Determines if there is an incorrect value in the board
   */
  const boardHasConflict = () => {
    for (let i = 0; i < 9; i++)
      for (let j = 0; j < 9; j++) if (isConflict(i, j)) return true;

    return false;
  };

  const renderCell = (cell: CellProps, r: number, c: number) => {
    console.log("RENDERING");
    const {
      isHighlightIdenticalValues,
      isHighlightBox,
      isHighlightRow,
      isHighlightColumn,
    } = React.useContext(PreferencesContext);

    let selected = sudokuBoard.selectedCell;
    let isSelected = false;
    let conflict = false;
    let peer = false;
    let box = false;
    let row = false;
    let column = false;
    let sameValue = false;

    if (selected != null) {
      conflict = isConflict(r, c, cell);
      isSelected =
        c === sudokuBoard.selectedCell.c && r === sudokuBoard.selectedCell.r;
      box = highlightBox({ r: r, c: c }, sudokuBoard.selectedCell);
      row = highlightRow({ r: r, c: c }, sudokuBoard.selectedCell);
      column = highlightColumn({ r: r, c: c }, sudokuBoard.selectedCell);
      peer =
        !conflict &&
        ((box && isHighlightBox) ||
          (row && isHighlightRow) ||
          (column && isHighlightColumn));

      const currentSelectedCell: CellProps = getCurrentSelectedCell();
      const selectedEntry = currentSelectedCell.entry;
      let currentEntry = cell.entry;
      sameValue =
        !conflict &&
        isHighlightIdenticalValues &&
        selectedEntry === currentEntry &&
        currentEntry != 0;
    }

    return (
      <Cell
        onClick={(r: number, c: number) => {
          toggleSelectCell(r, c);
        }}
        sameValue={sameValue}
        isSelected={isSelected}
        isPeer={peer}
        type={cell.type}
        value={cell.entry}
        conflict={conflict}
        eraseSelected={eraseSelected}
        key={r + ":" + c}
        c={c}
        r={r}
      />
    );
  };

  const renderTopBar = () => {
    return (
      <HeaderRow
        currentTime={activeGame[0].currentTime}
        activeGame={activeGame[0]}
        timer={timer}
        setTimer={setTimer}
      />
    );
  };

  const rightArrowClicked = () => {
    let newBoard = board;
    let hintSteps = newBoard.get("hintSteps");
    let currentStep = newBoard.get("currentStep") + 1;
    if (currentStep == undefined || currentStep == hintSteps.length) return;
    newBoard = newBoard.set("currentStep", currentStep);
    if (hintSteps[currentStep].removals) {
      for (let i = hintSteps[currentStep].removals.length - 1; i >= 0; i--) {
        if (hintSteps[currentStep].removals[i].mode === "delete") {
          let x = hintSteps[currentStep].removals[i].position[0];
          let y = hintSteps[currentStep].removals[i].position[1];
          let notesToRemove = hintSteps[currentStep].removals[i].values;
          newBoard = deleteNotesFromRemovals(
            x,
            y,
            notesToRemove,
            currentStep,
            newBoard
          );
        }
      }
    }
    if (hintSteps[currentStep].placements) {
      if (hintSteps[currentStep].placements.mode === "place") {
        let x = hintSteps[currentStep].placements.position[0];
        let y = hintSteps[currentStep].placements.position[1];
        let valueToAdd = hintSteps[currentStep].placements.value;
        newBoard = addValueFromPlacement(x, y, valueToAdd, currentStep);
      }
    }
    setBoard(newBoard);
  };

  const leftArrowClicked = () => {
    let newBoard = board;
    let hintSteps = newBoard.get("hintSteps");
    let currentStep = newBoard.get("currentStep") - 1;
    if (currentStep == undefined || currentStep < 0) return;
    newBoard = newBoard.set("currentStep", currentStep);
    if (hintSteps[currentStep].removals) {
      for (let i = 0; i < hintSteps[currentStep].removals.length; i++) {
        if (hintSteps[currentStep + 1].removals[i].mode === "delete") {
          let x = hintSteps[currentStep + 1].removals[i].position[0];
          let y = hintSteps[currentStep + 1].removals[i].position[1];
          let notesToRemove = hintSteps[currentStep + 1].removals[i].values;
          newBoard = addNotesFromRemovals(
            x,
            y,
            notesToRemove,
            currentStep,
            newBoard
          );
        }
      }
    }
    if (hintSteps[currentStep].placements) {
      if (hintSteps[currentStep + 1].placements.mode === "place") {
        let x = hintSteps[currentStep + 1].placements.position[0];
        let y = hintSteps[currentStep + 1].placements.position[1];
        let valueToRemove = hintSteps[currentStep + 1].placements.value;
        newBoard = deleteValueFromPlacement(x, y, valueToRemove, currentStep);
      }
    }
    setBoard(newBoard);
  };

  const checkMarkClicked = () => {
    toggleHintMode();
  };

  const getCurrentSelectedCell: CellProps = () => {
    if (sudokuBoard.selectedCell == null) {
      return;
    }
    return sudokuBoard.puzzle[sudokuBoard.selectedCell.c][
      sudokuBoard.selectedCell.r
    ];
  };

  const handleKeyDown = (event) => {
    if (sudokuBoard.selectedCell == null) {
      return;
    }

    let inHintMode = sudokuBoard.inHintMode;
    const inputValue = event.nativeEvent.key;
    if (
      /^[1-9]$/.test(inputValue) &&
      !inHintMode &&
      !(props.gameType == "Demo")
    ) {
      updateCellEntry(parseInt(inputValue, 10));
    }
    if (
      (inputValue == "Delete" ||
        inputValue == "Backspace" ||
        inputValue == "0") &&
      !inHintMode
    )
      eraseSelected();
  };

  const renderPuzzle = () => {
    return <Puzzle renderCell={renderCell} sudokuBoard={sudokuBoard} />;
  };

  const renderNumberControl = () => {
    const currentSelectedCell: CellProps = getCurrentSelectedCell();
    let prefilled = false;
    if (currentSelectedCell != null) {
      prefilled = currentSelectedCell.type === "given";
    }
    const inNoteMode = sudokuBoard.inNoteMode;
    const inHintMode = sudokuBoard.inHintMode;
    return (
      <NumberControl
        prefilled={prefilled}
        inNoteMode={inNoteMode}
        updateEntry={updateCellEntry}
        inHintMode={inHintMode}
      />
    );
  };

  const renderActions = () => {
    const inNoteMode = sudokuBoard.inNoteMode;
    const inHintMode = sudokuBoard.inHintMode;
    const currentSelectedCell: CellProps = getCurrentSelectedCell();

    let isEraseButtonDisabled = inHintMode || sudokuBoard.selectedCell == null;
    const isUndoButtonDisabled =
      sudokuBoard.actionHistory.length == 0 || inHintMode;
    const isNoteModeButtonDisabled = inHintMode;
    if (currentSelectedCell != null) {
      const isCellGiven = currentSelectedCell.type === "given";
      const isCellEmpty =
        currentSelectedCell.type === "value" && currentSelectedCell.entry === 0;
      const isCellCorrect =
        currentSelectedCell.type === "value" &&
        isValueCorrect(
          sudokuBoard.puzzleSolution[sudokuBoard.selectedCell.c][
            sudokuBoard.selectedCell.r
          ],
          currentSelectedCell.entry
        );
      // disable erase button if value === 0 or is given
      if (isCellGiven || isCellEmpty || isCellCorrect) {
        isEraseButtonDisabled = true;
      }
    }

    return (
      <ActionRow
        isEraseButtonDisabled={isEraseButtonDisabled}
        isUndoButtonDisabled={isUndoButtonDisabled}
        isNoteModeButtonDisabled={isNoteModeButtonDisabled}
        inNoteMode={inNoteMode}
        undo={undo}
        toggleNoteMode={toggleNoteMode}
        eraseSelected={eraseSelected}
        // toggleHintMode={toggleHintMode}
        inHintMode={inHintMode}
        boardHasConflict={boardHasConflict}
      />
    );
  };

  // todo fix this
  const renderSubmitButton = () => {
    const { navigation } = props;
    const isDrillSolutionCorrect = () => {
      let newBoard = board;
      for (let i = 0; i < drillSolutionCells.length; i++) {
        let x = drillSolutionCells[i].x;
        let y = drillSolutionCells[i].y;
        let solutionNotes = drillSolutionCells[i].notes;
        let solutionPlacement = drillSolutionCells[i].value;
        if (solutionNotes) {
          let boardNotes = newBoard.getIn(["puzzle", x, y, "notes"]) || Set();
          if (!boardNotes.equals(solutionNotes)) {
            newBoard = originalBoard;
            setBoard(newBoard);
            return false;
          }
        } else if (solutionPlacement) {
          let boardValue = newBoard.getIn(["puzzle", x, y, "value"]) || -1;
          if (boardValue != solutionPlacement) {
            newBoard = originalBoard;
            setBoard(newBoard);
            return false;
          }
        }
      }
      return true;
    };

    return (
      <DrillSubmitButton
        isDrillSolutionCorrect={isDrillSolutionCorrect}
        navigation={navigation}
      />
    );
  };

  const renderHintSection = () => {
    let onFirstStep = false;
    let onFinalStep = false;
    if (board.get("hintSteps") != undefined) {
      let currentStep = board.get("currentStep");
      let numHintSteps = board.get("hintSteps").length;
      if (currentStep + 1 == 1) onFirstStep = true;
      if (currentStep + 1 == numHintSteps) onFinalStep = true;
    }
    let hintStratName = board ? board.get("hintStratName") : "Hint";
    let currentStep = board ? board.get("currentStep") : -1;
    let hintInfo = board ? board.get("hintInfo") : "Info";
    let hintAction = board ? board.get("hintAction") : "Action";
    return (
      <HintSection
        hintStratName={hintStratName}
        hintInfo={hintInfo}
        hintAction={hintAction}
        currentStep={currentStep}
        rightArrowClicked={rightArrowClicked}
        leftArrowClicked={leftArrowClicked}
        checkMarkClicked={checkMarkClicked}
        onFirstStep={onFirstStep}
        onFinalStep={onFinalStep}
      />
    );
  };

  return (
    <View
      testID={
        props.gameType == "Demo"
          ? "sudokuDemoBoard"
          : props.gameType == "StartDrill"
          ? "sudokuDrillBoard"
          : "sudokuBoard"
      }
      onKeyDown={handleKeyDown}
      styles={{ borderWidth: 1 }}
    >
      {/* {sudokuBoard &&
        !(props.gameType == "Demo") &&
        !(props.gameType == "StartDrill") &&
        renderTopBar()} */}
      {sudokuBoard && renderPuzzle()}
      {sudokuBoard && (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {!(props.gameType == "Demo") && renderActions()}
          {!(props.gameType == "Demo") &&
            !sudokuBoard.inHintMode &&
            renderNumberControl()}
          {props.gameType == "StartDrill" &&
            !sudokuBoard.inHintMode &&
            renderSubmitButton()}
          {!(props.gameType == "Demo") &&
            sudokuBoard.inHintMode &&
            renderHintSection()}
        </View>
      )}
    </View>
  );
};

export default SudokuBoard;
