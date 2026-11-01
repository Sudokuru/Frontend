import type { SudokuStrategy } from "sudokuru";

export const DRILL_STRATEGIES = [
  "OBVIOUS_SINGLE",
  "OBVIOUS_PAIR",
  "OBVIOUS_TRIPLET",
  "OBVIOUS_QUADRUPLET",
  "HIDDEN_SINGLE",
  "HIDDEN_PAIR",
  "HIDDEN_TRIPLET",
  "HIDDEN_QUADRUPLET",
  "POINTING_PAIR",
  "POINTING_TRIPLET",
] as const satisfies readonly SudokuStrategy[];

export type DrillStrategy = (typeof DRILL_STRATEGIES)[number];
