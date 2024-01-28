import { getHint } from "sudokuru";

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

const convertPuzzleStateToSudokuruFormat = () => {};
