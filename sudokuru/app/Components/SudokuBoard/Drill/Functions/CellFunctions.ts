import { DrillObjectProps } from "../../../../Functions/LocalDatabase";

/**
 * Checks if a given cell in the puzzle has a conflict with the solution.
 *
 * @param r - The row index of the cell.
 * @param c - The column index of the cell.
 * @param cell - The cell object containing its type and entry.
 * @returns True if the cell's entry is incorrect; false otherwise.
 */
export const doesCellHaveConflict = (
  sudokuBoard: DrillObjectProps,
  r: number,
  c: number,
): boolean => {
  // todo there is an issue with this, will immediately show the user what cell is incorrect
  // todo need to do some sort of check to see if its not equal the initial state or the solution
  return !isEqual(
    sudokuBoard.puzzleState[r][c].entry,
    sudokuBoard.puzzleSolution[r][c].entry,
  );
};

const isEqual = (a: any, b: any) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
};
