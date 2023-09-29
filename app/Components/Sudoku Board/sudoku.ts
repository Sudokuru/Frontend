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

export function makeBoard({ puzzle }, initialPuzzle) {
  const rows = Array.from(Array(9).keys()).map(() => makeCountObject());
  const columns = Array.from(Array(9).keys()).map(() => makeCountObject());
  const squares = Array.from(Array(9).keys()).map(() => makeCountObject());
  const initialPuzzleArray = initialPuzzle
    .match(/.{1,9}/g)
    .map((row) => row.split("").map(Number));
  const result = puzzle.map((row, i) =>
    row.map((cell, j) => {
      if (cell) {
        rows[i][cell] += 1;
        columns[j][cell] += 1;
        squares[Math.floor(i / 3) * 3 + Math.floor(j / 3)][cell] += 1;
      }
      return {
        value: puzzle[i][j] > 0 ? puzzle[i][j] : null,
        prefilled: !!initialPuzzleArray[j][i],
      };
    })
  );
  return fromJS({
    puzzle: result,
    selected: false,
    inNoteMode: false,
    inHintMode: false,
  });
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
