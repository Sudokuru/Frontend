import React from "react";

import { Profile } from "../Api/Profile";
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
} from "../Styling/ThemeColors";

const InitializeContext = () => {
  const [isThemeDark, setIsThemeDark] = React.useState(true);
  const [isCurrentPage, setCurrentPage] = React.useState("Landing");
  const [learnedLessons, setLearnedLessons] = React.useState(["NONE"]);
  const [isHighlightIdenticalValues, setHighlightIdenticalValues] =
    React.useState(true);
  const [isHighlightBox, setHighlightBox] = React.useState(true);
  const [isHighlightRow, setHighlightRow] = React.useState(true);
  const [isHighlightColumn, setHighlightColumn] = React.useState(true);

  // set initial values of theme
  React.useEffect(() => {
    Profile.getProfile().then((data) => {
      setIsThemeDark(data.theme);
      setHighlightIdenticalValues(data.highlightIdenticalValues);
      setHighlightBox(data.highlightBox);
      setHighlightRow(data.highlightRow);
      setHighlightColumn(data.highlightColumn);
    });
  }, []);

  const theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = React.useCallback(() => {
    Profile.setProfileValue("theme");
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const updateCurrentPage = React.useCallback(
    (props: any) => {
      return setCurrentPage(props);
    },
    [isCurrentPage],
  );

  const updateLearnedLessons = React.useCallback(
    (props: any) => {
      return setLearnedLessons(props);
    },
    [learnedLessons],
  );

  const toggleHighlightIdenticalValues = React.useCallback(() => {
    Profile.setProfileValue("highlightIdenticalValues");
    return setHighlightIdenticalValues(!isHighlightIdenticalValues);
  }, [isHighlightIdenticalValues]);

  const toggleHighlightBox = React.useCallback(() => {
    Profile.setProfileValue("highlightBox");
    return setHighlightBox(!isHighlightBox);
  }, [isHighlightBox]);

  const toggleHighlightRow = React.useCallback(() => {
    Profile.setProfileValue("highlightRow");
    return setHighlightRow(!isHighlightRow);
  }, [isHighlightRow]);

  const toggleHighlightColumn = React.useCallback(() => {
    Profile.setProfileValue("highlightColumn");
    return setHighlightColumn(!isHighlightColumn);
  }, [isHighlightColumn]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
      updateCurrentPage,
      isCurrentPage,
      updateLearnedLessons,
      learnedLessons,
      toggleHighlightIdenticalValues,
      isHighlightIdenticalValues,
      toggleHighlightBox,
      isHighlightBox,
      toggleHighlightRow,
      isHighlightRow,
      toggleHighlightColumn,
      isHighlightColumn,
    }),
    [
      toggleTheme,
      isThemeDark,
      updateCurrentPage,
      isCurrentPage,
      updateLearnedLessons,
      learnedLessons,
      toggleHighlightIdenticalValues,
      isHighlightIdenticalValues,
      toggleHighlightBox,
      isHighlightBox,
      toggleHighlightRow,
      isHighlightRow,
      toggleHighlightColumn,
      isHighlightColumn,
    ],
  );

  return {
    theme,
    preferences,
  };
};
export default InitializeContext;
