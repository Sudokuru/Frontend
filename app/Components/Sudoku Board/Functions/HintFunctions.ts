import { getHint } from "sudokuru";

export const getSudokuHint = () => {
  getHint();
};

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

const convertPuzzleSolutionToFrontendFormat = (puzzleSolution: string[][]) => {
  const convertedPuzzleSolution: number[][] = [];
  puzzleSolution.forEach(function (value, index) {
    convertedPuzzleSolution.push([]);
    convertedPuzzleSolution[index] = value.map(Number);
  });
  return convertedPuzzleSolution;
};

const convertPuzzleStateToSudokuruFormat = () => {};

const convertPuzzleStateToFrontendFormat = () => {};
