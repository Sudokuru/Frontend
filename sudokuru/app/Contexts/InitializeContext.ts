import React from "react";
import { getProfile, setProfileValue } from "../Api/Profile";
import { SUDOKU_STRATEGY_ARRAY, SudokuStrategy } from "sudokuru";
import { Profile } from "../Api/Puzzle.Types";

// Example commit containing change to add context everywhere it needs to be:
// https://github.com/Sudokuru/Frontend/commit/0e6470735ab4c75a21e2fa61878f207b08bd3995
// Note: some stuff has moved e.g. from ProfilePage.tsx to ProfilePanel.tsx
// Theme is now handled in separate ThemeProvider via ThemeContext.tsx

const InitializeContext = () => {
  const [currentPage, setCurrentPage] = React.useState("Home");
  const [learnedLessons, setLearnedLessons] = React.useState(["NONE"]);
  const [highlightIdenticalValuesSetting, setHighlightIdenticalValuesSetting] =
    React.useState(true);
  const [highlightBoxSetting, setHighlightBoxSetting] = React.useState(true);
  const [highlightRowSetting, setHighlightRowSetting] = React.useState(true);
  const [highlightColumnSetting, setHighlightColumnSetting] =
    React.useState(true);

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
      setHighlightIdenticalValuesSetting(data.highlightIdenticalValues);
      setHighlightBoxSetting(data.highlightBox);
      setHighlightRowSetting(data.highlightRow);
      setHighlightColumnSetting(data.highlightColumn);
      setFeaturePreviewSetting(data.previewMode);
      setStrategyHintOrderSetting(data.strategyHintOrder);
      setProgressIndicatorSetting(data.progressIndicator);
      setInitializeNotesSetting(data.initializeNotes);
      setSimplifyNotesSetting(data.simplifyNotes);
    });
  }, []);

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
    preferences,
  };
};
export default InitializeContext;
