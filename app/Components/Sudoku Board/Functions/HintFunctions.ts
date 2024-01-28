import { getHint } from "sudokuru";
import { CellProps } from "../../../Functions/LocalDatabase";

export const getSudokuHint = () => {
  getHint();
};

/**
 * Conversion function to be used for retrieving hints from Sudokuru package.
 * Sudokuru package uses string[][] for solution, while Frontend uses number[][]
 * @param puzzleSolution Sudoku puzzle solution in Frontend format
 * @returns Sudoku puzzle solution in Sudokuru package format
 */
const convertPuzzleSolutionToSudokuruFormat = (
  puzzleSolution: number[][]
): string[][] => {
  const convertedPuzzleSolution: string[][] = [];
  puzzleSolution.forEach(function (value, index) {
    convertedPuzzleSolution.push([]);
    convertedPuzzleSolution[index] = value.map(String);
  });
  return convertedPuzzleSolution;
};

/**
 * Conversion function to be used for retrieving hints from Sudokuru package.
 * Sudokuru package uses two string[][] objects for representing notes and values.
 * @param puzzle Sudoku puzzle notes and values in Frontend format
 * @returns
 */
const convertPuzzleStateToSudokuruFormat = (puzzle: CellProps[][]) => {
  const convertedPuzzleValues = [];
  const convertedPuzzleNotes = [];
  for (let r = 0; r < puzzle.length; r++) {
    for (let c = 0; c < puzzle[r].length; c++) {
      let notes = [];
      let values = [];
      if (puzzle[r][c].type === "note") {
      } else {
      }
    }
  }
};
