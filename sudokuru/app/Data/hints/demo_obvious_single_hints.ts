/**
 * Self-contained obvious-single hint demo fixture for quick Frontend testing.
 *
 * This file intentionally imports nothing. Copy/paste it into a Frontend repo,
 * stub getHint() to return the exported hint, and load the puzzle state below.
 */

export type SudokuValue = number;

export type CellLocation = {
  r: number;
  c: number;
};

export type CellWithValue = {
  type: "given" | "value";
  value: SudokuValue;
};

export type CellWithNotes = {
  type: "note";
  notes: SudokuValue[];
};

export type CellProps = CellWithValue | CellWithNotes;
export type ValueCellWithLocation = CellWithValue & CellLocation;
export type NoteCellWithLocation = CellWithNotes & CellLocation;

export type HighlightType = "removal" | "placement" | "focus" | "basis";

export type HighlightedCell = {
  location: CellLocation;
  highlightType: HighlightType;
};

export type HighlightedValue = {
  location: CellLocation;
  highlightType: HighlightType;
};

export type HighlightedNote = {
  location: CellLocation;
  value: SudokuValue;
  highlightType: HighlightType;
};

export type HintStage = {
  removeValues?: ValueCellWithLocation[];
  removeNotes?: NoteCellWithLocation[];
  placeValues?: ValueCellWithLocation[];
  placeNotes?: NoteCellWithLocation[];
  highlightCells?: HighlightedCell[];
  highlightValues?: HighlightedValue[];
  highlightNotes?: HighlightedNote[];
  text?: string;
};

export type ObviousSingleHint = {
  strategy: "OBVIOUS_SINGLE";
  stages: HintStage[];
};

export type ObviousSingleDemoCase = {
  id: "single-obvious-single";
  label: string;
  puzzle: CellProps[][];
  solution: SudokuValue[][];
  hint: ObviousSingleHint;
};

const SOURCE_PUZZLE_NUMBERS: SudokuValue[][] = [
  [4, 3, 9, 2, 7, 5, 6, 1, 8],
  [0, 5, 1, 8, 9, 6, 4, 3, 7],
  [8, 7, 6, 1, 4, 3, 5, 9, 2],
  [3, 4, 2, 6, 8, 7, 9, 5, 1],
  [1, 8, 5, 3, 2, 9, 7, 4, 6],
  [6, 9, 7, 4, 5, 1, 2, 8, 3],
  [9, 2, 8, 7, 3, 4, 1, 6, 5],
  [5, 6, 3, 9, 1, 2, 8, 7, 4],
  [7, 1, 4, 5, 6, 8, 3, 2, 9],
];

const obviousSingleNoteCell: NoteCellWithLocation = {
  r: 1,
  c: 0,
  type: "note",
  notes: [2],
};

const obviousSingleValueCell: ValueCellWithLocation = {
  r: 1,
  c: 0,
  type: "value",
  value: 2,
};

function numbersToPuzzleWithTargetNotes(
  numbers: SudokuValue[][],
  target: NoteCellWithLocation,
): CellProps[][] {
  return numbers.map((row, r) =>
    row.map((value, c): CellProps => {
      if (r === target.r && c === target.c) {
        return { type: "note", notes: [...target.notes] };
      }

      if (value === 0) {
        return { type: "note", notes: [] };
      }

      return { type: "given", value };
    }),
  );
}

export const obviousSinglePuzzle: CellProps[][] =
  numbersToPuzzleWithTargetNotes(SOURCE_PUZZLE_NUMBERS, obviousSingleNoteCell);

export const obviousSinglePuzzleSolution: SudokuValue[][] =
  SOURCE_PUZZLE_NUMBERS.map((row) =>
    row.map((value) => value || obviousSingleValueCell.value),
  );

export const obviousSingleHint: ObviousSingleHint = {
  strategy: "OBVIOUS_SINGLE",
  stages: [
    {
      text: "An obvious single is a cell with only one note remaining.",
    },
    {
      highlightCells: [
        { location: obviousSingleNoteCell, highlightType: "focus" },
      ],
      text: "Row 2, column 1 has only one note remaining: 2.",
    },
    {
      placeValues: [obviousSingleValueCell],
      highlightCells: [
        { location: obviousSingleValueCell, highlightType: "placement" },
      ],
      text: "Place 2 in row 2, column 1.",
    },
  ],
};

export const obviousSingleDemoCases: ObviousSingleDemoCase[] = [
  {
    id: "single-obvious-single",
    label: "Obvious single",
    puzzle: obviousSinglePuzzle,
    solution: obviousSinglePuzzleSolution,
    hint: obviousSingleHint,
  },
];

export function getObviousSingleDemoCase(
  id: ObviousSingleDemoCase["id"],
): ObviousSingleDemoCase {
  const demoCase = obviousSingleDemoCases.find(
    (candidate) => candidate.id === id,
  );

  if (!demoCase) {
    throw new Error(`Unknown obvious single demo case: ${id}`);
  }

  return demoCase;
}
