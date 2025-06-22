import { BoardObjectProps } from "../../../../Functions/LocalDatabase";

export const headerRowTitle = (sudokuBoard: BoardObjectProps): string => {
  const difficulty = sudokuBoard.statistics.difficulty;
  return `Difficulty: ${difficulty}`;
};
