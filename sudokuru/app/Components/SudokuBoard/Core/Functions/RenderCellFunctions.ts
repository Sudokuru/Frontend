import React from "react";
import { PreferencesContext } from "../../../../Contexts/PreferencesContext";
import {
  SudokuObjectProps,
  CellProps,
  CellLocation,
} from "../../../../Functions/LocalDatabase";
import {
  NOT_SELECTED_CONFLICT_COLOR,
  SELECTED_CONFLICT_COLOR,
  SELECTED_IDENTICAL_VALUE_COLOR,
  SELECTED_COLOR,
  IDENTICAL_VALUE_COLOR,
  PEER_SELECTED_COLOR,
  HINT_SELECTED_COLOR,
  HINT_NOT_HIGHLIGHTED_COLOR,
} from "../../../../Styling/HighlightColors";
import { HintObjectProps } from "../../SudokuBoard";
import {
  areCellsInSameBox,
  areCellsInSameColumn,
  areCellsInSameRow,
  doesCellHaveConflict,
  generateBoxIndex,
  getSelectedCells,
} from "./CellFunctions";

/**
 * This function returns an array of 9 strings representing the colors of the
 * notes for the cell at row r and column c. The colors returned are black
 * unless the cell is part of a note removal hint and the hint is currently
 * being displayed. In the case of a note removal hint, the color of the
 * removed note will be red. The inputs r and c are the row and column of the
 * cell for which the note colors should be determined.
 * @param r the row of the cell for which the note colors should be determined
 * @param c the column of the cell for which the note colors should be
 * determined
 */
export const getCellNotesColor = (
  sudokuHint: HintObjectProps | undefined,
  r: number,
  c: number,
) => {
  const notesToReturn = Array(9).fill("black");
  // change note color to red for note removals as part of hint
  if (sudokuHint && sudokuHint.stage === 4) {
    const hintNotes = JSON.parse(JSON.stringify(sudokuHint.hint.removals));
    for (const notes of hintNotes) {
      if (notes[0] === r && notes[1] === c) {
        notes.splice(0, 2);
        for (const note of notes) {
          notesToReturn[note - 1] = "red";
        }
      }
    }
  }
  return notesToReturn;
};

export const getCellBackgroundNotesColor = (cellBackgroundColor: string) => {
  return Array(9).fill(cellBackgroundColor);
};

/**
 * Determines the background color of a cell based on its state and properties.
 *
 * @param cell - The cell properties including its value and notes.
 * @param r - The row index of the cell.
 * @param c - The column index of the cell.
 * @returns The background color as a string based on the cell's selection, conflict status,
 *          peer relationship, identical value presence, and hint associations.
 *
 * The function evaluates the cell's state to set the background color. It considers
 * if the cell is selected, in conflict, a peer to the selected cell, or has identical
 * values with another cell, and assigns a color accordingly. Additionally, it checks
 * if the cell is part of a hint, adjusting the color to reflect its role in the hint.
 */
export const useCellBackgroundColor = (
  sudokuBoard: SudokuObjectProps,
  sudokuHint: HintObjectProps | undefined,
  r: number,
  c: number,
): string => {
  const selectedCell = sudokuBoard.selectedCells;
  const selected: boolean = isCellSelected(selectedCell, r, c);
  const conflict: boolean = doesCellHaveConflict(sudokuBoard, r, c);
  const peer: boolean = useIsCellPeer(r, c, selectedCell);
  const identicalValue: boolean = useDoesCellHaveIdenticalValue(
    sudokuBoard,
    sudokuBoard.puzzle[r][c],
  );

  let cellBackgroundColor;
  if (conflict && !selected) {
    cellBackgroundColor = NOT_SELECTED_CONFLICT_COLOR;
  } else if (conflict && selected) {
    cellBackgroundColor = SELECTED_CONFLICT_COLOR;
  } else if (selected && identicalValue) {
    cellBackgroundColor = SELECTED_IDENTICAL_VALUE_COLOR;
  } else if (selected) {
    cellBackgroundColor = SELECTED_COLOR;
  } else if (identicalValue) {
    cellBackgroundColor = IDENTICAL_VALUE_COLOR;
  } else if (peer) {
    cellBackgroundColor = PEER_SELECTED_COLOR;
  } else {
    cellBackgroundColor = "white";
  }

  if (sudokuHint) {
    const hintCause = isCellAHintCause(sudokuHint, r, c);
    const hintFocus = isCellAHintFocus(sudokuHint, r, c);

    if (hintCause) {
      cellBackgroundColor = HINT_SELECTED_COLOR;
    } else if (!hintFocus) {
      cellBackgroundColor = HINT_NOT_HIGHLIGHTED_COLOR;
    }
  }

  return cellBackgroundColor;
};

