import {
  BoardObjectProps,
  CellProps,
  CellLocation,
} from "../../../../Functions/LocalDatabase";
import { HintObjectProps } from "../../SudokuBoard";
import { isBoardDisabled } from "../../SudokuBoardFunctions";
import { isValueCorrect } from "./BoardFunctions";

/**
 * Counts the total number of remaining playable cells for a given value.
 * @param value The value to look for.
 * @returns The number of cells found that match the value and are playable.
 */
export const getRemainingCellCountOfValue = (
  sudokuBoard: BoardObjectProps,
  value: number,
) => {
  let cellCountOfValue = 0;
  for (let r = 0; r < sudokuBoard.puzzleState.length; r++) {
    for (let c = 0; c < sudokuBoard.puzzleState[r].length; c++) {
      if (
        sudokuBoard.puzzleState[r][c].type === "note" ||
        sudokuBoard.puzzleState[r][c].entry === 0 ||
        doesCellHaveConflict(sudokuBoard, r, c)
      ) {
        if (sudokuBoard.puzzleSolution[r][c] === value) {
          cellCountOfValue++;
        }
      }
    }
  }
  return cellCountOfValue;
};

/**
 * Checks if the given cell is disabled from being updated.
 * A cell is disabled from being updated if it is a given cell or if it is a value cell with a correct value.
 * @param cell The cell to check.
 * @param r The row index of the cell.
 * @param c The column index of the cell.
 * @returns True if the cell is disabled from being updated, false otherwise.
 */
export const areCellUpdatesDisabled = (
  cell: CellProps,
  cellSolution: CellProps | number,
) => {
  if (cell.type === "given") {
    return true;
  } else if (typeof cellSolution === "object" && cellSolution.type === "note") {
    return false;
  } else if (
    cell.type === "value" &&
    isValueCorrect(cellSolution, cell.entry)
  ) {
    return true;
  } else {
    return false;
  }
};

export const getSelectedCells = (
  sudokuBoard: BoardObjectProps,
): CellProps[] => {
  if (sudokuBoard.selectedCells.length === 0) {
    return [];
  }
  const selectedCells: CellProps[] = [];
  for (const selectedCell of sudokuBoard.selectedCells) {
    selectedCells.push(sudokuBoard.puzzleState[selectedCell.r][selectedCell.c]);
  }
  return selectedCells;
};

/**
 * Toggles whether or not a cell is selected on click
 * event.ctrlKey, event.metaKey and event.shiftKey are from React Native Web, which does not export types that we can use
 * https://stackoverflow.com/questions/41648156/detect-if-shift-key-is-down-react-native
 * https://github.com/necolas/react-native-web/issues/1684
 * @param r The row of a given cell 0-8
 * @param c the column of a given cell 0-8
 * @param event GestureResponderEvent event type from react-native with additional options from react-native-web
 */
export const toggleSelectCell = (
  sudokuBoard: BoardObjectProps,
  setBoardSelectedCells: (cells: CellLocation[]) => void,
  sudokuHint: HintObjectProps | undefined,
  r: number,
  c: number,
  event: any,
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
  sudokuBoard: BoardObjectProps,
  r: number,
  c: number,
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
  sudokuBoard: BoardObjectProps,
  r: number,
  c: number,
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
  sudokuBoard: BoardObjectProps,
  r: number,
  c: number,
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

/**
 * Determines if the current cell and selected cell are in the same box
 * @param currentCellCoordinate The CellLocation of current cell
 * @param selectedCellCoordinate The CellLocation of selected cell
 * @returns boolean that indicates if current cell is in the same box as selected cell
 */
export function areCellsInSameBox(
  currentCellCoordinate: CellLocation,
  selectedCellCoordinate: CellLocation,
) {
  const currentBoxIndex = generateBoxIndex(
    currentCellCoordinate.r,
    currentCellCoordinate.c,
  );
  const selectedBoxIndex = generateBoxIndex(
    selectedCellCoordinate.r,
    selectedCellCoordinate.c,
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
  selectedCellCoordinate: CellLocation,
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
  selectedCellCoordinate: CellLocation,
) {
  return currentCellCoordinate.c === selectedCellCoordinate.c;
}

/**
 * Checks if a given cell in the puzzle has a conflict with the solution.
 *
 * @param r - The row index of the cell.
 * @param c - The column index of the cell.
 * @param cell - The cell object containing its type and entry.
 * @returns True if the cell's entry is incorrect; false otherwise.
 */
export const doesCellHaveConflict = (
  sudokuBoard: BoardObjectProps,
  r: number,
  c: number,
): boolean => {
  const cell = sudokuBoard.puzzleState[r][c];
  if (cell.type === "note" || cell.entry === 0) {
    return false;
  }
  return !(
    sudokuBoard.puzzleState[r][c].entry === sudokuBoard.puzzleSolution[r][c]
  );
};
