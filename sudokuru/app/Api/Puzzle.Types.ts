import { SudokuStrategy } from "sudokuru";

export interface Puzzle {
  puzzle: string;
  moves: Move[];
  puzzleSolution: string;
  strategies: SudokuStrategy[];
  difficulty: number;
  drillStrategies?: SudokuStrategy[];
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
  version: number;
  totalScore: number;
  numGamesPlayed: number;
  fastestSolveTime: number;
  averageSolveTime: number;
  totalSolveTime: number;
  numWrongCellsPlayed: number;
  numHintsUsed: number;
  numHintsUsedPerStrategy: {
    hintStrategy: SudokuStrategy;
    numHintsUsed: number;
  }[];
}

export interface Profile {
  version: number;
  theme: boolean;
  highlightIdenticalValues: boolean;
  highlightBox: boolean;
  highlightRow: boolean;
  highlightColumn: boolean;
  drillMode: boolean;
  progressIndicator: boolean;
  initializeNotes: boolean;
  simplifyNotes: boolean;
  previewMode: boolean;
  strategyHintOrder: SudokuStrategy[];
}
