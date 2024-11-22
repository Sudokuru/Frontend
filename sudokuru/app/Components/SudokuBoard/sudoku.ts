import { CellLocation } from "../../Functions/LocalDatabase";

// todo remove, used in NumberControl.tsx
export function range(n: number) {
  return Array.from(Array(n).keys());
}

/**
 * Determines if the current cell and selected cell are in the same box
 * @param currentCellCoordinate The CellLocation of current cell
 * @param selectedCellCoordinate The CellLocation of selected cell
 * @returns boolean that indicates if current cell is in the same box as selected cell
 */
export function areCellsInSameBox(
  currentCellCoordinate: CellLocation,
  selectedCellCoordinate: CellLocation
) {
  const currentBoxIndex = generateBoxIndex(
    currentCellCoordinate.r,
    currentCellCoordinate.c
  );
  const selectedBoxIndex = generateBoxIndex(
    selectedCellCoordinate.r,
    selectedCellCoordinate.c
  );
  return currentBoxIndex === selectedBoxIndex;
}

/**
 * Generates a unique index for a box given the box's row and column
 * @param row number 0-8 of the cell
 * @param column number 0-8 of the cell
 */
export function generateBoxIndex(row: number, column: number): number {
  return Math.floor(column / 3) + Math.floor(row / 3) * 3;
}

/**
 * Determines if the current cell and selected cell are in the same row
 * @param currentCellCoordinate The CellLocation of current cell
 * @param selectedCellCoordinate The CellLocation of selected cell
 * @returns boolean that indicates if the current cell is in the same row as selected cell
 */
export function areCellsInSameRow(
  currentCellCoordinate: CellLocation,
  selectedCellCoordinate: CellLocation
) {
  return currentCellCoordinate.r === selectedCellCoordinate.r;
}

/**
 * Determines if the current cell and selected cell are in the same column
 * @param currentCellCoordinate The CellLocation of current cell
 * @param selectedCellCoordinate The CellLocation of selected cell
 * @returns boolean that indicates if the current cell is in the same column as selected cell
 */
export function areCellsInSameColumn(
  currentCellCoordinate: CellLocation,
  selectedCellCoordinate: CellLocation
) {
  return currentCellCoordinate.c === selectedCellCoordinate.c;
}

/**
 * Returns the string converted to a title format i.e. replaces _ with spaces and capitalizes only the first letter of each word
 * @param str - the string to convert
 * @returns the converted string
 */
export const toTitle = (str: string) => {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Wraps a number around a range so if the number is outside the range, it wraps around to the other side
 * @param number - the number to wrap
 * @param lowerBound - the lower bound of the range
 * @param upperBound - the upper bound of the range
 * @returns the number wrapped around the range
 */
export function wrapNumber(
  number: number,
  lowerBound: number,
  upperBound: number
): number {
  const range: number = upperBound - lowerBound + 1; // Calculate the total range
  return ((number + range) % range) + lowerBound; // Wrap around using modulo
}

/**
 * Wraps the digit around the range of 0-8
 * @param digit - the digit to wrap
 */
export function wrapDigit(digit: number): number {
  return wrapNumber(digit, 0, 8);
}
