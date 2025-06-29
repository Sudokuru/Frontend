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
  if (
    isEqual(
      sudokuBoard.puzzleState[r][c].entry,
      sudokuBoard.puzzleSolution[r][c].entry,
    )
  ) {
    return false;
  }

  if (
    isEqual(
      sudokuBoard.puzzleState[r][c].entry,
      sudokuBoard.initialPuzzleState[r][c].entry,
    )
  ) {
    return false;
  }

  if (
    sudokuBoard.puzzleState[r][c].type === "note" &&
    sudokuBoard.puzzleSolution[r][c].type === "note" &&
    sudokuBoard.initialPuzzleState[r][c].type === "note"
  ) {
    for (const note of sudokuBoard.puzzleState[r][c].entry) {
      if (
        !(
          note in sudokuBoard.puzzleSolution[r][c].entry ||
          note in sudokuBoard.initialPuzzleState[r][c].entry
        )
      ) {
        return true;
      }
    }
  }

  // we shouldn't reach this case
  // todo refactor this function so that we don't need this fallback
  return false;
};

const isEqual = (a: any, b: any) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
};
