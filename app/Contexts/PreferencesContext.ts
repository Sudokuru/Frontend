import React from "react";
import { SUDOKU_STRATEGY_ARRAY, SudokuStrategyArray } from "sudokuru";

// Clones Sudoku Strategy Array and removes Amend Notes from list
export const returnSudokuStrategyArray = () => {
  const updatedArray: SudokuStrategyArray = JSON.parse(
    JSON.stringify(SUDOKU_STRATEGY_ARRAY)
  );
  updatedArray.shift();
  return updatedArray;
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
  toggleFeaturePreview: () => {},
  featurePreviewSetting: false,
  updateStrategyHintOrder: (props: SudokuStrategyArray) => {},
  strategyHintOrderSetting: returnSudokuStrategyArray(),
});
