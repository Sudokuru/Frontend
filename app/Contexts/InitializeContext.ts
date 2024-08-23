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
  const [highlightIdenticalValuesSetting, setHighlightIdenticalValuesSetting] =
    React.useState(true);
  const [highlightBoxSetting, setHighlightBoxSetting] = React.useState(true);
  const [highlightRowSetting, setHighlightRowSetting] = React.useState(true);
  const [highlightColumnSetting, setHighlightColumnSetting] =
    React.useState(true);

  const [featurePreviewSetting, setFeaturePreviewSetting] =
    React.useState(false);

  // set initial values of theme
  React.useEffect(() => {
    Profile.getProfile().then((data: profile) => {
      setDarkThemeSetting(data.theme);
      setHighlightIdenticalValuesSetting(data.highlightIdenticalValues);
      setHighlightBoxSetting(data.highlightBox);
      setHighlightRowSetting(data.highlightRow);
      setHighlightColumnSetting(data.highlightColumn);
      setFeaturePreviewSetting(data.previewMode);
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
    return setHighlightIdenticalValuesSetting(!highlightIdenticalValuesSetting);
  }, [highlightIdenticalValuesSetting]);

  const toggleHighlightBox = React.useCallback(() => {
    Profile.setProfileValue("highlightBox");
    return setHighlightBoxSetting(!highlightBoxSetting);
  }, [highlightBoxSetting]);

  const toggleHighlightRow = React.useCallback(() => {
    Profile.setProfileValue("highlightRow");
    return setHighlightRowSetting(!highlightRowSetting);
  }, [highlightRowSetting]);

  const toggleHighlightColumn = React.useCallback(() => {
    Profile.setProfileValue("highlightColumn");
    return setHighlightColumnSetting(!highlightColumnSetting);
  }, [highlightColumnSetting]);

  const toggleFeaturePreview = React.useCallback(() => {
    Profile.setProfileValue("previewMode");
    return setFeaturePreviewSetting(!featurePreviewSetting);
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
