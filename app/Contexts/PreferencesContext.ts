import React from "react";

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false,
  updateCurrentPage: (props: any) => {},
  isCurrentPage: "Landing",
  updateLearnedLessons: (props: any) => {},
  learnedLessons: [""],
  toggleHighlightIdenticalValues: () => {},
  isHighlightIdenticalValues: true,
  toggleHighlightBox: () => {},
  isHighlightBox: true,
  toggleHighlightRow: () => {},
  isHighlightRow: true,
  toggleHighlightColumn: () => {},
  isHighlightColumn: true,
});
