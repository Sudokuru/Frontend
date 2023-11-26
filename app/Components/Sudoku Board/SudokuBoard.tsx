// @ts-nocheck
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Set } from "immutable";
import { finishGame, saveGame } from "./Functions/BoardFunctions";

import { highlightBox, highlightColumn, highlightRow, isPeer } from "./sudoku";

import { ActivityIndicator, useTheme } from "react-native-paper";
import NumberControl from "./Components/NumberControl";
import { isValueCorrect } from "./Functions/BoardFunctions";
import Cell from "./Components/Cell";
import ActionRow from "./Components/ActionRow";
import HintSection from "./Components/HintSection";
import { generateGame } from "./Functions/generateGame";
import Puzzle from "./Components/Puzzle";
import {
  CellProps,
  SudokuBoardProps,
} from "../../Functions/LocalStore/DataStore/LocalDatabase";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import HeaderRow from "./Components/HeaderRow";

const SudokuBoard = (props: any) => {
  const [isLoading, setIsLoading] = useState(true);

  const [sudokuBoard, setSudokuBoard] = useState<SudokuBoardProps | null>(null);

  useEffect(() => {
    generateGame(props).then((game) => {
      setSudokuBoard(game);
      setIsLoading(false);
    });
  }, []);

  // if we are loading then we return the loading icon
  if (isLoading) return <ActivityIndicator animating={true} color="red" />;

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

  const toggleNoteMode = () => {
    sudokuBoard.inNoteMode = !sudokuBoard.inNoteMode;
    setSudokuBoard({ ...sudokuBoard, inNoteMode: sudokuBoard.inNoteMode });
  };

  /**
   * Called when the user hits the 'erase' button
   * If notes are present in selected cell, removes all notes
   * If value is present in selected cell, removes value if value is incorrect
   */
  const eraseSelected = () => {
    updateCellEntry(0);
  };

  /**
   * Inserts or removes a note or value from a selected cell
   * @param inputValue User input 0-9
   */
  const updateCellEntry = (inputValue: number) => {
    if (sudokuBoard.selectedCell == null) {
      return;
    }
    const currentSelectedCell: CellProps = getCurrentSelectedCell();
    // We do not need to take action if this is a given value
    if (currentSelectedCell.type === "given") {
      return;
    }

    const r: number = sudokuBoard.selectedCell.r;
    const c: number = sudokuBoard.selectedCell.c;
    const currentEntry = currentSelectedCell.entry;
    const currentType = currentSelectedCell.type;

    // We do not need to take action if current value matches existing value, or if value is correct
    if (
      currentType === "value" &&
      (currentEntry === inputValue ||
        isValueCorrect(sudokuBoard.puzzleSolution[c][r], currentEntry))
    ) {
      return;
    }

    // Set new Cell Value
    setCellEntryValue(inputValue);

    // Incrementing numWrongCellsPlayed value
    if (
      !sudokuBoard.inNoteMode &&
      !isValueCorrect(sudokuBoard.puzzleSolution[c][r], inputValue)
    ) {
      sudokuBoard.statistics.numWrongCellsPlayed++;
    }

    // Storing old value in actionHistory
    sudokuBoard.actionHistory.push({
      type: currentType,
      cell: { entry: currentEntry, type: currentType },
      cellLocation: { c: c, r: r },
    });

    setSudokuBoard({
      ...sudokuBoard,
      puzzle: sudokuBoard.puzzle,
      actionHistory: sudokuBoard.actionHistory,
      statistics: sudokuBoard.statistics,
    });

    // Saving current game status
    saveGame(sudokuBoard);

    if (!sudokuBoard.inNoteMode && isGameSolved()) {
      console.log("GAME IS SOLVED");
      finishGame(props.showGameResults);
    }
  };

  /**
   * Sub function of @function updateCellEntry
   * Updates the selected cell updated based on the user input value and what is currently in the cell
   * @param inputValue User input 0-9
   */
  const setCellEntryValue = (inputValue: number) => {
    const currentSelectedCell: CellProps = getCurrentSelectedCell();
    const currentType = currentSelectedCell.type;
    const currentEntry = currentSelectedCell.entry;
    const r: number = sudokuBoard.selectedCell.r;
    const c: number = sudokuBoard.selectedCell.c;

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
  };

  const isGameSolved: boolean = () => {
    console.log("HELLO");
    for (c = 0; c < sudokuBoard.puzzle.length; c++) {
      for (r = 0; r < sudokuBoard.puzzle[c].length; r++) {
        console.log(
          sudokuBoard.puzzle[c][r].entry,
          sudokuBoard.puzzle[c][r].type
        );
        if (sudokuBoard.puzzle[c][r].type === "given") continue;
        if (
          sudokuBoard.puzzle[c][r].type === "note" ||
          sudokuBoard.puzzle[c][r].entry === 0
        ) {
          console.log("HELLO");
          console.log(
            sudokuBoard.puzzleSolution[c][r],
            sudokuBoard.puzzle[c][r].entry
          );
          return false;
        }
        const isValueCorrectResult = isValueCorrect(
          sudokuBoard.puzzleSolution[c][r],
          sudokuBoard.puzzle[c][r].entry
        );

        if (isValueCorrectResult === false) {
          console.log(
            sudokuBoard.puzzleSolution[c][r],
            sudokuBoard.puzzle[c][r].entry
          );
          return false;
        }
      }
    }
    return true;
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
        entry={cell.entry}
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
      <HeaderRow sudokuBoard={sudokuBoard} setSudokuBoard={setSudokuBoard} />
    );
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
      sudokuBoard.actionHistory == null ||
      sudokuBoard.actionHistory.length == 0 ||
      inHintMode;
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
      {sudokuBoard &&
        !(props.gameType == "Demo") &&
        !(props.gameType == "StartDrill") &&
        renderTopBar()}
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
