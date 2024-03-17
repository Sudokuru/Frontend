import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import ActionRow from "./Components/ActionRow";
import Cell from "./Components/Cell";
import EndGameModal from "./Components/EndGameModal";
import HeaderRow from "./Components/HeaderRow";
import NumberControl from "./Components/NumberControl";
import Puzzle from "./Components/Puzzle";
import {
  finishGame,
  saveGame,
  isValueCorrect,
} from "./Functions/BoardFunctions";
import { generateGame } from "./Functions/generateGame";
import {
  isCurrentCellAndSelectedCellInSameBox,
  isCurrentCellAndSelectedCellInSameColumn,
  isCurrentCellAndSelectedCellInSameRow,
} from "./sudoku";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import { CellProps, SudokuObjectProps } from "../../Functions/LocalDatabase";

export interface SudokuBoardProps {
  action: "StartGame" | "ResumeGame";
}

const SudokuBoard = (props: SudokuBoardProps) => {
  const [sudokuBoard, setSudokuBoard] = useState<SudokuObjectProps>();
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    generateGame(props).then((game) => {
      // eslint-disable-next-line eqeqeq
      if (game == null) {
        return;
      }
      setSudokuBoard(game);
    });
  }, []);

  const {
    isHighlightIdenticalValues,
    isHighlightBox,
    isHighlightRow,
    isHighlightColumn,
  } = React.useContext(PreferencesContext);

  // if we are loading then we return the loading icon
  if (sudokuBoard == null) {
    return <ActivityIndicator animating color="red" />;
  }

  // Render EndGame screen when game has ended
  if (gameOver) {
    return (
      <EndGameModal
        score={sudokuBoard.statistics.score}
        time={sudokuBoard.statistics.time}
        difficulty={sudokuBoard.statistics.difficulty}
        numHintsUsed={sudokuBoard.statistics.numHintsUsed}
        numWrongCellsPlayed={sudokuBoard.statistics.numWrongCellsPlayed}
      />
    );
  }

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
    if (move == null) {
      return;
    }
    sudokuBoard.puzzle[move.cellLocation.r][move.cellLocation.c].type =
      move.cell.type;
    sudokuBoard.puzzle[move.cellLocation.r][move.cellLocation.c].entry =
      move.cell.entry;
    // remove from move history
    setSudokuBoard({
      ...sudokuBoard,
      actionHistory: sudokuBoard.actionHistory,
    });
  };

  const toggleNoteMode = () => {
    sudokuBoard.inNoteMode = !sudokuBoard.inNoteMode;
    setSudokuBoard({
      ...sudokuBoard,
      inNoteMode: sudokuBoard.inNoteMode,
    });
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
    const currentSelectedCell: CellProps | null = getCurrentSelectedCell();
    if (currentSelectedCell == null) {
      return;
    }
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
        isValueCorrect(
          sudokuBoard.puzzleSolution[r][c],
          currentEntry as number,
        ))
    ) {
      return;
    }

    // Set new Cell Value
    setCellEntryValue(inputValue);

    // Incrementing numWrongCellsPlayed value
    if (
      !sudokuBoard.inNoteMode &&
      !isValueCorrect(sudokuBoard.puzzleSolution[r][c], inputValue)
    ) {
      sudokuBoard.statistics.numWrongCellsPlayed++;
    }

    // Storing old value in actionHistory
    sudokuBoard.actionHistory.push({
      cell: { entry: currentEntry, type: currentType } as CellProps, // annoying typescript casting workaround
      cellLocation: { c, r },
    });

    // Saving current game status
    saveGame(sudokuBoard);

    if (!sudokuBoard.inNoteMode && isGameSolved()) {
      const score = finishGame(
        sudokuBoard.statistics.difficulty,
        sudokuBoard.statistics.numHintsUsed,
        sudokuBoard.statistics.numWrongCellsPlayed,
        sudokuBoard.statistics.time,
      );
      sudokuBoard.statistics.score = score;
      setSudokuBoard({
        ...sudokuBoard,
        puzzle: sudokuBoard.puzzle,
        actionHistory: sudokuBoard.actionHistory,
        statistics: sudokuBoard.statistics,
      });
      setGameOver(true);
    } else {
      setSudokuBoard({
        ...sudokuBoard,
        puzzle: sudokuBoard.puzzle,
        actionHistory: sudokuBoard.actionHistory,
        statistics: sudokuBoard.statistics,
      });
    }
  };

  /**
   * Sub function of @function updateCellEntry
   * Updates the selected cell updated based on the user input value and what is currently in the cell
   * @param inputValue User input 0-9
   */
  const setCellEntryValue = (inputValue: number) => {
    if (sudokuBoard.selectedCell == null) {
      return;
    }
    const currentSelectedCell: CellProps | null = getCurrentSelectedCell();
    if (currentSelectedCell == null) {
      return;
    }
    const currentType = currentSelectedCell.type;
    const currentEntry = currentSelectedCell.entry;
    const r: number = sudokuBoard.selectedCell.r;
    const c: number = sudokuBoard.selectedCell.c;

    // This value will be overridden if we are in note mode
    let newCellEntry: number | number[] = inputValue;
    // update type and newCellEntry of selected cell
    if (sudokuBoard.inNoteMode && currentType === "value" && inputValue !== 0) {
      sudokuBoard.puzzle[r][c].type = "note";
      newCellEntry = [inputValue];
    }
    // update type of selected cell
    else if (
      (!sudokuBoard.inNoteMode && currentType === "note") ||
      inputValue === 0
    ) {
      sudokuBoard.puzzle[r][c].type = "value";
    }
    // set new note value
    else if (sudokuBoard.inNoteMode) {
      const currentEntryCopy = JSON.parse(JSON.stringify(currentEntry));
      if (currentEntryCopy.includes(inputValue)) {
        newCellEntry = currentEntryCopy.filter(
          (note: number) => note !== inputValue,
        );
      } else {
        currentEntryCopy.push(inputValue);
        newCellEntry = currentEntryCopy;
      }
    }

    // updating board entry
    sudokuBoard.puzzle[r][c].entry = newCellEntry;
  };

  const isGameSolved = (): boolean => {
    for (let r = 0; r < sudokuBoard.puzzle.length; r++) {
      for (let c = 0; c < sudokuBoard.puzzle[r].length; c++) {
        if (sudokuBoard.puzzle[r][c].type === "given") continue;
        if (
          sudokuBoard.puzzle[r][c].type === "note" ||
          sudokuBoard.puzzle[r][c].entry === 0
        ) {
          return false;
        }
        const isValueCorrectResult = isValueCorrect(
          sudokuBoard.puzzleSolution[r][c],
          sudokuBoard.puzzle[r][c].entry as number,
        );
        if (isValueCorrectResult === false) {
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
      setSudokuBoard({
        ...sudokuBoard,
        selectedCell: null,
      });
    } else {
      setSudokuBoard({
        ...sudokuBoard,
        selectedCell: { r, c },
      });
    }
  };

  /**
   * Determines if a cell in the puzzle has an incorrect value
   * @param r The row of a given cell 0-8
   * @param c the column of a given cell 0-8
   * @param cell The cell object
   * @returns True if the value in a cell is incorrect, False otherwise
   */
  const isConflict = (r: number, c: number, cell: CellProps): boolean => {
    if (cell.type === "note" || cell.entry === 0) {
      return false;
    }
    return !(
      sudokuBoard.puzzle[r][c].entry === sudokuBoard.puzzleSolution[r][c]
    );
  };

  const renderCell = (cell: CellProps, r: number, c: number) => {
    // row and column values are incorrect here.
    // console.log("RENDER CELL", c, "COLUMN", r, "ROW", cell)

    const selected = sudokuBoard.selectedCell;
    let isSelected = false;
    const conflict = isConflict(r, c, cell);
    let peer = false;
    let box = false;
    let row = false;
    let column = false;
    let sameValue = false;
    if (selected != null) {
      isSelected = c === selected.c && r === selected.r;
      box = isCurrentCellAndSelectedCellInSameBox({ r, c }, selected);
      row = isCurrentCellAndSelectedCellInSameRow({ r, c }, selected);
      column = isCurrentCellAndSelectedCellInSameColumn({ r, c }, selected);
      peer =
        !conflict &&
        ((box && isHighlightBox) ||
          (row && isHighlightRow) ||
          (column && isHighlightColumn));

      const currentSelectedCell: CellProps | null = getCurrentSelectedCell();
      if (currentSelectedCell == null) {
        return;
      }
      const selectedEntry = currentSelectedCell.entry;
      const currentEntry = cell.entry;
      sameValue =
        !conflict &&
        isHighlightIdenticalValues &&
        selectedEntry === currentEntry &&
        currentEntry !== 0;
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

  const getCurrentSelectedCell = (): CellProps | null => {
    if (sudokuBoard.selectedCell == null) {
      return null;
    }
    return sudokuBoard.puzzle[sudokuBoard.selectedCell.r][
      sudokuBoard.selectedCell.c
    ];
  };

  const handleKeyDown = (event: any) => {
    if (sudokuBoard.selectedCell == null) {
      return;
    }

    const inputValue = event.nativeEvent.key;
    if (/^[1-9]$/.test(inputValue)) {
      updateCellEntry(parseInt(inputValue, 10));
    }
    if (
      inputValue === "Delete" ||
      inputValue === "Backspace" ||
      inputValue === "0"
    )
      eraseSelected();
  };

  const renderPuzzle = () => {
    return <Puzzle renderCell={renderCell} sudokuBoard={sudokuBoard} />;
  };

  const renderNumberControl = () => {
    let currentSelectedCell: CellProps | null = null;
    let isBoardSelected: boolean = true;
    if (sudokuBoard.selectedCell != null) {
      currentSelectedCell = getCurrentSelectedCell();
    } else {
      isBoardSelected = false;
    }
    let isGiven = false;
    let isCellCorrect = false;
    if (currentSelectedCell != null) {
      isGiven = currentSelectedCell.type === "given";
      isCellCorrect =
        currentSelectedCell.type === "value" &&
        isValueCorrect(
          sudokuBoard.puzzleSolution[sudokuBoard.selectedCell!.r][
            sudokuBoard.selectedCell!.c
          ],
          currentSelectedCell.entry,
        );
    }
    return (
      <NumberControl
        areNumberButtonsDisabled={isGiven || !isBoardSelected || isCellCorrect}
        updateEntry={updateCellEntry}
      />
    );
  };

  const renderActions = () => {
    const inNoteMode = sudokuBoard.inNoteMode;
    const currentSelectedCell: CellProps | null = getCurrentSelectedCell();
    let isEraseButtonDisabled = sudokuBoard.selectedCell == null;
    const isUndoButtonDisabled =
      sudokuBoard.actionHistory == null ||
      sudokuBoard.actionHistory.length === 0;
    if (currentSelectedCell != null) {
      const isCellGiven = currentSelectedCell.type === "given";
      const isCellEmpty =
        currentSelectedCell.type === "value" && currentSelectedCell.entry === 0;
      const isCellCorrect =
        currentSelectedCell.type === "value" &&
        isValueCorrect(
          sudokuBoard.puzzleSolution[sudokuBoard.selectedCell!.r][
            sudokuBoard.selectedCell!.c
          ],
          currentSelectedCell.entry,
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
        inNoteMode={inNoteMode}
        undo={undo}
        toggleNoteMode={toggleNoteMode}
        eraseSelected={eraseSelected}
      />
    );
  };

  return (
    <View
      testID="sudokuBoard"
      onKeyDown={handleKeyDown}
      style={{
        alignItems: "center",
        alignContent: "center",
      }}
    >
      {renderTopBar()}
      {renderPuzzle()}
      {renderActions()}
      {renderNumberControl()}
    </View>
  );
};

export default SudokuBoard;
