import {
  SudokuBoardActiveGameSchema,
  SudokuObjectProps,
} from "../Functions/LocalDatabase";
import { getKeyJSON, removeData, storeData } from "../Functions/AsyncStorage";
import {
  GameDifficulty,
  returnGameOfDifficulty,
} from "../Components/SudokuBoard/Core/Functions/Difficulty";
import { Statistics } from "./Puzzle.Types";
import { getStatistics, saveStatisitics } from "./Statistics";
import { SudokuStrategy } from "sudokuru";

/**
 * Given a difficulty and an user auth token retrieves a random puzzle close to the difficulty that the user hasn't solved before
 * @param difficulty - difficulty number (between 0 and 1)
 * @param strategies - new game can have subset of these strategies
 * @returns promise of puzzle JSON object
 */
export const startGame = (difficulty: GameDifficulty): SudokuObjectProps => {
  return returnGameOfDifficulty(difficulty);
  // !uncomment below for dev testing
  // return returnGameOfDifficulty("dev");
};

/**
 * Given an user auth token retrieves the users active game or returns null if the user doesn't have an active game
 * @returns promise of activeGame JSON object
 */
export const getGame = (): Promise<SudokuObjectProps[]> => {
  return getKeyJSON("active_game", SudokuBoardActiveGameSchema);
};

/**
 * Given a game saves it to AsyncStorage
 * @param game - activeGame JSON object
 */
export const saveGame = (game: SudokuObjectProps) => {
  storeData("active_game", JSON.stringify([game]));
};

/**
 * Completes the game by removing the active game from storage and updating user statistics.
 *
 * @param numHintsUsed - The total number of hints used during the game.
 * @param numHintsUsedPerStrategy - An array of objects detailing the number of hints used per strategy.
 * @param numWrongCellsPlayed - The total number of incorrect cells played during the game.
 * @param time - The total time taken to complete the game.
 * @param score - The score achieved in the game.
 *
 * This function removes the current active game from storage and updates the user's statistics
 * including total score, fastest and total solve times, average solve time, and the number of games played.
 * It also updates the number of hints used for each strategy applied during the game.
 */
export const finishGame = async (
  numHintsUsed: number,
  numHintsUsedPerStrategy: {
    hintStrategy: SudokuStrategy;
    numHintsUsed: number;
  }[],
  numWrongCellsPlayed: number,
  time: number,
  score: number
) => {
  // remove the game from storage
  await removeData("active_game");

  // Create or update user's statistics
  let statistics: Statistics = await getStatistics();

  statistics.totalScore += score;
  if (time < statistics.fastestSolveTime || statistics.fastestSolveTime === 0) {
    statistics.fastestSolveTime = time;
  }
  statistics.totalSolveTime += time;
  statistics.numGamesPlayed += 1;
  statistics.numHintsUsed += numHintsUsed;
  statistics.numWrongCellsPlayed += numWrongCellsPlayed;
  statistics.averageSolveTime = Math.round(
    statistics.totalSolveTime / statistics.numGamesPlayed
  );

  // Create or update user's total number of hints used per strategy statistics
  for (const newHintStrategies of numHintsUsedPerStrategy) {
    const existingHintStrategies = statistics.numHintsUsedPerStrategy.find(
      (strategy: { hintStrategy: SudokuStrategy; numHintsUsed: number }) =>
        strategy.hintStrategy === newHintStrategies.hintStrategy
    );
    if (existingHintStrategies) {
      existingHintStrategies.numHintsUsed += newHintStrategies.numHintsUsed;
    } else {
      statistics.numHintsUsedPerStrategy.push({
        hintStrategy: newHintStrategies.hintStrategy,
        numHintsUsed: newHintStrategies.numHintsUsed,
      });
    }
  }

  saveStatisitics(statistics);
};
