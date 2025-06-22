import { SudokuObjectProps } from "../../../../Functions/LocalDatabase";

export const headerRowTitle = (sudokuBoard: SudokuObjectProps): string => {
  const difficulty = sudokuBoard.statistics.difficulty;
  return `Difficulty: ${difficulty}`;
};
