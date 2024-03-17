import { statistics } from "./Puzzle.Types";
import { getKeyJSON, removeData, storeData } from "../Functions/AsyncStorage";

export class Statistics {
  /**
   * retrieves the user's learned lessons
   * @returns promise of puzzle JSON object
   */
  public static async getLearnedLessons(): Promise<JSON> {
    const value = await getKeyJSON("learned_lessons");
    // eslint-disable-next-line eqeqeq
    if (value == undefined) {
      return JSON.parse(JSON.stringify(["NONE"]));
    } else {
      return value;
    }
  }

  /**
   * Given a user's learnedLessons, saves the user's learned lessons
   * @param learnedLessons - A JSON object representing all lessons the user has learned
   */
  public static async saveLearnedLessons(learnedLessons: string[]) {
    // Removing NONE placeholder value if user has learned a lesson
    if (learnedLessons.includes("NONE") && learnedLessons.length > 1) {
      const index = learnedLessons.indexOf("NONE");
      if (index !== -1) {
        learnedLessons.splice(index, 1);
      }
    }
    storeData("learned_lessons", JSON.stringify(learnedLessons));
  }

  /**
   * returns all statistics objects for given user
   */
  public static async getStatistics(): Promise<statistics> {
    const value = await getKeyJSON("statistics");
    if (value == null) {
      const statistics: statistics = {
        totalScore: 0,
        numGamesPlayed: 0,
        fastestSolveTime: 0,
        averageSolveTime: 0,
        totalSolveTime: 0,
        numHintsUsed: 0,
        numWrongCellsPlayed: 0,
      };
      await this.saveStatisitics(statistics);
      return statistics;
    }
    return value;
  }

  public static async saveStatisitics(statistics: statistics) {
    storeData("statistics", JSON.stringify(statistics));
  }

  /**
   * this function deletes the user's statistics
   */
  public static async deleteStatistics() {
    await removeData("statistics");
    await removeData("learned_lessons");
    await removeData("dismissDrillTutorial");
  }
}
