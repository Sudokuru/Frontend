/**
 * Given the totalStatistics value, retrieves the total statistics of the user
 */
export const retrieveTotalStatistics = (totalStatistics: any) => {
  for (let i = 0; i < totalStatistics.length; i++) {
    if (totalStatistics[i].dateRange == new Date("1111-11-11").toISOString()) {
      return {
        totalScore: totalStatistics[i].score,
        numGamesPlayed: totalStatistics[i].numGamesPlayed,
        fastestSolveTime: totalStatistics[i].fastestSolveTime,
        averageSolveTime: totalStatistics[i].averageSolveTime,
        totalSolveTime: totalStatistics[i].totalSolveTime,
        numHintsUsed: totalStatistics[i].numHintsUsed,
        numWrongCellsPlayed: totalStatistics[i].numWrongCellsPlayed,
      };
    }
  }
};
