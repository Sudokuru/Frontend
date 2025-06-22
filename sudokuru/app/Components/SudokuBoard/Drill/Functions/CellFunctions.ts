import { SudokuObjectProps } from "../../../../Functions/LocalDatabase";

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
  c: number,
): boolean => {
  return !(sudokuBoard.puzzle[r][c].entry === sudokuBoard.puzzleSolution[r][c]);
};
