import React from "react";

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  darkThemeSetting: false,
  updateCurrentPage: (props: any) => {},
  isCurrentPage: "Landing", // currentPage
  updateLearnedLessons: (props: any) => {},
  learnedLessons: [""],
  toggleHighlightIdenticalValues: () => {},
  isHighlightIdenticalValues: true, // highlightIdenticalValuesSetting
  toggleHighlightBox: () => {},
  isHighlightBox: true, // highlightBoxSetting
  toggleHighlightRow: () => {},
  isHighlightRow: true, // highlightRowSetting
  toggleHighlightColumn: () => {},
  isHighlightColumn: true, // highlightColumnSetting
});
