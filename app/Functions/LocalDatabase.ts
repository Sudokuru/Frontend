import { SudokuStrategy } from "sudokuru";
import { puzzle } from "../Api/Puzzle.Types";
import { GameDifficulty } from "../Components/SudokuBoard/Functions/Difficulty";

export interface Puzzle {
  p: string; // initial puzzle string
  s: string; // solution string
  d: number; // difficulty
}

/**
 * This function takes in a Puzzle object and returns a SudokuObjectProps object.
 * @param puzzle Puzzle object
 */
export const convertPuzzleToSudokuObject = (
  puzzle: Puzzle,
  difficulty: GameDifficulty
): SudokuObjectProps => {
  let game: SudokuObjectProps = {
    variant: "classic",
    version: "1.0.0",
    selectedCells: [],
    puzzle: [],
    puzzleSolution: [],
    statistics: {
      difficulty: difficulty,
      internalDifficulty: puzzle.d,
      numHintsUsed: 0,
      numHintsUsedPerStrategy: [],
      numWrongCellsPlayed: 0,
      score: 0,
      time: 0,
    },
    inNoteMode: false,
    actionHistory: [],
  };

  for (let i = 0; i < 9; i++) {
    game.puzzle.push([]);
    game.puzzleSolution.push([]);
    for (let j = 0; j < 9; j++) {
      let charValuePuzzle = puzzle.p.charAt(i * 9 + j);
      let numValuePuzzle = Number(charValuePuzzle);
      if (numValuePuzzle === 0) {
        game.puzzle[i][j] = { type: "value", entry: 0 };
      } else {
        game.puzzle[i][j] = { type: "given", entry: numValuePuzzle };
      }

      let charValueSolution = puzzle.s.charAt(i * 9 + j);
      let numValueSolution = Number(charValueSolution);
      game.puzzleSolution[i][j] = numValueSolution;
    }
  }
  // Return a clone here so that this is a clone.
  return JSON.parse(JSON.stringify(game));
};

export function returnLocalDrillGame(strategy: SudokuStrategy): puzzle {
  return JSON.parse("{}");
}

export interface SudokuObjectProps {
  variant: GameVariant;
  version: string;
  selectedCells: CellLocation[];
  statistics: GameStatistics;
  puzzle: CellProps[][];
  puzzleSolution: number[][];
  actionHistory: GameAction[][];
  inNoteMode: boolean;
}

export interface GameAction {
  cellLocation: CellLocation;
  cell: CellProps;
}

// todo remove erase, and just use 0 value to signify erase
// then can remove ActionType as a type needed
type ActionType = "note" | "value";

export interface CellLocation {
  r: number;
  c: number;
}

export interface GameStatistics {
  difficulty: GameDifficulty;
  internalDifficulty: number;
  time: number;
  score: number;
  numWrongCellsPlayed: number;
  numHintsUsed: number;
  numHintsUsedPerStrategy: {
    hintStrategy: SudokuStrategy;
    numHintsUsed: number;
  }[];
}

export type GameVariant = "demo" | "drill" | "classic";
export type CellProps = CellWithValue | CellWithNotes;

export interface CellWithValue {
  type: "value" | "given";
  entry: number;
}

export interface CellWithNotes {
  type: "note";
  entry: number[];
}

export type CellType = "note" | "value" | "given";

// This will be exported from Sudokuru package
interface Hint {
  hint: {
    strategy: any;
    cause: any;
    groups: any;
    placements: any;
    removals: any;
    info: string;
    action: string;
  };
}

const NAKED_SINGLE_DRILL_GAMES: SudokuObjectProps[] = [
  {
    variant: "classic",
    version: "1.0.0",
    selectedCells: [],
    puzzle: [
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 3,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 7,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 4,
        },
        {
          type: "value",
          entry: 0,
        },
      ],
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 6,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 2,
        },
        {
          type: "given",
          entry: 3,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 1,
        },
      ],
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 8,
        },
        {
          type: "given",
          entry: 9,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
      ],
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 1,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 7,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 8,
        },
        {
          type: "value",
          entry: 0,
        },
      ],
      [
        {
          type: "given",
          entry: 5,
        },
        {
          type: "given",
          entry: 1,
        },
        {
          type: "given",
          entry: 7,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 6,
        },
      ],
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 4,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
      ],
      [
        {
          type: "given",
          entry: 2,
        },
        {
          type: "given",
          entry: 7,
        },
        {
          type: "given",
          entry: 1,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 9,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 5,
        },
      ],
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 9,
        },
        {
          type: "given",
          entry: 5,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
      ],
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 2,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
      ],
    ],
    puzzleSolution: [
      [1, 2, 3, 6, 7, 5, 9, 4, 8],
      [4, 5, 6, 9, 8, 2, 3, 7, 1],
      [7, 8, 9, 3, 1, 4, 5, 6, 2],
      [9, 6, 4, 1, 5, 7, 2, 8, 3],
      [5, 1, 7, 2, 3, 8, 4, 9, 6],
      [8, 3, 2, 4, 9, 6, 1, 5, 7],
      [2, 7, 1, 8, 4, 9, 6, 3, 5],
      [3, 9, 5, 7, 6, 1, 8, 2, 4],
      [6, 4, 8, 5, 2, 3, 7, 1, 9],
    ],
    statistics: {
      difficulty: "novice",
      internalDifficulty: 0,
      numHintsUsed: 0,
      numHintsUsedPerStrategy: [],
      numWrongCellsPlayed: 0,
      score: 0,
      time: 0,
    },
    inNoteMode: false,
    actionHistory: [],
  },
];
