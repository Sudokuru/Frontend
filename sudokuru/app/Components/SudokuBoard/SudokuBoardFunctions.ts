import {
  CellLocation,
  CellProps,
  SudokuObjectProps,
} from "../../Functions/LocalDatabase";
import { HintObjectProps } from "./SudokuBoard";

/**
 * Checks if a given cell in the puzzle has a conflict with the solution.
 *
 * @param r - The row index of the cell.
 * @param c - The column index of the cell.
 * @param cell - The cell object containing its type and entry.
 * @returns True if the cell's entry is incorrect; false otherwise.
 */
export const doesCellHaveConflict = (
  sudokuBoard: SudokuObjectProps,
  r: number,
  c: number
): boolean => {
  const cell = sudokuBoard.puzzle[r][c];
  if (cell.type == "note" || cell.entry == 0) {
    return false;
  }
  return !(sudokuBoard.puzzle[r][c].entry === sudokuBoard.puzzleSolution[r][c]);
};

export const getSelectedCells = (
  sudokuBoard: SudokuObjectProps
): CellProps[] => {
  if (sudokuBoard.selectedCells.length === 0) {
    return [];
  }
  const selectedCells: CellProps[] = [];
  for (const selectedCell of sudokuBoard.selectedCells) {
    selectedCells.push(sudokuBoard.puzzle[selectedCell.r][selectedCell.c]);
  }
  return selectedCells;
};

export const isBoardDisabled = (sudokuHint: HintObjectProps | undefined) => {
  if (sudokuHint != null) {
    return true;
  } else {
    return false;
  }
};

/**
 * todo all updates to sudokuru state should be done inside of SudokuBoard.tsx, this may need to be moved depending on how things go
 * Toggles whether or not a cell is selected on click
 * event.ctrlKey, event.metaKey and event.shiftKey are from React Native Web, which does not export types that we can use
 * https://stackoverflow.com/questions/41648156/detect-if-shift-key-is-down-react-native
 * https://github.com/necolas/react-native-web/issues/1684
 * @param r The row of a given cell 0-8
 * @param c the column of a given cell 0-8
 * @param event GestureResponderEvent event type from react-native with additional options from react-native-web
 */
export const toggleSelectCell = (
  sudokuBoard: SudokuObjectProps,
  setBoardSelectedCells: (cells: CellLocation[]) => void,
  sudokuHint: HintObjectProps | undefined,
  r: number,
  c: number,
  event: any
) => {
  if (isBoardDisabled(sudokuHint)) {
    return;
  }
  if (sudokuBoard.selectedCells.length === 0) {
    sudokuBoard.selectedCells.push({ r: r, c: c });
  } else if (event.ctrlKey || event.metaKey) {
    toggleSelectCellWithControlRules(sudokuBoard, r, c);
  } else if (event.shiftKey) {
    toggleSelectCellWithShiftRules(sudokuBoard, r, c);
  } else {
    toggleSelectCellWithDefaultRules(sudokuBoard, r, c);
  }

  setBoardSelectedCells(sudokuBoard.selectedCells);
};

/**
 * Determines what deselect / select actions should take place.
 * This function is run when default behavior is desired, which is when
 * no modifier keys are pressed.
 * @param r The row of the cell where select toggle action is taking place.
 * @param c The column of the cell where select toggle action is taking place.
 */
const toggleSelectCellWithDefaultRules = (
  sudokuBoard: SudokuObjectProps,
  r: number,
  c: number
) => {
  let addCell = true;
  for (const cell of sudokuBoard.selectedCells) {
    if (cell.c === c && cell.r === r) {
      addCell = false;
    }
  }
  sudokuBoard.selectedCells = [];
  if (addCell) {
    sudokuBoard.selectedCells.push({ r: r, c: c });
  }
};

/**
 * Determines what deselect / select actions should take place when control/meta key is held down.
 * @param r The row of the cell where select toggle action is taking place.
 * @param c The column of the cell where select toggle action is taking place.
 */
const toggleSelectCellWithControlRules = (
  sudokuBoard: SudokuObjectProps,
  r: number,
  c: number
) => {
  let addCell = true;
  for (let i = 0; i < sudokuBoard.selectedCells.length; i++) {
    if (
      sudokuBoard.selectedCells[i].c === c &&
      sudokuBoard.selectedCells[i].r === r
    ) {
      addCell = false;
      sudokuBoard.selectedCells.splice(i, 1);
    }
  }
  if (addCell) {
    sudokuBoard.selectedCells.push({ r: r, c: c });
  }
};

