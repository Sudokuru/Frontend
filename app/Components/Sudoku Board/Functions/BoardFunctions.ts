import { useWindowDimensions } from "react-native";
import { Puzzles } from "../../../Api/Puzzles";
import {
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
export function getCellSize(): number {
  const size = useWindowDimensions();
  return Math.min(size.width * 1.44444, size.height) / 15;
}

export function getBoardSize(): number {
  return getCellSize() * 9;
}

export const isValueCorrect = (
  solution: number,
  inputValue: number
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
      : hours == 0 && days != 0
      ? "00:"
      : "";
  const paddedMinutes =
    minutes > 0
      ? (minutes < 10 ? "0" : "") + minutes + ":"
      : minutes == 0 && hours != 0
      ? "00:"
      : "";
  const paddedSeconds =
    seconds > 0
      ? (seconds < 10 ? "0" : "") + seconds
      : seconds == 0 && minutes != 0
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
  difficulty: string,
  numHintsUsed: number,
  numWrongCellsPlayed: number,
  time: number
): number {
  const numericalDifficulty: GameDifficultyScore =
    difficulty === "easy"
      ? 10
      : difficulty === "medium"
      ? 20
      : difficulty === "hard"
      ? 30
      : 10;
  // calculate score
  const difficultyScore: number = (numericalDifficulty / 1000) * 30;
  const hintAndIncorrectCellsScore: number =
    numWrongCellsPlayed + numHintsUsed > 40
      ? 0
      : 40 - numWrongCellsPlayed - numHintsUsed;
  const timeScore: number = time / 60 > 30 ? 0 : 30 - time / 60;
  const score: number = Math.round(
    difficultyScore + hintAndIncorrectCellsScore + timeScore
  );

  Puzzles.finishGame(numHintsUsed, numWrongCellsPlayed, time, score);
  return score;
}
