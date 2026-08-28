import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getActiveGame } from "../../Api/Puzzles";
import { getLearnedLessons } from "../../Api/Statistics";
import { getStrategies } from "../../Api/Lessons";
import { BoardObjectProps } from "../../Functions/LocalDatabase";
import {
  getHomeDashboardConfig,
  getHomeHeroAction,
  getHomeResumeDescriptor,
  getHomeSupportingResumes,
  HOME_DEFAULT_DIFFICULTY,
} from "../SudokuBoard/SudokuBoardSharedFunctionsController";
import type {
  HomeDashboardFlags,
  HomeDifficulty,
} from "../SudokuBoard/SudokuBoardSharedFunctionsController";

interface HomeDashboardState {
  activeGames: BoardObjectProps[];
  learnedLessons: string[];
  isLoading: boolean;
  hasError: boolean;
}

export const useHomeDashboardData = (
  flags: HomeDashboardFlags,
  selectedDifficulty: HomeDifficulty = HOME_DEFAULT_DIFFICULTY,
) => {
  const { featurePreview, drillMode } = flags;
  const [refreshRequest, setRefreshRequest] = React.useState(0);
  const [state, setState] = React.useState<HomeDashboardState>({
    activeGames: [],
    learnedLessons: [],
    isLoading: true,
    hasError: false,
  });

  const lessons = getStrategies();
  const completedLessons = lessons.filter((lesson) =>
    state.learnedLessons.includes(lesson),
  ).length;
  const config = getHomeDashboardConfig(
    { featurePreview, drillMode },
    completedLessons,
    lessons.length,
  );
  const resumes = state.activeGames.map(getHomeResumeDescriptor);
  const heroAction = getHomeHeroAction(
    resumes,
    config.variants,
    selectedDifficulty,
  );
  const supportingResumes = getHomeSupportingResumes(resumes);

  useFocusEffect(
    React.useCallback(() => {
      let shouldUpdate = true;
      setState((current) => ({
        ...current,
        isLoading: true,
        hasError: refreshRequest === 0 ? current.hasError : false,
      }));

      const loadDashboard = async () => {
        const loadingConfig = getHomeDashboardConfig(
          { featurePreview, drillMode },
          0,
          lessons.length,
        );
        const activeGamesPromise = Promise.allSettled(
          loadingConfig.activeGameVariants.map(getActiveGame),
        );
        const lessonsPromise = Promise.allSettled([getLearnedLessons()]);
        const [activeGameResults, lessonsResults] = await Promise.all([
          activeGamesPromise,
          lessonsPromise,
        ]);

        if (!shouldUpdate) return;

        const activeGames = activeGameResults.flatMap((result) =>
          result.status === "fulfilled" && result.value ? [result.value] : [],
        );

        setState({
          activeGames,
          learnedLessons:
            lessonsResults[0].status === "fulfilled"
              ? lessonsResults[0].value
              : [],
          isLoading: false,
          hasError: activeGameResults.some(
            (result) => result.status === "rejected",
          ),
        });
      };

      void loadDashboard();
      return () => {
        shouldUpdate = false;
      };
    }, [featurePreview, drillMode, lessons.length, refreshRequest]),
  );

  return {
    ...state,
    completedLessons,
    totalLessons: lessons.length,
    config,
    resumes,
    supportingResumes,
    heroAction,
    refresh: () => setRefreshRequest((request) => request + 1),
  };
};
