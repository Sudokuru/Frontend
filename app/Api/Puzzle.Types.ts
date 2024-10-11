import { SudokuStrategyArray } from "sudokuru";

export interface Puzzle {
  puzzle: string;
  moves: Move[];
  puzzleSolution: string;
  strategies: SudokuStrategyArray;
  difficulty: number;
  drillStrategies?: SudokuStrategyArray;
}

export interface Drill {
  puzzleCurrentState: string;
  puzzleCurrentNotesState: string;
  puzzleSolution: string;
}

export interface ActiveGame {
  userId: string;
  puzzle: string;
  puzzleSolution: string;
  currentTime: number;
  difficulty: number;
  moves: Move[];
  numHintsUsed: number;
  numWrongCellsPlayed: number;
}

export interface Move {
  puzzleCurrentState: string;
  puzzleCurrentNotesState: string;
}

export interface GameResults {
  score: number;
  solveTime: number;
  numHintsUsed: number;
  numWrongCellsPlayed: number;
  difficulty: number;
}

export interface Statistics {
  totalScore: number;
  numGamesPlayed: number;
  fastestSolveTime: number;
  averageSolveTime: number;
  totalSolveTime: number;
  numHintsUsed: number;
  numWrongCellsPlayed: number;
}

export interface Profile {
  theme: boolean;
  highlightIdenticalValues: boolean;
  highlightBox: boolean;
  highlightRow: boolean;
  highlightColumn: boolean;
  previewMode: boolean;
  strategyHintOrder: SudokuStrategyArray;
}
