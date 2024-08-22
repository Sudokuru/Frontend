import React from "react";
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
} from "../Styling/ThemeColors";
import { profile } from "../Api/Puzzle.Types";
import { Profile } from "../Api/Profile";

const InitializeContext = () => {
  const [darkThemeSetting, setDarkThemeSetting] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState("Landing");
  const [learnedLessons, setLearnedLessons] = React.useState(["NONE"]);
  const [highlightIdenticalValuesSetting, setHighlightIdenticalValues] =
    React.useState(true);
  const [highlightBoxSetting, setHighlightBox] = React.useState(true);
  const [highlightRowSetting, setHighlightRow] = React.useState(true);
  const [highlightColumnSetting, setHighlightColumn] = React.useState(true);

  const [featurePreviewSetting, setFeaturePreview] = React.useState(false);

  // set initial values of theme
  React.useEffect(() => {
    Profile.getProfile().then((data: profile) => {
      setDarkThemeSetting(data.theme);
      setHighlightIdenticalValues(data.highlightIdenticalValues);
      setHighlightBox(data.highlightBox);
      setHighlightRow(data.highlightRow);
      setHighlightColumn(data.highlightColumn);
      setFeaturePreview(data.previewMode);
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

  const toggleFeaturePreview = React.useCallback(() => {
    Profile.setProfileValue("previewMode");
    return setFeaturePreview(!featurePreviewSetting);
  }, [featurePreviewSetting]);

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
      toggleFeaturePreview,
      featurePreviewSetting,
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
      toggleFeaturePreview,
      featurePreviewSetting,
    ]
  );

  return {
    theme,
    preferences,
  };
};
export default InitializeContext;
