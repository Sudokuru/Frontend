import {
  BoardObjectProps,
  ClassicObjectProps,
} from "../../../../Functions/LocalDatabase";

export const headerRowTitle = (sudokuBoard: BoardObjectProps): string => {
  const difficulty = sudokuBoard.statistics.difficulty;
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
};

export const headerRowHintCount = (sudokuBoard: ClassicObjectProps): string => {
  return `${sudokuBoard.statistics.numHintsUsed}`;
};
