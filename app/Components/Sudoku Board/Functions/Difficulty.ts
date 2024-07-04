import { AMATEUR_PUZZLES } from "../../../Data/puzzles/amateur_puzzles";
import { GRANDMASTER_PUZZLES } from "../../../Data/puzzles/grandmaster_puzzles";
import { LAYMAN_PUZZLES } from "../../../Data/puzzles/layman_puzzles";
import { MASTER_PUZZLES } from "../../../Data/puzzles/master_puzzles";
import { NOVICE_PUZZLES } from "../../../Data/puzzles/novice_puzzles";
import { PROFESSIONAL_PUZZLES } from "../../../Data/puzzles/professional_puzzles";
import { PROTEGE_PUZZLES } from "../../../Data/puzzles/protege_puzzles";
import { PUNDIT_PUZZLES } from "../../../Data/puzzles/pundit_puzzles";
import { TRAINEE_PUZZLES } from "../../../Data/puzzles/trainee_puzzles";
import {
  convertPuzzleToSudokuObject,
  Puzzle,
  SudokuObjectProps,
} from "../../../Functions/LocalDatabase";

export type GameDifficulty =
  | "novice"
  | "amateur"
  | "layman"
  | "trainee"
  | "protege"
  | "professional"
  | "pundit"
  | "master"
  | "grandmaster";
export type GameDifficultyScore = 0 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40;

/**
 * Calculates the difficulty score
 * @param difficulty A string representing the difficulty of the puzzle
 * @returns A number representing the difficulty score from the puzzle, which represents 30% of the total score
 */
function calculateDifficultyScore(
  difficulty: GameDifficulty
): GameDifficultyScore {
  switch (difficulty) {
    case "novice":
      return 0;
    case "amateur":
      return 5;
    case "layman":
      return 10;
    case "trainee":
      return 15;
    case "protege":
      return 20;
    case "professional":
      return 25;
    case "pundit":
      return 30;
    case "master":
      return 35;
    case "grandmaster":
      return 40;
  }
}

/**
 * Calculates the hint and incorrect cell score
 * Every hint and incorrect cell subtracts 5 point from 30, with a minimum score of 0 and a maximum score of 30
 * @param numWrongCellsPlayed a number representing the number of wrong cells played
 * @param numHintsUsed a number representing the number of hints used
 * @returns A number representing the hint and incorrect cell score, which represents 30% of the total score
 */
function calculateHintAndIncorrectCellScore(
  numWrongCellsPlayed: number,
  numHintsUsed: number
): number {
  // hints and incorrect cell placements are weighted equally
  const totalScrewups = (numWrongCellsPlayed + numHintsUsed) * 5;
  if (totalScrewups > 30) {
    return 0;
  } else {
    return 30 - totalScrewups;
  }
}

/**
 * Calculates the time score
 * If the game takes 30 minutes or longer, we return a score of 0
 * Otherwise, we return a score of 30 minus how many minutes the game took.
 * @param time The total time of the game
 * @returns A number representing the time score, which is 30% of the score
 */
function calculateTimeScore(time: number): number {
  const minutes = Math.floor(time / 60);
  if (minutes > 30) {
    return 0;
  } else {
    return 30 - minutes;
  }
}

/**
 * Calculates the score from the game
 * @param numHintsUsed the number of hints used during the game
 * @param numWrongCellsPlayed the number of wrong cells played during the game
 * @param time the total time of the game
 * @param difficulty the difficulty of the game as a
 * @returns A number 0-100 which represents the score for the game
 */
export function calculateGameScore(
  numHintsUsed: number,
  numWrongCellsPlayed: number,
  time: number,
  difficulty: GameDifficulty
): number {
  const difficultyScore: GameDifficultyScore =
    calculateDifficultyScore(difficulty);
  const hintAndIncorrectCellsScore: number = calculateHintAndIncorrectCellScore(
    numWrongCellsPlayed,
    numHintsUsed
  );
  const timeScore: number = calculateTimeScore(time);
  return difficultyScore + hintAndIncorrectCellsScore + timeScore;
}

/**
 * Returns a random puzzle from an array of puzzles
 * @param PUZZLES An array of puzzles
 * @returns a random puzzle from an array of puzzles
 */
const retrieveRandomPuzzle = (PUZZLES: Puzzle[]): Puzzle => {
  return PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
};

/**
 * This function takes in the requested difficulty and returns a puzzle matching the difficulty.
 * @param difficulty The difficulty classification of the puzzle. (string)
 * @returns A Puzzle object
 */
export const returnPuzzleOfDifficulty = (
  difficulty: GameDifficulty | "dev"
): Puzzle => {
  switch (difficulty) {
    // "dev" difficulty is a custom difficulty that always returns the same puzzle.
    case "dev":
      return NOVICE_PUZZLES[0];
    case "novice":
      return retrieveRandomPuzzle(NOVICE_PUZZLES);
    case "amateur":
      return retrieveRandomPuzzle(AMATEUR_PUZZLES);
    case "layman":
      return retrieveRandomPuzzle(LAYMAN_PUZZLES);
    case "trainee":
      return retrieveRandomPuzzle(TRAINEE_PUZZLES);
    case "protege":
      return retrieveRandomPuzzle(PROTEGE_PUZZLES);
    case "professional":
      return retrieveRandomPuzzle(PROFESSIONAL_PUZZLES);
    case "pundit":
      return retrieveRandomPuzzle(PUNDIT_PUZZLES);
    case "master":
      return retrieveRandomPuzzle(MASTER_PUZZLES);
    case "grandmaster":
      return retrieveRandomPuzzle(GRANDMASTER_PUZZLES);
  }
};

/**
 * This function takes in the requested difficulty and returns a puzzle matching the difficulty.
 * @param difficulty The difficulty classification of the puzzle. (string)
 * @returns A puzzle object that is readable by the Sudoku component.
 */
export const returnGameOfDifficulty = (
  difficulty: GameDifficulty | "dev"
): SudokuObjectProps => {
  let puzzles = returnPuzzleOfDifficulty(difficulty);
  if (difficulty === "dev") {
    difficulty = "novice";
  }
  return convertPuzzleToSudokuObject(puzzles, difficulty);
};