/**
 * Determines what deselect / select actions should take place when shift key is held down.
 * @param r The row of the cell where select toggle action is taking place.
 * @param c The column of the cell where select toggle action is taking place.
 */
const toggleSelectCellWithShiftRules = (
  sudokuBoard: SudokuObjectProps,
  r: number,
  c: number
) => {
  const pointOneRow = sudokuBoard.selectedCells[0].r;
  const pointOneColumn = sudokuBoard.selectedCells[0].c;

  const selectionRowLength = r - pointOneRow;
  const selectionColumnLength = c - pointOneColumn;

  const newSelectedCells = [];
  for (let i = 0; i <= Math.abs(selectionRowLength); i++) {
    for (let j = 0; j <= Math.abs(selectionColumnLength); j++) {
      newSelectedCells.push({
        r: sudokuBoard.selectedCells[0].r + i * Math.sign(selectionRowLength),
        c:
          sudokuBoard.selectedCells[0].c + j * Math.sign(selectionColumnLength),
      });
    }
  }
  sudokuBoard.selectedCells = newSelectedCells;
};

// todo remove, used in NumberControl.tsx
export function range(n: number) {
  return Array.from(Array(n).keys());
}

/**
 * Determines if the current cell and selected cell are in the same box
 * @param currentCellCoordinate The CellLocation of current cell
 * @param selectedCellCoordinate The CellLocation of selected cell
 * @returns boolean that indicates if current cell is in the same box as selected cell
 */
export function areCellsInSameBox(
  currentCellCoordinate: CellLocation,
  selectedCellCoordinate: CellLocation
) {
  const currentBoxIndex = generateBoxIndex(
    currentCellCoordinate.r,
    currentCellCoordinate.c
  );
  const selectedBoxIndex = generateBoxIndex(
    selectedCellCoordinate.r,
    selectedCellCoordinate.c
  );
  return currentBoxIndex === selectedBoxIndex;
}

/**
 * Generates a unique index for a box given the box's row and column
 * @param row number 0-8 of the cell
 * @param column number 0-8 of the cell
 */
export function generateBoxIndex(row: number, column: number): number {
  return Math.floor(column / 3) + Math.floor(row / 3) * 3;
}

/**
 * Determines if the current cell and selected cell are in the same row
 * @param currentCellCoordinate The CellLocation of current cell
 * @param selectedCellCoordinate The CellLocation of selected cell
 * @returns boolean that indicates if the current cell is in the same row as selected cell
 */
export function areCellsInSameRow(
  currentCellCoordinate: CellLocation,
  selectedCellCoordinate: CellLocation
) {
  return currentCellCoordinate.r === selectedCellCoordinate.r;
}

/**
 * Determines if the current cell and selected cell are in the same column
 * @param currentCellCoordinate The CellLocation of current cell
 * @param selectedCellCoordinate The CellLocation of selected cell
 * @returns boolean that indicates if the current cell is in the same column as selected cell
 */
export function areCellsInSameColumn(
  currentCellCoordinate: CellLocation,
  selectedCellCoordinate: CellLocation
) {
  return currentCellCoordinate.c === selectedCellCoordinate.c;
}

/**
 * Returns the string converted to a title format i.e. replaces _ with spaces and capitalizes only the first letter of each word
 * @param str - the string to convert
 * @returns the converted string
 */
export const toTitle = (str: string) => {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Wraps a number around a range so if the number is outside the range, it wraps around to the other side
 * @param number - the number to wrap
 * @param lowerBound - the lower bound of the range
 * @param upperBound - the upper bound of the range
 * @returns the number wrapped around the range
 */
export function wrapNumber(
  number: number,
  lowerBound: number,
  upperBound: number
): number {
  const range: number = upperBound - lowerBound + 1; // Calculate the total range
  return ((number + range) % range) + lowerBound; // Wrap around using modulo
}

/**
 * Wraps the digit around the range of 0-8
 * @param digit - the digit to wrap
 */
export function wrapDigit(digit: number): number {
  return wrapNumber(digit, 0, 8);
}
