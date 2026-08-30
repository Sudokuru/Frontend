import { HOME_DEFAULT_DIFFICULTY } from "../../Api/HomePreferences";
import type { GameDifficulty } from "../../Functions/GameDifficulties";
import type { SudokuResumeSnapshot } from "../SudokuBoard/SudokuBoardSharedFunctionsController";
import { formatTime } from "../../Functions/Utils";
import {
  getQuickStartSudokuMode,
  getSudokuMode,
  getSudokuModeCatalogue,
  getSudokuModeShortcuts,
} from "../../SudokuModes/SudokuModeRegistry";
import type {
  DashboardIcon,
  DashboardNavigationAction,
  HomeShortcutCategory,
  SudokuDifficultyOption,
  SudokuModeCardDescriptor,
  SudokuModeFlags,
} from "../../SudokuModes/SudokuModeRegistry";

export type {
  DashboardNavigationAction,
  HomeShortcutCategory,
  SudokuModeFlags as HomeDashboardFlags,
};

export interface HomeDashboardCardDescriptor extends SudokuModeCardDescriptor {
  shortcutCategory?: HomeShortcutCategory;
}

export interface HomeResumeDescriptor {
  id: string;
  title: string;
  description: string;
  metadata: string;
  icon: DashboardIcon;
  testID: string;
  category: "play" | "practice";
  action: DashboardNavigationAction;
}

export interface HomeDashboardConfig {
  variants: HomeDashboardCardDescriptor[];
  shortcutCatalogue: HomeDashboardCardDescriptor[];
}

export interface HomeHeroAction {
  title: string;
  description: string;
  label: string;
  testID: string;
  action: DashboardNavigationAction;
  difficultyOptions?: readonly SudokuDifficultyOption[];
}

const STATIC_HOME_SHORTCUTS = (
  completedLessons: number,
  totalLessons: number,
): (HomeDashboardCardDescriptor & { homeOrder: number })[] => [
  {
    id: "play",
    title: "Play",
    description: "Choose a Sudoku variant.",
    icon: "play",
    testID: "HomePlayButton",
    status: "available",
    shortcutCategory: "activities",
    homeOrder: 0,
    action: {
      screen: "PlayModesPage",
      currentPage: "PlayModesPage",
    },
  },
  {
    id: "learn",
    title: "Learn Sudoku",
    description: `${completedLessons} of ${totalLessons} lessons complete`,
    icon: "book-open-page-variant",
    testID: "HomeLearnButton",
    status: "available",
    shortcutCategory: "activities",
    homeOrder: 10,
    action: {
      screen: "LearnPage",
      currentPage: "LearnPage",
    },
  },
  {
    id: "statistics",
    title: "Statistics",
    description: "Review your scores and solving progress.",
    icon: "chart-line",
    testID: "HomeStatisticsButton",
    status: "available",
    shortcutCategory: "account",
    homeOrder: 30,
    action: {
      screen: "StatisticsPage",
      currentPage: "StatisticsPage",
    },
  },
  {
    id: "profile",
    title: "Profile",
    description: "Manage themes, preferences, and solving options.",
    icon: "account-details",
    testID: "HomeProfileButton",
    status: "available",
    shortcutCategory: "account",
    homeOrder: 40,
    action: {
      screen: "ProfilePage",
      currentPage: "ProfilePage",
    },
  },
];

export const getHomeDashboardConfig = (
  flags: SudokuModeFlags,
  completedLessons: number,
  totalLessons: number,
): HomeDashboardConfig => {
  const shortcutCatalogue = [
    ...STATIC_HOME_SHORTCUTS(completedLessons, totalLessons),
    ...getSudokuModeShortcuts(flags),
  ]
    .sort((left, right) => left.homeOrder - right.homeOrder)
    .map(({ homeOrder, ...shortcut }) => shortcut);

  return {
    variants: getSudokuModeCatalogue(flags),
    shortcutCatalogue,
  };
};

export const getHomeResumeDescriptor = (
  snapshot: SudokuResumeSnapshot,
): HomeResumeDescriptor => {
  const mode = getSudokuMode(snapshot.modeId);
  if (!mode) throw new Error(`Unknown Sudoku mode: ${snapshot.modeId}`);

  return {
    id: mode.id,
    title: mode.resume.title,
    description: `${snapshot.detail} ${mode.resume.descriptionSuffix}`,
    metadata: formatTime(snapshot.elapsedSeconds),
    icon: mode.resume.icon,
    testID: mode.resume.testID,
    category: mode.resume.category,
    action: mode.resume.action,
  };
};

export const getHomeHeroAction = (
  resumes: HomeResumeDescriptor[],
  flags: SudokuModeFlags,
  selectedDifficulty: GameDifficulty = HOME_DEFAULT_DIFFICULTY,
): HomeHeroAction => {
  const playableResumes = resumes.filter((item) => item.category === "play");
  if (playableResumes.length === 1) {
    return {
      title: "Resume your puzzle",
      description: "Resume your saved Sudoku puzzle.",
      label: "Resume Puzzle",
      testID: playableResumes[0].testID,
      action: playableResumes[0].action,
    };
  }

  const quickStart = getQuickStartSudokuMode(flags)?.quickStart;
  if (quickStart) {
    return {
      title: quickStart.title,
      description: quickStart.description,
      label: quickStart.label,
      testID: quickStart.testID,
      action: quickStart.getAction(selectedDifficulty),
      difficultyOptions: quickStart.difficultyOptions,
    };
  }

  const firstAvailableMode = getSudokuModeCatalogue(flags).find(
    (mode) => mode.status === "available" && mode.action,
  );
  return {
    title: "Play Sudoku",
    description: "Choose a Sudoku mode to play.",
    label: firstAvailableMode ? "Play Sudoku" : "Explore Sudoku",
    testID: "HomeHeroActionButton",
    action: firstAvailableMode?.action ?? {
      screen: "HomePage",
      currentPage: "HomePage",
    },
  };
};

export const getHomeSupportingResumes = (
  resumes: HomeResumeDescriptor[],
): HomeResumeDescriptor[] => {
  const playableResumes = resumes.filter((item) => item.category === "play");
  return playableResumes.length === 1
    ? resumes.filter((item) => item.category !== "play")
    : resumes;
};
