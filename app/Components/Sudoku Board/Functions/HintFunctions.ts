import { getHint } from "sudokuru";
import { CellProps } from "../../../Functions/LocalDatabase";

export const getSudokuHint = (puzzle: CellProps[][], solution: number[][]) => {
  console.log("HELLO");
  const puzzleState = convertPuzzleStateToSudokuruFormat(puzzle);
  const puzzleSolution = convertPuzzleSolutionToSudokuruFormat(solution);
  console.log("DEBUG", puzzleState);
  console.log("DEBUG", puzzleSolution);
  const hint = getHint(
    puzzleState.puzzleValues,
    puzzleState.puzzleNotes,
    undefined,
    puzzleSolution
  );
  console.log("DEBUG", hint);
  return hint;
};

/**
 * Conversion function to be used for retrieving hints from Sudokuru package.
 * Sudokuru package uses string[][] for solution, while Frontend uses number[][]
 * @param puzzleSolution Sudoku puzzle solution in Frontend format
 * @returns Sudoku puzzle solution in Sudokuru package format
 */
const convertPuzzleSolutionToSudokuruFormat = (
  puzzleSolution: number[][]
): string[][] => {
  const convertedPuzzleSolution: string[][] = [];
  puzzleSolution.forEach(function (value, index) {
    convertedPuzzleSolution.push([]);
    convertedPuzzleSolution[index] = value.map(String);
  });
  return convertedPuzzleSolution;
};

/**
 * Conversion function to be used for retrieving hints from Sudokuru package.
 * Sudokuru package uses two string[][] objects for representing notes and values.
 * @param puzzle Sudoku puzzle notes and values in Frontend format
 * @returns
 */
const convertPuzzleStateToSudokuruFormat = (puzzle: CellProps[][]) => {
  const convertedPuzzleValues: string[][] = [];
  const convertedPuzzleNotes: string[][] = [];
  for (let r = 0; r < puzzle.length; r++) {
    convertedPuzzleValues.push([]);
    for (let c = 0; c < puzzle[r].length; c++) {
      convertedPuzzleNotes.push([]);
      let value: string = "0";
      if (puzzle[r][c].type === "note") {
        const entry = puzzle[r][c].entry as number[];
        for (let n = 0; n < entry.length; n++) {
          convertedPuzzleNotes[c + r * puzzle.length].push(entry[n].toString());
        }
      } else {
        const entry = puzzle[r][c].entry as number;
        value = entry.toString();
      }

      convertedPuzzleValues[r].push(value);
    }
  }
  return {
    puzzleValues: convertedPuzzleValues,
    puzzleNotes: convertedPuzzleNotes,
  };
};
