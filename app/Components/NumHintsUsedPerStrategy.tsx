import Statistic from "./Statistics/Statistic";
import { formatOneLessonName } from "../Functions/learnedLessons";
import React from "react";
import { SudokuStrategy } from "sudokuru";

interface NumHintsUsedPerStrategyProps {
  numHintsUsedPerStrategy: {
    hintStrategy: SudokuStrategy;
    numHintsUsed: number;
  }[];
}

/**
 * Renders a list of JSX Statistic components displaying the number of hints used per strategy.
 *
 * @param numHintsUsedPerStrategy - Array of objects detailing hints used for each strategy,
 * sorted by most hints used.
 * @returns An array of JSX elements representing the number of hints used per strategy.
 */
export const NumHintsUsedPerStrategy = (
  props: NumHintsUsedPerStrategyProps
) => {
  // sort by most number of hints
  const numHintsUsedPerStrategyClone = [...props.numHintsUsedPerStrategy].sort(
    (a, b) => {
      return b.numHintsUsed - a.numHintsUsed;
    }
  );

  // Generates the JSX elements for the number of hints used per strategy
  const strategyHints: React.JSX.Element[] = [];
  for (const strategyHint of numHintsUsedPerStrategyClone) {
    strategyHints.push(
      <Statistic
        statisticName={
          "  " + formatOneLessonName(strategyHint.hintStrategy) + ": "
        }
        statisticValue={strategyHint.numHintsUsed}
        testID={"hintsUsed" + strategyHint.hintStrategy}
        key={strategyHint.hintStrategy}
      />
    );
  }

  return strategyHints;
};
