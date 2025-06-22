import { GameDifficulty } from "../Components/SudokuBoard/Core/Functions/DifficultyFunctions";
import { SUDOKU_STRATEGY_ARRAY, SudokuStrategy } from "sudokuru";
import { z } from "zod";

export interface InputPuzzle {
  p: string; // initial puzzle string
  s: string; // solution string
  d: number; // difficulty
}

export interface DrillObjectProps extends SudokuObjectProps<"drill"> {
  variant: "drill";
  version: number;
  selectedCells: CellLocation[];
  statistics: GameStatistics;
  puzzleInitialState: CellProps[][];
  puzzleState: CellProps[][];
  puzzleSolution: CellProps[][];
  actionHistory: GameAction[][];
  inNoteMode: boolean;
}

export interface ClassicObjectProps extends SudokuObjectProps<"classic"> {
  variant: "classic";
  version: number;
  selectedCells: CellLocation[];
  statistics: GameStatistics;
  puzzleState: CellProps[][];
  puzzleSolution: number[][];
  actionHistory: GameAction[][];
  inNoteMode: boolean;
}

// Shared properties between all boards
export interface SudokuObjectProps<T extends GameVariant> {
  readonly variant: T;
}

export type BoardObjectProps = DrillObjectProps | ClassicObjectProps;

// export interface SudokuObjectProps {
//   variant: GameVariant;
//   version: number;
//   selectedCells: CellLocation[];
//   statistics: GameStatistics;
//   puzzleState: CellProps[][];
//   puzzleSolution: number[][];
//   actionHistory: GameAction[][];
//   inNoteMode: boolean;
// }

export interface GameAction {
  cellLocation: CellLocation;
  cell: CellProps;
}

// todo remove erase, and just use 0 value to signify erase
// then can remove ActionType as a type needed
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      Object.values(SUDOKU_DIFFICULTIES) as [string, ...string[]],
    ),
    internalDifficulty: z.number().int().finite().safe(),
    numHintsUsed: z.number().int().nonnegative().finite().safe(),
    numHintsUsedPerStrategy: z.array(
      z.object({
        hintStrategy: z.enum(
          Object.values(SUDOKU_STRATEGY_ARRAY) as [string, ...string[]],
        ),
        numHintsUsed: z.number().int().nonnegative().finite().safe(),
      }),
    ),
    numWrongCellsPlayed: z.number().int().nonnegative().finite().safe(),
    score: z.number().int().gte(0).lte(100),
    time: z.number().int().nonnegative().finite().safe(),
  }),
  puzzleState: z.array(z.array(SudokuBoardCellSchema).length(9)).length(9),
  puzzleSolution: z
    .array(z.array(z.number().int().gte(1).lte(9)).length(9))
    .length(9),
  actionHistory: z.array(
    z.array(
      z.object({
        cellLocation: SudokuBoardCellLocationSchema,
        cell: SudokuBoardCellSchema,
      }),
    ),
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
  progressIndicator: z.boolean(),
  previewMode: z.boolean(),
  initializeNotes: z.boolean(),
  simplifyNotes: z.boolean(),
  strategyHintOrder: z.array(
    z.enum(Object.values(SUDOKU_STRATEGY_ARRAY) as [string, ...string[]]),
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
        Object.values(SUDOKU_STRATEGY_ARRAY) as [string, ...string[]],
      ),
      numHintsUsed: z.number().int().nonnegative().finite().safe(),
    }),
  ),
  numWrongCellsPlayed: z.number().int().nonnegative().finite().safe(),
});
