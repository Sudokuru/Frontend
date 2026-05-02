import { useWindowDimensions } from "react-native";
import {
  BoardObjectProps,
  CellProps,
  ClassicGameStatistics,
  GameVariant,
} from "../../../../Functions/LocalDatabase";
import { calculateGameScore } from "./DifficultyFunctions";
import { finishGame, saveGame } from "../../../../Api/Puzzles";
import { isEqual } from "../../Drill/Functions/CellFunctions";
/**
 * This is a temporary place to store functions
 * todo functions will be documented, sorted, and optimized
 */

export const MOBILE_BREAKPOINT = 768;
const MAX_BOARD_SIZE = 640;

const HEADER_ROW_HEIGHT_IN_CELLS_DESKTOP = 1.75;
const HEADER_ROW_HEIGHT_IN_CELLS_MOBILE = 1.3;
const PUZZLE_HEIGHT_IN_CELLS = 9;
const ACTION_ROW_HEIGHT_IN_CELLS_DESKTOP = 1.6;
const ACTION_ROW_HEIGHT_IN_CELLS_MOBILE = 1.45;
const NUMBER_CONTROL_HEIGHT_IN_CELLS_DESKTOP = 1;
const NUMBER_CONTROL_HEIGHT_IN_CELLS_MOBILE = 1.65;
const BOARD_VERTICAL_VIEWPORT_FRACTION_DESKTOP = 0.92;
const BOARD_VERTICAL_VIEWPORT_FRACTION_MOBILE = 0.98;

/**
 * This function retrieves the user's device size and calculates the cell size
 * board has width and height dimensions
 */
export function useCellSize(): number {
  const { width, height } = useWindowDimensions();
  const headerRowHeightInCells =
    width < MOBILE_BREAKPOINT
      ? HEADER_ROW_HEIGHT_IN_CELLS_MOBILE
      : HEADER_ROW_HEIGHT_IN_CELLS_DESKTOP;
  const actionRowHeightInCells =
    width < MOBILE_BREAKPOINT
      ? ACTION_ROW_HEIGHT_IN_CELLS_MOBILE
      : ACTION_ROW_HEIGHT_IN_CELLS_DESKTOP;

  const numberControlHeightInCells =
    width < MOBILE_BREAKPOINT
      ? NUMBER_CONTROL_HEIGHT_IN_CELLS_MOBILE
      : NUMBER_CONTROL_HEIGHT_IN_CELLS_DESKTOP;

  const boardLayoutHeightInCells =
    headerRowHeightInCells +
    PUZZLE_HEIGHT_IN_CELLS +
    actionRowHeightInCells +
    numberControlHeightInCells;

  const boardVerticalViewportFraction =
    width < MOBILE_BREAKPOINT
      ? BOARD_VERTICAL_VIEWPORT_FRACTION_MOBILE
      : BOARD_VERTICAL_VIEWPORT_FRACTION_DESKTOP;

  const maxBoardWidth =
    width < MOBILE_BREAKPOINT ? width : Math.min(width * 0.9, MAX_BOARD_SIZE);

  const maxCellSizeFromWidth = maxBoardWidth / 9;
  const maxCellSizeFromHeight =
    (height * boardVerticalViewportFraction) / boardLayoutHeightInCells;

  if (width < MOBILE_BREAKPOINT) {
    return maxCellSizeFromWidth;
  }

  return Math.min(maxCellSizeFromWidth, maxCellSizeFromHeight);
}

export const isValueCorrect = (
  solution: CellProps | number,
  inputValue: number,
): boolean => {
  if (typeof solution === "object" && "entry" in solution) {
    return isEqual(solution.entry, inputValue);
  }
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
  statistics: ClassicGameStatistics,
  variant: GameVariant,
): ClassicGameStatistics {
  // calculate score
  const score = calculateGameScore(
    statistics.numHintsUsed,
    statistics.numWrongCellsPlayed,
    statistics.time,
    statistics.difficulty,
  );

  // removes game from localstorage and updates statistics page
  finishGame(
    statistics.numHintsUsed,
    statistics.numHintsUsedPerStrategy,
    statistics.numWrongCellsPlayed,
    statistics.time,
    score,
    variant,
  );

  statistics.score = score;

  return {
    numHintsUsed: statistics.numHintsUsed,
    numHintsUsedPerStrategy: statistics.numHintsUsedPerStrategy,
    numWrongCellsPlayed: statistics.numWrongCellsPlayed,
    time: statistics.time,
    score: statistics.score,
    difficulty: statistics.difficulty,
    internalDifficulty: statistics.internalDifficulty,
  };
}

/**
 * Saves the game and navigates back a screen
 * @param sudokuBoard The current state of the game
 * @param navigation The navigation object
 */
export function handlePause(sudokuBoard: BoardObjectProps, navigation: any) {
  saveGame(sudokuBoard);
  navigation.navigate("PlayPage");
}
