import { useWindowDimensions } from "react-native";

import { Puzzles } from "../../../Api/Puzzles";
import {
  GameDifficulty,
  GameDifficultyScore,
  SudokuObjectProps,
} from "../../../Functions/LocalDatabase";
/**
 * This is a temporary place to store functions
 * todo functions will be documented, sorted, and optimized
 */

/**
 * This function retrieves the user's device size and calculates the cell size
 * board has width and height dimensions of 1 x 1.44444
 */
export function useCellSize(): number {
  const size = useWindowDimensions();
  return Math.min(size.width * 1.44444, size.height) / 15;
}

export function useBoardSize(): number {
  return useCellSize() * 9;
}

export const isValueCorrect = (
  solution: number,
  inputValue: number,
): boolean => {
  return solution === inputValue;
};

// https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds
export const formatTime = (inputSeconds: number) => {
  // Get minutes and remaining seconds
  const days = Math.floor(inputSeconds / (3600 * 24));
  const hours = Math.floor((inputSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((inputSeconds % 3600) / 60);
  const seconds = Math.floor(inputSeconds % 60);
  // Pad with zeros if needed
  const paddedDays = days > 0 ? (days < 10 ? "0" : "") + days + ":" : "";
  const paddedHours =
    hours > 0
      ? (hours < 10 ? "0" : "") + hours + ":"
      : hours === 0 && days !== 0
        ? "00:"
        : "";
  const paddedMinutes =
    minutes > 0
      ? (minutes < 10 ? "0" : "") + minutes + ":"
      : minutes === 0 && hours !== 0
        ? "00:"
        : "";
  const paddedSeconds =
    seconds > 0
      ? (seconds < 10 ? "0" : "") + seconds
      : seconds === 0 && minutes !== 0
        ? "00"
        : "0";

  // Return formatted string
  return `${paddedDays}${paddedHours}${paddedMinutes}${paddedSeconds}`;
};

export async function saveGame(activeGame: SudokuObjectProps) {
  Puzzles.saveGame(activeGame).then((res: any) => {
    if (res) {
      console.log("Game progress was saved successfully!");
    }
  });
}

/**
 * Calculates and returns the score of the game.
 * Calls Puzzle.finishGame to update Statistics Page and remove localstorage object.
 * @param difficulty
 * @param numHintsUsed
 * @param numWrongCellsPlayed
 * @param time
 * @returns
 */
export function finishGame(
  difficulty: GameDifficulty,
  numHintsUsed: number,
  numWrongCellsPlayed: number,
  time: number,
): number {
  // calculate score
  const score = calculateGameScore(
    numHintsUsed,
    numWrongCellsPlayed,
    time,
    difficulty,
  );

  // removes game from localstorage and updates statistics page
  Puzzles.finishGame(numHintsUsed, numWrongCellsPlayed, time, score);
  return score;
}

/**
 * Calculates the score from the game
 * @param numHintsUsed the number of hints used during the game
 * @param numWrongCellsPlayed the number of wrong cells played during the game
 * @param time the total time of the game
 * @param difficulty the difficulty of the game as a
 * @returns A number 0-100 which represents the score for the game
 */
function calculateGameScore(
  numHintsUsed: number,
  numWrongCellsPlayed: number,
  time: number,
  difficulty: GameDifficulty,
): number {
  const difficultyScore: GameDifficultyScore =
    calculateDifficultyScore(difficulty);
  const hintAndIncorrectCellsScore: number = calculateHintAndIncorrectCellScore(
    numWrongCellsPlayed,
    numHintsUsed,
  );
  const timeScore: number = calculateTimeScore(time);
  return difficultyScore + hintAndIncorrectCellsScore + timeScore;
}

/**
 * Calculates the difficulty score
 * @param difficulty A string representing the difficulty of the puzzle
 * @returns A number representing the difficulty score from the puzzle, which represents 30% of the total score
 */
function calculateDifficultyScore(
  difficulty: GameDifficulty,
): GameDifficultyScore {
  if (difficulty === "easy") {
    return 10;
  } else if (difficulty === "medium") {
    return 20;
  } else if (difficulty === "hard") {
    return 30;
  } else {
    return 10;
  }
}

/**
 * Calculates the hint and incorrect cell score
 * Every hint and incorrect cell subtracts 1 point from 40, with a minimum score of 0 and a maximum score of 40
 * @param numWrongCellsPlayed a number representing the number of wrong cells played
 * @param numHintsUsed a number representing the number of hints used
 * @returns A number representing the hint and incorrect cell score, which represents 40% of the total score
 */
function calculateHintAndIncorrectCellScore(
  numWrongCellsPlayed: number,
  numHintsUsed: number,
): number {
  // hints and incorrect cell placements are weighted equally
  const totalScrewups = numWrongCellsPlayed + numHintsUsed;
  if (totalScrewups > 40) {
    return 0;
  } else {
    return 40 - totalScrewups;
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
