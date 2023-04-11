import React from 'react';

export const PreferencesContext = React.createContext({
    toggleTheme: () => {},
    isThemeDark: false,
    updateLearnedLessons: (props: any) => {},
    learnedLessons: [""],
    toggleHighlightPeers: () => {},
    isHighlightPeers: true,
    toggleHighlightBox: () => {},
    isHighlightBox: true,
    toggleHighlightRow: () => {},
    isHighlightRow: true,
    toggleHighlightColumn: () => {},
    isHighlightColumn: true,
});