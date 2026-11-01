import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getLearnedLessons } from "../../Api/Statistics";
import { getStrategies } from "../../Api/Lessons";
import {
  getHomeHeroAction,
  getHomeShortcutCatalogue,
  getHomeSupportingResumes,
} from "./HomeDashboard";
import type { HomeDashboardFlags, HomeResumeDescriptor } from "./HomeDashboard";
import { HOME_DEFAULT_DIFFICULTY } from "../../Api/HomePreferences";
import { getSudokuModeResumeCards } from "../../SudokuModes/SudokuModeRegistry";
import type { GameDifficulty } from "../../Functions/GameDifficulties";

interface HomeDashboardState {
  resumes: HomeResumeDescriptor[];
  learnedLessons: string[];
  isLoading: boolean;
}

export const useHomeDashboardData = (
  flags: HomeDashboardFlags,
  selectedDifficulty: GameDifficulty = HOME_DEFAULT_DIFFICULTY,
) => {
  const { featurePreview, drillMode } = flags;
  const [state, setState] = React.useState<HomeDashboardState>({
    resumes: [],
    learnedLessons: [],
    isLoading: true,
  });

  const lessons = getStrategies();
  const completedLessons = lessons.filter((lesson) =>
    state.learnedLessons.includes(lesson),
  ).length;
  const shortcutCatalogue = getHomeShortcutCatalogue(
    { featurePreview, drillMode },
    completedLessons,
    lessons.length,
  );
  const heroAction = getHomeHeroAction(
    state.resumes,
    { featurePreview, drillMode },
    selectedDifficulty,
  );
  const supportingResumes = getHomeSupportingResumes(state.resumes);

  useFocusEffect(
    React.useCallback(() => {
      let shouldUpdate = true;
      setState((current) => ({
        ...current,
        isLoading: true,
      }));

      const loadDashboard = async () => {
        const [resumeResults, lessonsResults] = await Promise.allSettled([
          getSudokuModeResumeCards({ featurePreview, drillMode }),
          getLearnedLessons(),
        ]);

        if (!shouldUpdate) return;

        setState({
          resumes:
            resumeResults.status === "fulfilled" ? resumeResults.value : [],
          learnedLessons:
            lessonsResults.status === "fulfilled" ? lessonsResults.value : [],
          isLoading: false,
        });
      };

      void loadDashboard();
      return () => {
        shouldUpdate = false;
      };
    }, [featurePreview, drillMode]),
  );

  return {
    isLoading: state.isLoading,
    shortcutCatalogue,
    supportingResumes,
    heroAction,
  };
};
