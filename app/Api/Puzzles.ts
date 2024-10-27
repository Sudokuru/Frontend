import { SudokuObjectProps } from "../Functions/LocalDatabase";
import { getKeyJSON, removeData, storeData } from "../Functions/AsyncStorage";
import {
  GameDifficulty,
  returnGameOfDifficulty,
} from "../Components/SudokuBoard/Functions/Difficulty";
import { Statistics } from "./Puzzle.Types";
import { getStatistics, saveStatisitics } from "./Statistics";

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
  return getKeyJSON("active_game");
};

/**
 * Given a game saves it to AsyncStorage
 * @param game - activeGame JSON object
 */
export const saveGame = (game: SudokuObjectProps) => {
  storeData("active_game", JSON.stringify([game]));
};

/**
 * Given deletes the users active game and returns game score
 * @returns promise of game score
 */
export const finishGame = async (
  numHintsUsed: number,
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

  saveStatisitics(statistics);
};
