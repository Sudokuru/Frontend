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
    let foundInvalidNote = false;

    for (const note of sudokuBoard.puzzleState[r][c].entry) {
      const inSolution = sudokuBoard.puzzleSolution[r][c].entry.includes(note);
      const inInitial =
        sudokuBoard.initialPuzzleState[r][c].entry.includes(note);

      if (!inSolution && !inInitial) {
        console.log(!inSolution, !inInitial);
        foundInvalidNote = true;
        break;
      }
    }

    for (const note of sudokuBoard.puzzleSolution[r][c].entry) {
      if (!sudokuBoard.puzzleState[r][c].entry.includes(note)) {
        foundInvalidNote = true;
        break;
      }
    }

    return foundInvalidNote;
  }

  console.log("FALLBACK");
  return true;
};

export const isEqual = (a: any, b: any) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
};
