import React from "react";
import { Profile } from "../Api/Profile";
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
} from "../Styling/ThemeColors";

const InitializeContext = () => {
  const [darkThemeSetting, setDarkThemeSetting] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState("Landing");
  const [learnedLessons, setLearnedLessons] = React.useState(["NONE"]);
  const [highlightIdenticalValuesSetting, setHighlightIdenticalValues] =
    React.useState(true);
  const [highlightBoxSetting, setHighlightBox] = React.useState(true);
  const [highlightRowSetting, setHighlightRow] = React.useState(true);
  const [highlightColumnSetting, setHighlightColumn] = React.useState(true);

  // set initial values of theme
  React.useEffect(() => {
    Profile.getProfile().then((data) => {
      setDarkThemeSetting(data.theme);
      setHighlightIdenticalValues(data.highlightIdenticalValues);
      setHighlightBox(data.highlightBox);
      setHighlightRow(data.highlightRow);
      setHighlightColumn(data.highlightColumn);
    });
  }, []);

  const theme = darkThemeSetting ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = React.useCallback(() => {
    Profile.setProfileValue("theme");
    return setDarkThemeSetting(!darkThemeSetting);
  }, [darkThemeSetting]);

  const updateCurrentPage = React.useCallback(
    (props: React.SetStateAction<string>) => {
      return setCurrentPage(props);
    },
    [currentPage]
  );

  const updateLearnedLessons = React.useCallback(
    (props: React.SetStateAction<string[]>) => {
      return setLearnedLessons(props);
    },
    [learnedLessons]
  );

  const toggleHighlightIdenticalValues = React.useCallback(() => {
    Profile.setProfileValue("highlightIdenticalValues");
    return setHighlightIdenticalValues(!highlightIdenticalValuesSetting);
  }, [highlightIdenticalValuesSetting]);

  const toggleHighlightBox = React.useCallback(() => {
    Profile.setProfileValue("highlightBox");
    return setHighlightBox(!highlightBoxSetting);
  }, [highlightBoxSetting]);

  const toggleHighlightRow = React.useCallback(() => {
    Profile.setProfileValue("highlightRow");
    return setHighlightRow(!highlightRowSetting);
  }, [highlightRowSetting]);

  const toggleHighlightColumn = React.useCallback(() => {
    Profile.setProfileValue("highlightColumn");
    return setHighlightColumn(!highlightColumnSetting);
  }, [highlightColumnSetting]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      darkThemeSetting,
      updateCurrentPage,
      currentPage,
      updateLearnedLessons,
      learnedLessons,
      toggleHighlightIdenticalValues,
      highlightIdenticalValuesSetting,
      toggleHighlightBox,
      highlightBoxSetting,
      toggleHighlightRow,
      highlightRowSetting,
      toggleHighlightColumn,
      highlightColumnSetting,
    }),
    [
      toggleTheme,
      darkThemeSetting,
      updateCurrentPage,
      currentPage,
      updateLearnedLessons,
      learnedLessons,
      toggleHighlightIdenticalValues,
      highlightIdenticalValuesSetting,
      toggleHighlightBox,
      highlightBoxSetting,
      toggleHighlightRow,
      highlightRowSetting,
      toggleHighlightColumn,
      highlightColumnSetting,
    ]
  );

  return {
    theme,
    preferences,
  };
};
export default InitializeContext;
