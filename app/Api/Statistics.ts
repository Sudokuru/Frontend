import { Statistics } from "./Puzzle.Types";
import { getKeyJSON, removeData, storeData } from "../Functions/AsyncStorage";
import { StatisticsSchema } from "../Functions/LocalDatabase";

/**
 * retrieves the user's learned lessons
 * @returns promise of puzzle JSON object
 */
export const getLearnedLessons = async (): Promise<JSON> => {
  const value = await getKeyJSON("learned_lessons");
  if (value == undefined) {
    return JSON.parse(JSON.stringify(["NONE"]));
  } else {
    return value;
  }
};

/**
 * Given a user's learnedLessons, saves the user's learned lessons
 * @param learnedLessons - A JSON object representing all lessons the user has learned
 */
export const saveLearnedLessons = (learnedLessons: string[]) => {
  // Removing NONE placeholder value if user has learned a lesson
  if (learnedLessons.includes("NONE") && learnedLessons.length > 1) {
    let index = learnedLessons.indexOf("NONE");
    if (index !== -1) {
      learnedLessons.splice(index, 1);
    }
  }
  storeData("learned_lessons", JSON.stringify(learnedLessons));
};

export const saveStatisitics = (statistics: Statistics) => {
  storeData("statistics", JSON.stringify(statistics));
};

/**
 * returns all statistics objects for given user
 */
export const getStatistics = async (): Promise<Statistics> => {
  const value = await getKeyJSON("statistics", StatisticsSchema);
  if (value == null) {
    const statistics: Statistics = {
      version: 1,
      totalScore: 0,
      numGamesPlayed: 0,
      fastestSolveTime: 0,
      averageSolveTime: 0,
      totalSolveTime: 0,
      numHintsUsed: 0,
      numHintsUsedPerStrategy: [],
      numWrongCellsPlayed: 0,
    };
    saveStatisitics(statistics);
    return statistics;
  }
  return value;
};

/**
 * this function deletes the user's statistics
 */
export const deleteStatistics = async () => {
  await removeData("statistics");
  await removeData("learned_lessons");
  await removeData("dismissDrillTutorial");
};
