import { sudokuStrategyArray } from "sudokuru";

export interface puzzle {
  puzzle: string;
  puzzleSolution: string;
  strategies: sudokuStrategyArray;
  difficulty: number;
  drillStrategies?: sudokuStrategyArray;
}

export interface drill {
  puzzleCurrentState: string;
  puzzleCurrentNotesState: string;
  puzzleSolution: string;
}

export interface activeGame {
  userId: string;
  puzzle: string;
  puzzleSolution: string;
  currentTime: number;
  difficulty: number;
  moves: move[];
  numHintsUsed: number;
  numWrongCellsPlayed: number;
}

export interface move {
  puzzleCurrentState: string;
  puzzleCurrentNotesState: string;
}

export interface gameResults {
  score: number;
  solveTime: number;
  numHintsUsed: number;
  numWrongCellsPlayed: number;
  difficulty: number;
}
