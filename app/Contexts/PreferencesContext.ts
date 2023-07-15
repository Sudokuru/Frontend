import React from "react";

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false,
  updateLearnedLessons: (props: any) => {},
  learnedLessons: [""],
  toggleHighlightSet: () => {},
  isHighlightSet: true,
  toggleHighlightBox: () => {},
  isHighlightBox: true,
  toggleHighlightRow: () => {},
  isHighlightRow: true,
  toggleHighlightColumn: () => {},
  isHighlightColumn: true,
});
