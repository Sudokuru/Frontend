import {
  GAME_DIFFICULTIES,
  GameDifficulty,
} from "../Components/SudokuBoard/Core/Functions/DifficultyFunctions";
import { SUDOKU_STRATEGY_ARRAY, SudokuStrategy } from "sudokuru";
import { z } from "zod";
import { ThemeName, ThemeNames } from "../Styling/theme";

export interface DrillObjectProps extends SudokuObjectProps<"drill"> {
  variant: "drill";
  version: number;
  activeHint: ActiveHintState | null;
  selectedCells: CellLocation[];
  statistics: DrillGameStatistics;
  initialPuzzleState: CellProps[][];
  puzzleState: CellProps[][];
  puzzleSolution: CellProps[][];
  actionHistory: GameAction[][];
  inNoteMode: boolean;
}

export interface DrillGameStatistics {
  difficulty: SudokuStrategy;
  time: number;
  numWrongCellsPlayed: number;
  hintUsed: boolean;
}

export interface ClassicObjectProps extends SudokuObjectProps<"classic"> {
  variant: "classic";
  version: number;
  activeHint: ActiveHintState | null;
  selectedCells: CellLocation[];
  statistics: ClassicGameStatistics;
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

export interface ClassicGameStatistics {
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

export interface PersistedHintPayload {
  strategy: SudokuStrategy;
  cause: number[][];
  groups: number[][];
  placements: number[][];
  removals: number[][];
  info: string;
  action: string;
  simplifyNotesAfterPlacement: boolean;
}

export interface ActiveHintState {
  stage: 1 | 2 | 3 | 4 | 5;
  maxStage: 5;
  hint: PersistedHintPayload;
  puzzleStateBeforeHint: CellProps[][];
}

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

const HintCellIndexSchema = z.number().int().gte(0).lte(8);
const HintValueSchema = z.number().int().gte(1).lte(9);

const PersistedHintPayloadSchema = z.object({
  strategy: z.enum(
    Object.values(SUDOKU_STRATEGY_ARRAY) as [string, ...string[]],
  ),
  cause: z.array(z.tuple([HintCellIndexSchema, HintCellIndexSchema])),
  groups: z.array(
    z.tuple([
      z.union([z.literal(0), z.literal(1), z.literal(2)]),
      HintCellIndexSchema,
    ]),
  ),
  placements: z.array(
    z.tuple([HintCellIndexSchema, HintCellIndexSchema, HintValueSchema]),
  ),
  removals: z.array(
    z
      .tuple([HintCellIndexSchema, HintCellIndexSchema, HintValueSchema])
      .rest(HintValueSchema),
  ),
  info: z.string(),
  action: z.string(),
  simplifyNotesAfterPlacement: z.boolean(),
});

export const ActiveHintSchema = z.object({
  stage: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  maxStage: z.literal(5),
  hint: PersistedHintPayloadSchema,
  puzzleStateBeforeHint: z
    .array(z.array(SudokuBoardCellSchema).length(9))
    .length(9),
});

// https://github.com/colinhacks/zod/discussions/3115 for workaround used
// todo make custom schemas perhaps?
export const SudokuBoardClassicSchema = z.object({
  variant: z.literal("classic"),
  version: z.literal(1),
  activeHint: ActiveHintSchema.nullable(),
  selectedCells: z.array(SudokuBoardCellLocationSchema),
  statistics: z.object({
    difficulty: z.enum(GAME_DIFFICULTIES),
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

// https://github.com/colinhacks/zod/discussions/3115 for workaround used
// todo make custom schemas perhaps?
export const SudokuBoardDrillSchema = z.object({
  variant: z.literal("drill"),
  version: z.literal(1),
  activeHint: ActiveHintSchema.nullable(),
  selectedCells: z.array(SudokuBoardCellLocationSchema),
  statistics: z.object({
    difficulty: z.enum(
      Object.values(SUDOKU_STRATEGY_ARRAY) as [string, ...string[]],
    ),
    hintUsed: z.boolean(),
    numWrongCellsPlayed: z.number().int().nonnegative().finite().safe(),
    time: z.number().int().nonnegative().finite().safe(),
  }),
  initialPuzzleState: z
    .array(z.array(SudokuBoardCellSchema).length(9))
    .length(9),
  puzzleState: z.array(z.array(SudokuBoardCellSchema).length(9)).length(9),
  puzzleSolution: z.array(z.array(SudokuBoardCellSchema).length(9)).length(9),
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

export const SudokuBoardActiveGameSchema = z.array(SudokuBoardClassicSchema);
export const SudokuBoardDrillGameSchema = z.array(SudokuBoardDrillSchema);

export const ThemeSchema = z.enum(ThemeNames as [ThemeName, ...ThemeName[]]);

export const ProfileSchema = z.object({
  version: z.literal(1),
  drillMode: z.boolean().default(true),
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
