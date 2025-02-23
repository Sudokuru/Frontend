import { useWindowDimensions } from "react-native";
import { SudokuObjectProps } from "../../../../Functions/LocalDatabase";
import { calculateGameScore, GameDifficulty } from "./DifficultyFunctions";
import { finishGame, saveGame } from "../../../../Api/Puzzles";
import { SudokuStrategy } from "sudokuru";
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

/**
 * Calculates and returns the score of the game.
 * Calls Puzzle.finishGame to update Statistics Page and remove localstorage object.
 * @param difficulty
 * @param numHintsUsed
 * @param numWrongCellsPlayed
 * @param time
 * @returns
 */
export function finishSudokuGame(
  difficulty: GameDifficulty,
  numHintsUsed: number,
  numHintsUsedPerStrategy: {
    hintStrategy: SudokuStrategy;
    numHintsUsed: number;
  }[],
  numWrongCellsPlayed: number,
  time: number
): number {
  // calculate score
  const score = calculateGameScore(
    numHintsUsed,
    numWrongCellsPlayed,
    time,
    difficulty
  );

  // removes game from localstorage and updates statistics page
  finishGame(
    numHintsUsed,
    numHintsUsedPerStrategy,
    numWrongCellsPlayed,
    time,
    score
  );
  return score;
}

/**
 * Saves the game and navigates back a screen
 * @param sudokuBoard The current state of the game
 * @param navigation The navigation object
 */
export function handlePause(sudokuBoard: SudokuObjectProps, navigation: any) {
  saveGame(sudokuBoard);
  navigation.navigate("PlayPage");
}
