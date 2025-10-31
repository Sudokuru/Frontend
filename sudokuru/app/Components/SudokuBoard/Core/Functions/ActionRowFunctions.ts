import {
  CellProps,
  BoardObjectProps,
  ClassicObjectProps,
} from "../../../../Functions/LocalDatabase";
import { isValueCorrect } from "./BoardFunctions";
import { getSelectedCells } from "./CellFunctions";

/**
 * @returns true if the erase button should be disabled, false otherwise.
 * The erase button is disabled if either:
 * 1. No cells are selected.
 * 2. All selected cells are either given, empty, or correct.
 */
export const isEraseButtonDisabled = (sudokuBoard: BoardObjectProps) => {
  const currentSelectedCells: CellProps[] = getSelectedCells(sudokuBoard);
  if (sudokuBoard.selectedCells.length === 0) {
    return true;
  }
  for (let i = 0; i < currentSelectedCells.length; i++) {
    const isCellGiven = currentSelectedCells[i].type === "given";
    const isCellEmpty =
      currentSelectedCells[i].type === "value" &&
      currentSelectedCells[i].entry === 0;
    const isCellCorrect =
      currentSelectedCells[i].type === "value" &&
      isValueCorrect(
        sudokuBoard.puzzleSolution[sudokuBoard.selectedCells[i].r][
          sudokuBoard.selectedCells[i].c
        ],
        currentSelectedCells[i].entry as number,
      );
    // disable erase button if value === 0 or is given
    if (!isCellGiven && !isCellEmpty && !isCellCorrect) {
      return false;
    }
  }
  return true;
};
