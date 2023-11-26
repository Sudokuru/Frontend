import { CellLocation } from "../../Functions/LocalStore/DataStore/LocalDatabase";

// todo remove, used in NumberControl.tsx
export function range(n: number) {
  return Array.from(Array(n).keys());
}

/**
 *
 * @param a
 * @param b
 * @returns {boolean}
 */
export function isPeer(
  selectedCellCoordinate: CellLocation,
  currentCellCoordinate: CellLocation
) {
  const squareA =
    Math.floor(selectedCellCoordinate.r / 3) * 3 +
    Math.floor(selectedCellCoordinate.c / 3);
  const squareB =
    Math.floor(currentCellCoordinate.r / 3) * 3 +
    Math.floor(currentCellCoordinate.c / 3);
  return (
    selectedCellCoordinate.r === currentCellCoordinate.r ||
    selectedCellCoordinate.c === currentCellCoordinate.c ||
    squareA === squareB
  );
}

export function highlightBox(
  currentCellCoordinate: CellLocation,
  selectedCellCoordinate: CellLocation
) {
  const squareA =
    Math.floor(currentCellCoordinate.c / 3) * 3 +
    Math.floor(currentCellCoordinate.r / 3);
  const squareB =
    Math.floor(selectedCellCoordinate.c / 3) * 3 +
    Math.floor(selectedCellCoordinate.r / 3);
  return squareA === squareB;
}

export function highlightRow(
  currentCellCoordinate: CellLocation,
  selectedCellCoordinate: CellLocation
) {
  return currentCellCoordinate.r === selectedCellCoordinate.r;
}

export function highlightColumn(
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
