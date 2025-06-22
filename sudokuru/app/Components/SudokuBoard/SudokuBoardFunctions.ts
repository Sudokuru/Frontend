import { SudokuObjectProps } from "../../Functions/LocalDatabase";
import { isValueCorrect } from "./Core/Functions/BoardFunctions";
import { HintObjectProps } from "./SudokuBoard";

/**
 * Determines if the game has been solved by iterating through the
 * puzzle board and checking if the values entered in the cells are
 * correct. If any cells are incorrect, or if any cells have notes or
 * are empty, the function returns false. If all cells are correct and
 * the game has been solved, the function returns true.
 * @returns {boolean} True if the game has been solved, false otherwise.
 */
export const isGameSolved = (sudokuBoard: SudokuObjectProps): boolean => {
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
 * Determines if there are any incorrect values in the board
 * @returns True if there are no correct values in board, False otherwise
 */
export const doesBoardHaveConflict = (
  sudokuBoard: SudokuObjectProps,
  doesCellHaveConflict: (
    sudokuBoard: SudokuObjectProps,
    r: number,
    c: number,
  ) => boolean,
): boolean => {
  for (let r = 0; r < sudokuBoard.puzzle.length; r++) {
    for (let c = 0; c < sudokuBoard.puzzle[r].length; c++) {
      if (sudokuBoard.puzzle[r][c].type === "given") continue;
      const isCellIncorrect = doesCellHaveConflict(sudokuBoard, r, c);
      if (isCellIncorrect === true) {
        return true;
      }
    }
  }
  return false;
};

export const isBoardDisabled = (sudokuHint: HintObjectProps | undefined) => {
  if (sudokuHint != null) {
    return true;
  } else {
    return false;
  }
};

// todo remove, used in NumberControl.tsx
export function range(n: number) {
  return Array.from(Array(n).keys());
}

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
  upperBound: number,
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
