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

  const [drillModeSetting, setDrillModeSetting] = React.useState(true);

  const [progressIndicatorSetting, setProgressIndicatorSetting] =
    React.useState(true);

  const [initializeNotesSetting, setInitializeNotesSetting] =
    React.useState(true);

  const [simplifyNotesSetting, setSimplifyNotesSetting] = React.useState(true);

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
      setDrillModeSetting(data.drillMode);
      setProgressIndicatorSetting(data.progressIndicator);
      setInitializeNotesSetting(data.initializeNotes);
      setSimplifyNotesSetting(data.simplifyNotes);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage],
  );

  const updateLearnedLessons = React.useCallback(
    (props: React.SetStateAction<string[]>) => {
      return setLearnedLessons(props);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [learnedLessons],
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

  const toggleDrillMode = React.useCallback(() => {
    setProfileValue("drillMode");
    return setDrillModeSetting(!drillModeSetting);
  }, [drillModeSetting]);

  const toggleProgressIndicator = React.useCallback(() => {
    setProfileValue("progressIndicator");
    return setProgressIndicatorSetting(!progressIndicatorSetting);
  }, [progressIndicatorSetting]);

  const toggleInitializeNotes = React.useCallback(() => {
    setProfileValue("initializeNotes");
    return setInitializeNotesSetting(!initializeNotesSetting);
  }, [initializeNotesSetting]);

  const toggleSimplifyNotes = React.useCallback(() => {
    setProfileValue("simplifyNotes");
    return setSimplifyNotesSetting(!simplifyNotesSetting);
  }, [simplifyNotesSetting]);

  const toggleFeaturePreview = React.useCallback(() => {
    setProfileValue("previewMode");
    return setFeaturePreviewSetting(!featurePreviewSetting);
  }, [featurePreviewSetting]);

  const updateStrategyHintOrder = React.useCallback(
    (props: React.SetStateAction<SudokuStrategy[]>) => {
      setProfileValue("strategyHintOrder", props);
      return setStrategyHintOrderSetting(props);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [strategyHintOrderSetting],
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
      toggleDrillMode,
      drillModeSetting,
      toggleProgressIndicator,
      progressIndicatorSetting,
      toggleInitializeNotes,
      initializeNotesSetting,
      toggleSimplifyNotes,
      simplifyNotesSetting,
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
      toggleDrillMode,
      drillModeSetting,
      toggleProgressIndicator,
      progressIndicatorSetting,
      toggleInitializeNotes,
      initializeNotesSetting,
      toggleSimplifyNotes,
      simplifyNotesSetting,
      toggleFeaturePreview,
      featurePreviewSetting,
      updateStrategyHintOrder,
      strategyHintOrderSetting,
    ],
  );

  return {
    theme,
    preferences,
  };
};
export default InitializeContext;
