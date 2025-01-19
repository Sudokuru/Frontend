import React from "react";
import { SUDOKU_STRATEGY_ARRAY, SudokuStrategy } from "sudokuru";

// Clones Sudoku Strategy Array and removes Amend Notes and Simplify notes from list
export const returnSudokuStrategyArray = () => {
  return [...SUDOKU_STRATEGY_ARRAY.slice(2)];
};

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  darkThemeSetting: false,
  updateCurrentPage: (props: any) => {},
  currentPage: "Home",
  updateLearnedLessons: (props: any) => {},
  learnedLessons: [""],
  toggleHighlightIdenticalValues: () => {},
  highlightIdenticalValuesSetting: true,
  toggleHighlightBox: () => {},
  highlightBoxSetting: true,
  toggleHighlightRow: () => {},
  highlightRowSetting: true,
  toggleHighlightColumn: () => {},
  highlightColumnSetting: true,
  toggleProgressionIndicator: () => {},
  progressionIndicatorSetting: true,
  toggleFeaturePreview: () => {},
  featurePreviewSetting: false,
  updateStrategyHintOrder: (props: SudokuStrategy[]) => {},
  strategyHintOrderSetting: returnSudokuStrategyArray(),
});
