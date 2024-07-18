import React from "react";

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  darkThemeSetting: false,
  updateCurrentPage: (props: any) => {},
  currentPage: "Landing",
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
});
