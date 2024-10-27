import { difficulty } from "./../Components/Home/Cards";
import { statistics } from "./Puzzle.Types";
import { SudokuObjectProps } from "../Functions/LocalDatabase";
import { getKeyJSON, removeData, storeData } from "../Functions/AsyncStorage";
import { Statistics } from "./Statistics";
import {
  GameDifficulty,
  returnGameOfDifficulty,
} from "../Components/SudokuBoard/Functions/Difficulty";
import { SudokuStrategy } from "sudokuru";

/**
 * Functions to handle puzzle related operations
 */
export class Puzzles {
  /**
   * Given a difficulty and an user auth token retrieves a random puzzle close to the difficulty that the user hasn't solved before
   * @param difficulty - difficulty number (between 0 and 1)
   * @param strategies - new game can have subset of these strategies
   * @returns promise of puzzle JSON object
   */
  public static async startGame(
    difficulty: GameDifficulty
  ): Promise<SudokuObjectProps> {
    return returnGameOfDifficulty(difficulty);
    // !uncomment below for dev testing
    // return returnGameOfDifficulty("dev");
  }

  /**
   * Given an user auth token retrieves the users active game or returns null if the user doesn't have an active game
   * @returns promise of activeGame JSON object
   */
  public static async getGame(): Promise<SudokuObjectProps[]> {
    return await getKeyJSON("active_game");
  }

  /**
   * Given a game saves it to AsyncStorage
   * @param game - activeGame JSON object
   */
  public static async saveGame(game: SudokuObjectProps) {
    storeData("active_game", JSON.stringify([game]));
  }

  /**
   * Given deletes the users active game and updates user's total statistics
   */
  public static async finishGame(
    numHintsUsed: number,
    numHintsUsedPerStrategy: {
      hintStrategy: SudokuStrategy;
      numHintsUsed: number;
    }[],
    numWrongCellsPlayed: number,
    time: number,
    score: number
  ) {
    // remove the game from storage
    await removeData("active_game");

    // Create or update user's statistics
    let statistics: statistics = await Statistics.getStatistics();

    statistics.totalScore += score;
    if (
      time < statistics.fastestSolveTime ||
      statistics.fastestSolveTime === 0
    ) {
      statistics.fastestSolveTime = time;
    }
    statistics.totalSolveTime += time;
    statistics.numGamesPlayed += 1;
    statistics.numHintsUsed += numHintsUsed;
    statistics.numWrongCellsPlayed += numWrongCellsPlayed;
    statistics.averageSolveTime = Math.round(
      statistics.totalSolveTime / statistics.numGamesPlayed
    );

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

    Statistics.saveStatisitics(statistics);
  }
}