/**
 * Determines if a cell is a cause of a hint. A cause is a cell that is relevant to the hint and is highlighted in the hint.
 * @param r The row coordinate of the cell to check
 * @param c The column coordinate of the cell to check
 * @returns True if the cell is a cause of the hint, false otherwise
 */
const isCellAHintCause = (
  sudokuHint: HintObjectProps | undefined,
  r: number,
  c: number,
): boolean => {
  if (!sudokuHint) {
    return false;
  }

  for (const cause of sudokuHint.hint.cause) {
    if (cause[0] === r && cause[1] === c && sudokuHint.stage >= 4) {
      return true;
    }
  }
  return false;
};

/**
 * Determines if a cell is a focus of a hint. A focus is the region the user should be focused on during a hint.
 * @param r The row coordinate of the cell to check.
 * @param c The column coordinate of the cell to check.
 * @returns True if the cell is a focus of the hint, false otherwise.
 */
const isCellAHintFocus = (
  sudokuHint: HintObjectProps | undefined,
  r: number,
  c: number,
): boolean => {
  if (!sudokuHint) {
    return false;
  }

  if (sudokuHint.stage < 3) {
    return true;
  }

  for (const group of sudokuHint.hint.groups) {
    const cellSharesGroupRow = group[0] === 0 && group[1] === r;
    const cellSharesGroupColumn = group[0] === 1 && group[1] === c;
    const cellSharesGroupBox =
      group[0] === 2 && generateBoxIndex(r, c) === group[1];

    if (cellSharesGroupRow || cellSharesGroupColumn || cellSharesGroupBox) {
      return true;
    }
  }

  return false;
};

/**
 * Determines if the coordinates provided match with the selected cell
 * @param r The row coordinate of a cell
 * @param c The column coordinate of a cell
 * @param selectedCell The selected cell
 * @returns false if selectedCell is empty or does not match the coordinates provided
 */
const isCellSelected = (
  selectedCell: CellLocation[],
  r: number,
  c: number,
): boolean => {
  if (selectedCell.length === 0) {
    return false;
  } else {
    let isCellSelected = false;
    for (const cell of selectedCell) {
      if (c === cell.c && r === cell.r) {
        isCellSelected = true;
      }
    }
    return isCellSelected;
  }
};

/**
 * Determines if a cell should be highlighted as having an identical value to the selected cell.
 * @param cell The cell to check
 * @returns True if the cell should be highlighted as having an identical value, false otherwise
 * @remarks
 * This function will return false if no cells are selected, more than one cell is selected, or if the cell is empty.
 * This function will also return false if the user has disabled highlighting of identical values in their preferences.
 */
const useDoesCellHaveIdenticalValue = (
  sudokuBoard: SudokuObjectProps,
  cell: CellProps,
): boolean => {
  const { highlightIdenticalValuesSetting } =
    React.useContext(PreferencesContext);

  // disable highlighting of identical values if no cells are selected or more than 1 cell is selected
  if (sudokuBoard.selectedCells.length !== 1) {
    return false;
  }
  const currentSelectedCell = getSelectedCells(sudokuBoard);
  let currentEntry = cell.entry;
  // for the purposes of highlighting identical values, a cell with notes is treated as an empty cell
  if (cell.type === "note") {
    currentEntry = 0;
  }
  const selectedEntry = currentSelectedCell[0].entry;
  const identicalValue = selectedEntry === currentEntry;

  return (
    highlightIdenticalValuesSetting && identicalValue && currentEntry !== 0
  );
};

/**
 * Determines if a cell should be highlighted as a peer of the selected cell.
 * Definition of peer can be found here: http://sudopedia.enjoysudoku.com/Peer.html
 * @param r The row of the cell to check.
 * @param c The column of the cell to check.
 * @param selectedCells The selected cells.
 * @returns True if the cell should be highlighted as a peer, false otherwise.
 * @remarks
 * This function will return false if no cells are selected or more than 1 cell is selected.
 * This function will also return false if the user has disabled highlighting of peers in their preferences.
 */
const useIsCellPeer = (
  r: number,
  c: number,
  selectedCells: CellLocation[],
): boolean => {
  const { highlightBoxSetting, highlightRowSetting, highlightColumnSetting } =
    React.useContext(PreferencesContext);

  // disable highlighting peers if no cells selected or more than 1 cell is selected.
  if (selectedCells.length !== 1) {
    return false;
  }

  const selectedCell = selectedCells[0];

  const sameBox = areCellsInSameBox({ r: r, c: c }, selectedCell);
  const sameRow = areCellsInSameRow({ r: r, c: c }, selectedCell);
  const sameColumn = areCellsInSameColumn({ r: r, c: c }, selectedCell);

  return (
    (sameBox && highlightBoxSetting) ||
    (sameRow && highlightRowSetting) ||
    (sameColumn && highlightColumnSetting)
  );
};
