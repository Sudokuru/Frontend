import { GameDifficulty } from "../Components/SudokuBoard/Functions/Difficulty";
import { SUDOKU_STRATEGY_ARRAY, SudokuStrategy } from "sudokuru";
import { z } from "zod";

export interface InputPuzzle {
  p: string; // initial puzzle string
  s: string; // solution string
  d: number; // difficulty
}

/**
 * This function takes in a Puzzle object and returns a SudokuObjectProps object.
 * @param puzzle Puzzle object
 */
export const convertPuzzleToSudokuObject = (
  puzzle: InputPuzzle,
  difficulty: GameDifficulty
): SudokuObjectProps => {
  let game: SudokuObjectProps = {
    variant: "classic",
    version: 1,
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

export interface SudokuObjectProps {
  variant: GameVariant;
  version: number;
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

export const SUDOKU_GAME_VARIANTS = ["demo", "drill", "classic"];

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

export const SUDOKU_CELL_TYPES: CellType[] = ["note", "value", "given"];

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

const SUDOKU_DIFFICULTIES: GameDifficulty[] = [
  "novice",
  "amateur",
  "layman",
  "trainee",
  "protege",
  "professional",
  "pundit",
  "master",
  "grandmaster",
];

const SudokuBoardCellSchema = z.union([
  z.object({
    type: z.literal("given"),
    entry: z.number().int().gte(1).lte(9),
  }),
  z.object({
    type: z.literal("value"),
    entry: z.number().int().gte(0).lte(9),
  }),
  z.object({
    type: z.literal("note"),
    entry: z.array(z.number().int().gte(1).lte(9)),
  }),
]);

const SudokuBoardCellLocationSchema = z.object({
  r: z.number().int().gte(0).lte(8),
  c: z.number().int().gte(0).lte(8),
});

// https://github.com/colinhacks/zod/discussions/3115 for workaround used
// todo make custom schemas perhaps?
export const SudokuBoardSchema = z.object({
  variant: z.enum(Object.values(SUDOKU_GAME_VARIANTS) as [string, ...string[]]),
  version: z.literal(1),
  selectedCells: z.array(SudokuBoardCellLocationSchema),
  statistics: z.object({
    difficulty: z.enum(
      Object.values(SUDOKU_DIFFICULTIES) as [string, ...string[]]
    ),
    internalDifficulty: z.number().int().finite().safe(),
    numHintsUsed: z.number().int().nonnegative().finite().safe(),
    numHintsUsedPerStrategy: z.array(
      z.object({
        hintStrategy: z.enum(
          Object.values(SUDOKU_STRATEGY_ARRAY) as [string, ...string[]]
        ),
        numHintsUsed: z.number().int().nonnegative().finite().safe(),
      })
    ),
    numWrongCellsPlayed: z.number().int().nonnegative().finite().safe(),
    score: z.number().int().gte(0).lte(100),
    time: z.number().int().nonnegative().finite().safe(),
  }),
  puzzle: z.array(z.array(SudokuBoardCellSchema).length(9)).length(9),
  puzzleSolution: z
    .array(z.array(z.number().int().gte(1).lte(9)).length(9))
    .length(9),
  actionHistory: z.array(
    z.array(
      z.object({
        cellLocation: SudokuBoardCellLocationSchema,
        cell: SudokuBoardCellSchema,
      })
    )
  ),
  inNoteMode: z.boolean(),
});

export const SudokuBoardActiveGameSchema = z.array(SudokuBoardSchema);

export const ProfileSchema = z.object({
  version: z.literal(1),
  theme: z.boolean(),
  highlightBox: z.boolean(),
  highlightColumn: z.boolean(),
  highlightRow: z.boolean(),
  highlightIdenticalValues: z.boolean(),
  progressionIndicator: z.boolean(),
  previewMode: z.boolean(),
  strategyHintOrder: z.array(
    z.enum(Object.values(SUDOKU_STRATEGY_ARRAY) as [string, ...string[]])
  ),
});

export const StatisticsSchema = z.object({
  totalScore: z.number().int().nonnegative().finite().safe(),
  numGamesPlayed: z.number().int().nonnegative().finite().safe(),
  fastestSolveTime: z.number().int().nonnegative().finite().safe(),
  averageSolveTime: z.number().int().nonnegative().finite().safe(),
  totalSolveTime: z.number().int().nonnegative().finite().safe(),
  numHintsUsed: z.number().int().nonnegative().finite().safe(),
  numHintsUsedPerStrategy: z.array(
    z.object({
      hintStrategy: z.enum(
        Object.values(SUDOKU_STRATEGY_ARRAY) as [string, ...string[]]
      ),
      numHintsUsed: z.number().int().nonnegative().finite().safe(),
    })
  ),
  numWrongCellsPlayed: z.number().int().nonnegative().finite().safe(),
});
