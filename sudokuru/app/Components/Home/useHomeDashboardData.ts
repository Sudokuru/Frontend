import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getLearnedLessons } from "../../Api/Statistics";
import { getStrategies } from "../../Api/Lessons";
import { BoardObjectProps } from "../../Functions/LocalDatabase";
import {
  getHomeDashboardConfig,
  getHomeHeroAction,
  getHomeResumeDescriptor,
  getHomeSupportingResumes,
} from "./HomeDashboard";
import type { HomeDashboardFlags } from "./HomeDashboard";
import { HOME_DEFAULT_DIFFICULTY } from "../../Api/HomePreferences";
import { getSudokuResumeSnapshot } from "../SudokuBoard/SudokuBoardSharedFunctionsController";
import { getSudokuModeResumeProviders } from "../../SudokuModes/SudokuModeRegistry";
import type { GameDifficulty } from "../../Functions/GameDifficulties";

interface HomeDashboardState {
  activeGames: BoardObjectProps[];
  learnedLessons: string[];
  isLoading: boolean;
  hasError: boolean;
}

export const useHomeDashboardData = (
  flags: HomeDashboardFlags,
  selectedDifficulty: GameDifficulty = HOME_DEFAULT_DIFFICULTY,
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
  const resumes = state.activeGames.map((game) =>
    getHomeResumeDescriptor(getSudokuResumeSnapshot(game)),
  );
  const heroAction = getHomeHeroAction(
    resumes,
    { featurePreview, drillMode },
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
        const activeGamesPromise = Promise.allSettled(
          getSudokuModeResumeProviders({ featurePreview, drillMode }).map(
            (getActiveGame) => getActiveGame(),
          ),
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
    }, [featurePreview, drillMode, refreshRequest]),
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
