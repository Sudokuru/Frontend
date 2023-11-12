// @ts-nocheck
import { fromJS } from "immutable";

export function range(n) {
  return Array.from(Array(n).keys());
}

export function makeCountObject() {
  const countObj = [];
  for (let i = 0; i < 10; i += 1) countObj.push(0);
  return countObj;
}

/**
 *
 * @param a
 * @param b
 * @returns {boolean}
 */
export function isPeer(a, b) {
  if (!a || !b) return false;
  const squareA = Math.floor(a.x / 3) * 3 + Math.floor(a.y / 3);
  const squareB = Math.floor(b.x / 3) * 3 + Math.floor(b.y / 3);
  return a.x === b.x || a.y === b.y || squareA === squareB;
}

export function highlightBox(a, b) {
  const squareA = Math.floor(a.x / 3) * 3 + Math.floor(a.y / 3);
  const squareB = Math.floor(b.x / 3) * 3 + Math.floor(b.y / 3);
  return squareA === squareB;
}

export function highlightRow(a, b) {
  return a.y === b.y;
}

export function highlightColumn(a, b) {
  return a.x === b.x;
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
