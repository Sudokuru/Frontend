import React from "react";
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
} from "../Styling/ThemeColors";
import { getProfile, setProfileValue } from "../Api/Profile";
import { SUDOKU_STRATEGY_ARRAY, SudokuStrategy } from "sudokuru";
import { Profile } from "../Api/Puzzle.Types";

const InitializeContext = () => {
  const [darkThemeSetting, setDarkThemeSetting] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState("Home");
  const [learnedLessons, setLearnedLessons] = React.useState(["NONE"]);
  const [highlightIdenticalValuesSetting, setHighlightIdenticalValuesSetting] =
    React.useState(true);
  const [highlightBoxSetting, setHighlightBoxSetting] = React.useState(true);
  const [highlightRowSetting, setHighlightRowSetting] = React.useState(true);
  const [highlightColumnSetting, setHighlightColumnSetting] =
    React.useState(true);

  const [progressIndicatorSetting, setProgressIndicatorSetting] = React.useState(true);

  const [featurePreviewSetting, setFeaturePreviewSetting] =
    React.useState(false);

  const [strategyHintOrderSetting, setStrategyHintOrderSetting] =
    React.useState<SudokuStrategy[]>(SUDOKU_STRATEGY_ARRAY);

  // set initial values of theme
  React.useEffect(() => {
    getProfile().then((data: Profile) => {
      setDarkThemeSetting(data.theme);
      setHighlightIdenticalValuesSetting(data.highlightIdenticalValues);
      setHighlightBoxSetting(data.highlightBox);
      setHighlightRowSetting(data.highlightRow);
      setHighlightColumnSetting(data.highlightColumn);
      setFeaturePreviewSetting(data.previewMode);
      setStrategyHintOrderSetting(data.strategyHintOrder);
      setProgressIndicatorSetting(data.progressIndicator)
    });
  }, []);

  const theme = darkThemeSetting ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = React.useCallback(() => {
    setProfileValue("theme");
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
    setProfileValue("highlightIdenticalValues");
    return setHighlightIdenticalValuesSetting(!highlightIdenticalValuesSetting);
  }, [highlightIdenticalValuesSetting]);

  const toggleHighlightBox = React.useCallback(() => {
    setProfileValue("highlightBox");
    return setHighlightBoxSetting(!highlightBoxSetting);
  }, [highlightBoxSetting]);

  const toggleHighlightRow = React.useCallback(() => {
    setProfileValue("highlightRow");
    return setHighlightRowSetting(!highlightRowSetting);
  }, [highlightRowSetting]);

  const toggleHighlightColumn = React.useCallback(() => {
    setProfileValue("highlightColumn");
    return setHighlightColumnSetting(!highlightColumnSetting);
  }, [highlightColumnSetting]);

  const toggleProgressIndicator = React.useCallback(() => {
    setProfileValue("progressIndicator");
    return setProgressIndicatorSetting(!progressIndicatorSetting);
  }, [progressIndicatorSetting]);

  const toggleFeaturePreview = React.useCallback(() => {
    setProfileValue("previewMode");
    return setFeaturePreviewSetting(!featurePreviewSetting);
  }, [featurePreviewSetting]);

  const updateStrategyHintOrder = React.useCallback(
    (props: React.SetStateAction<SudokuStrategy[]>) => {
      setProfileValue("strategyHintOrder", props);
      return setStrategyHintOrderSetting(props);
    },
    [strategyHintOrderSetting]
  );

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
      toggleProgressIndicator,
      progressIndicatorSetting,
      toggleFeaturePreview,
      featurePreviewSetting,
      updateStrategyHintOrder,
      strategyHintOrderSetting,
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
      toggleProgressIndicator,
      progressIndicatorSetting,
      toggleFeaturePreview,
      featurePreviewSetting,
      updateStrategyHintOrder,
      strategyHintOrderSetting,
    ]
  );

  return {
    theme,
    preferences,
  };
};
export default InitializeContext;
