import {
  BoardObjectProps,
  CellLocation,
} from "../../../Functions/LocalDatabase";
import { wrapDigit } from "../SudokuBoardFunctions";

type IsCellExposed = (r: number, c: number) => boolean;

const nearestExposedCell = (
  origin: CellLocation,
  isExposed: IsCellExposed,
): CellLocation => {
  let nearest = origin;
  let shortestDistance = Infinity;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const distance = Math.abs(origin.r - r) + Math.abs(origin.c - c);
      if (isExposed(r, c) && distance < shortestDistance) {
        nearest = { r, c };
        shortestDistance = distance;
      }
    }
  }
  return nearest;
};

const uniqueCells = (cells: CellLocation[]): CellLocation[] =>
  cells.filter(
    (cell, index) =>
      cells.findIndex((other) => other.r === cell.r && other.c === cell.c) ===
      index,
  );

/** Preserve ordinary directional movement and wrapping, but never enter a masked cell. */
export const navigateFocusCells = (
  board: BoardObjectProps,
  direction: CellLocation,
  isExposed: IsCellExposed,
): CellLocation[] =>
  uniqueCells(
    board.selectedCells.map((origin) => {
      if (!isExposed(origin.r, origin.c))
        return nearestExposedCell(origin, isExposed);
      for (let offset = 1; offset <= 9; offset++) {
        const cell = {
          r: wrapDigit(origin.r + direction.r * offset),
          c: wrapDigit(origin.c + direction.c * offset),
        };
        if (isExposed(cell.r, cell.c)) return cell;
      }
      return origin;
    }),
  );

/** Keep the cursor on the board's exposed cells after a region change or undo. */
export const keepFocusSelectionExposed = (
  board: BoardObjectProps,
  isExposed: IsCellExposed,
): BoardObjectProps => ({
  ...board,
  selectedCells: uniqueCells(
    board.selectedCells.map((cell) =>
      isExposed(cell.r, cell.c) ? cell : nearestExposedCell(cell, isExposed),
    ),
  ),
});
