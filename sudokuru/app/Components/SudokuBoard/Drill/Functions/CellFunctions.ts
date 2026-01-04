import {
  CellProps,
  DrillObjectProps,
} from "../../../../Functions/LocalDatabase";

/**
 * Checks if a given cell in the puzzle has a conflict with the solution.
 *
 * @param sudokuBoard - The current state of the sudoku board.
 * @param r - The row index of the cell.
 * @param c - The column index of the cell.
 * @returns True if the cell's entry is incorrect; false otherwise.
 */
export const doesCellHaveConflict = (
  sudokuBoard: DrillObjectProps,
  r: number,
  c: number,
): boolean => {
  const state = sudokuBoard.puzzleState[r][c];
  const solution = sudokuBoard.puzzleSolution[r][c];
  const inititial = sudokuBoard.initialPuzzleState[r][c];

  if (isEqual(state.entry, solution.entry)) {
    return false;
  }

  if (isEqual(state.entry, inititial.entry)) {
    return false;
  }

  if (
    state.type === "note" &&
    solution.type === "note" &&
    inititial.type === "note"
  ) {
    let foundInvalidNote = false;

    // current note is not in solution or initial puzzle state
    for (const note of state.entry) {
      const inSolution = solution.entry.includes(note);
      const inInitial = inititial.entry.includes(note);

      if (!inSolution && !inInitial) {
        foundInvalidNote = true;
        break;
      }
    }

    // solution note has been removed from current notes
    for (const note of solution.entry) {
      if (!state.entry.includes(note)) {
        foundInvalidNote = true;
        break;
      }
    }

    return foundInvalidNote;
  }

  return true;
};

/**
 * Determines if the move made in the sudoku board is correct by comparing the current entry to the solution
 *
 * @param sudokuBoard - The current state of the sudoku board.
 * @param r - The row index of the cell.
 * @param c - The column index of the cell.
 * @param currentEntry - The current entry of the cell.
 * @returns true if the move is correct, false otherwise
 */
export const isMoveCorrect = (
  sudokuBoard: DrillObjectProps,
  r: number,
  c: number,
  currentEntry: CellProps,
): boolean => {
  if (sudokuBoard.puzzleState[r][c].type === "value") {
    return !doesCellHaveConflict(sudokuBoard, r, c);
  }

  // compare notes before and after the action
  const oldNotes = Array.isArray(currentEntry.entry) ? currentEntry.entry : [];
  const newNotes = Array.isArray(sudokuBoard.puzzleState[r][c].entry)
    ? sudokuBoard.puzzleState[r][c].entry
    : [];
  const solutionNotes = Array.isArray(sudokuBoard.puzzleSolution[r][c].entry)
    ? sudokuBoard.puzzleSolution[r][c].entry
    : [];

  // determine action: added or removed notes
  const added = newNotes.filter((n) => !oldNotes.includes(n));
  const removed = oldNotes.filter((n) => !newNotes.includes(n));

  // if added notes are in solution, move is correct
  for (const note of added) {
    if (!solutionNotes.includes(note)) {
      return false; // added invalid note
    }
  }

  // if removed notes are from solution, move is incorrect
  for (const note of removed) {
    if (solutionNotes.includes(note)) {
      return false; // removed valid note
    }
  }

  return true;
};

export const isEqual = (a: any, b: any) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
};
