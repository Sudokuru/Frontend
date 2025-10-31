import { toTitle } from "./../../../../Functions/Utils";
import { DrillObjectProps } from "../../../../Functions/LocalDatabase";

export const headerRowTitle = (sudokuBoard: DrillObjectProps): string => {
  return `Drill: ${toTitle(sudokuBoard.statistics.difficulty)}`;
};
