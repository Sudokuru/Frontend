import { useWindowDimensions } from "react-native";
import { Puzzles } from "../../../Functions/Api/Puzzles";
import {
  GameStatistics,
  SudokuBoardProps,
} from "../../../Functions/LocalStore/DataStore/LocalDatabase";
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
      ? "00"
      : "";
  const paddedMinutes =
    minutes > 0
      ? (minutes < 10 ? "0" : "") + minutes + ":"
      : minutes == 0 && hours != 0
      ? "00"
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

export async function saveGame(activeGame: SudokuBoardProps) {
  Puzzles.saveGame(activeGame).then((res: any) => {
    if (res) {
      console.log("Game progress was saved successfully!");
    }
  });
}

export async function finishGame(showResultsFunction: any) {
  Puzzles.finishGame().then((res: GameStatistics) => {
    if (res) {
      showResultsFunction(
        res.score,
        res.time,
        res.numHintsUsed,
        res.numWrongCellsPlayed,
        res.difficulty
      );
    }
  });
}
