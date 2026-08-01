import { toTitle } from "./../../../../Functions/Utils";
import { DrillObjectProps } from "../../../../Functions/LocalDatabase";

export const headerRowTitle = (sudokuBoard: DrillObjectProps): string => {
  return toTitle(sudokuBoard.statistics.difficulty);
};

export const headerRowHintCount = (sudokuBoard: DrillObjectProps): string => {
  return sudokuBoard.statistics.hintUsed ? "1" : "0";
};
