import React from "react";
import { SUDOKU_STRATEGY_ARRAY, SudokuStrategyArray } from "sudokuru";

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
  strategyHintOrderSetting: SUDOKU_STRATEGY_ARRAY,
});
