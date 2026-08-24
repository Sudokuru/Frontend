import {
  DrillObjectProps,
  BoardObjectProps,
  ClassicGameStatistics,
  DrillGameStatistics,
  GameVariant,
  CellProps,
  ClassicObjectProps,
  PersistedHintPayload,
  ActiveHintState,
} from "./../../Functions/LocalDatabase";

import {
  doesCellHaveConflict as coreDoesCellHaveConflict,
  isMoveCorrect as coreIsMoveCorrect,
} from "./Core/Functions/CellFunctions";
import {
  doesCellHaveConflict as drillDoesCellHaveConflict,
  isMoveCorrect as drillIsMoveCorrect,
} from "./Drill/Functions/CellFunctions";

import {
  headerRowHintCount as coreHeaderRowHintCount,
  headerRowTitle as coreHeaderRowTitle,
} from "./Core/Functions/HeaderRowFunctions";
import {
  headerRowHintCount as drillHeaderRowHintCount,
  headerRowTitle as drillHeaderRowTitle,
} from "./Drill/Functions/HeaderRowFunctions";
import {
  formatTime,
  finishSudokuGame as coreFinishGameStatistics,
  handlePause as coreHandlePause,
} from "./Core/Functions/BoardFunctions";
import {
  finishSudokuGame as drillFinishGameStatistics,
  handlePause as drillHandlePause,
  getInitialPuzzleState as drillGetInitialPuzzleState,
} from "./Drill/Functions/BoardFunctions";
import { generateGame as coreGenerateGame } from "./Core/Functions/GenerateGameFunctions";
import { generateGame as drillGenerateGame } from "./Drill/Functions/GenerateGameFunctions";

import { EndGameModal as CoreEndGameModal } from "./Core/Components/EndGameModal";
import { EndGameModal as DrillEndGameModal } from "./Drill/Components/EndGameModal";

import { getSudokuBoardHint as coreGetSudokuBoardHint } from "./Core/Functions/HintFunctions";
import { getSudokuBoardHint as drillGetSudokuBoardHint } from "./Drill/Functions/HintFunctions";

import type { Board, ClassicBoard, DrillBoard } from "./SudokuBoard";
import React, { JSX } from "react";
import { SudokuStrategy } from "sudokuru";
import { toTitle } from "../../Functions/Utils";
import type { GameDifficulty } from "./Core/Functions/DifficultyFunctions";
import { DRILL_STRATEGIES } from "../../Functions/DrillStrategies";

export interface DashboardNavigationAction {
  screen: string;
  currentPage: string;
  params?: Record<string, string>;
}

export type HomeDashboardIcon =
  | "grid"
  | "image-filter-center-focus"
  | "school-outline"
  | "target"
  | "gamepad-variant-outline"
  | "account-multiple-outline"
  | "account-group-outline"
  | "lan"
  | "chart-line"
  | "account-cog-outline"
  | "puzzle-outline";

export interface HomeDashboardCardDescriptor {
  id: string;
  title: string;
  description: string;
  icon: HomeDashboardIcon;
  testID: string;
  badge?: string;
  status: "available" | "comingSoon";
  action?: DashboardNavigationAction;
}

export interface HomeResumeDescriptor {
  id: string;
  title: string;
  description: string;
  metadata: string;
  icon: HomeDashboardIcon;
  testID: string;
  category: "play" | "practice";
  action: DashboardNavigationAction;
}

export interface HomeDashboardFlags {
  featurePreview: boolean;
  drillMode: boolean;
}

export interface HomeDashboardConfig {
  variants: HomeDashboardCardDescriptor[];
  shortcutCatalogue: HomeDashboardCardDescriptor[];
  activeGameVariants: BoardObjectProps["variant"][];
}

export interface HomeHeroAction {
  title: string;
  description: string;
  label: string;
  action: DashboardNavigationAction;
}

export const getSudokuVariantCatalogue = (): HomeDashboardCardDescriptor[] => [
  {
    id: "classic",
    title: "Classic Sudoku",
    description: "Choose a difficulty and start a new puzzle.",
    icon: "grid",
    testID: "VariantClassicButton",
    status: "available",
    action: {
      screen: "PlayPage",
      currentPage: "PlayPage",
    },
  },
  {
    id: "focus",
    title: "Focus Sudoku",
    description: "Sudoku with the next region focused for fast play.",
    icon: "image-filter-center-focus",
    testID: "VariantFocusButton",
    badge: "Coming soon",
    status: "comingSoon",
  },
];

const CLASSIC_DIFFICULTIES: readonly GameDifficulty[] = [
  "novice",
  "amateur",
  "layman",
  "trainee",
  "protege",
  "professional",
  "pundit",
  "master",
  "grandmaster",
];

const getClassicDifficultyShortcuts = (): HomeDashboardCardDescriptor[] =>
  CLASSIC_DIFFICULTIES.map((difficulty) => ({
    id: `classic-${difficulty}`,
    title: `${toTitle(difficulty)} Puzzle`,
    description: `Start a Classic Sudoku puzzle at ${toTitle(difficulty)} difficulty.`,
    icon: "puzzle-outline",
    testID: `HomeClassic${toTitle(difficulty).replaceAll(" ", "")}Shortcut`,
    badge: "Classic",
    status: "available",
    action: {
      screen: "SudokuPage",
      currentPage: "SudokuPage",
      params: { action: "StartGame", difficulty },
    },
  }));

const getDrillStrategyShortcuts = (): HomeDashboardCardDescriptor[] =>
  DRILL_STRATEGIES.map((strategy) => ({
    id: `drill-${strategy.toLowerCase().replaceAll("_", "-")}`,
    title: `${toTitle(strategy)} Drill`,
    description: `Start a focused ${toTitle(strategy)} strategy drill.`,
    icon: "target",
    testID: `Home${toTitle(strategy).replaceAll(" ", "")}DrillShortcut`,
    badge: "Drill",
    status: "available",
    action: {
      screen: "DrillGame",
      currentPage: "DrillGame",
      params: { action: "StartGame", params: strategy },
    },
  }));

export const getHomeDashboardConfig = (
  flags: HomeDashboardFlags,
  completedLessons: number,
  totalLessons: number,
): HomeDashboardConfig => {
  const drillAvailable = flags.featurePreview && flags.drillMode;
  const shortcutCatalogue: HomeDashboardCardDescriptor[] = [
    {
      id: "play",
      title: "Play",
      description: "Choose a Sudoku variant or multiplayer mode.",
      icon: "gamepad-variant-outline",
      testID: "HomePlayButton",
      status: "available",
      action: {
        screen: "PlayModesPage",
        currentPage: "PlayModesPage",
        params: { query: "" },
      },
    },
    {
      id: "learn",
      title: "Learn Sudoku",
      description: `${completedLessons} of ${totalLessons} lessons complete`,
      icon: "school-outline",
      testID: "HomeLearnButton",
      status: "available",
      action: {
        screen: "LearnPage",
        currentPage: "LearnPage",
      },
    },
    {
      id: "multiplayer",
      title: "Multiplayer",
      description: "Browse online Battle and Co-op / Team modes.",
      icon: "account-multiple-outline",
      testID: "HomeMultiplayerButton",
      badge: "Coming soon",
      status: "available",
      action: {
        screen: "PlayModesPage",
        currentPage: "PlayModesPage",
        params: { query: "multiplayer" },
      },
    },
    {
      id: "coop",
      title: "Co-op / Team",
      description: "Browse collaborative LAN and online modes.",
      icon: "account-group-outline",
      testID: "HomeCoopButton",
      badge: "Coming soon",
      status: "available",
      action: {
        screen: "PlayModesPage",
        currentPage: "PlayModesPage",
        params: { query: "co-op / team" },
      },
    },
    {
      id: "lan",
      title: "LAN",
      description: "Browse local network Battle and Co-op / Team modes.",
      icon: "lan",
      testID: "HomeLanButton",
      badge: "Coming soon",
      status: "available",
      action: {
        screen: "PlayModesPage",
        currentPage: "PlayModesPage",
        params: { query: "lan" },
      },
    },
    {
      id: "statistics",
      title: "Statistics",
      description: "Review your scores and solving progress.",
      icon: "chart-line",
      testID: "HomeStatisticsButton",
      status: "available",
      action: {
        screen: "StatisticsPage",
        currentPage: "StatisticsPage",
      },
    },
    {
      id: "profile",
      title: "Profile",
      description: "Manage themes, preferences, and solving options.",
      icon: "account-cog-outline",
      testID: "HomeProfileButton",
      status: "available",
      action: {
        screen: "ProfilePage",
        currentPage: "ProfilePage",
      },
    },
  ];

  shortcutCatalogue.push(...getClassicDifficultyShortcuts());

  if (drillAvailable) {
    shortcutCatalogue.splice(2, 0, {
      id: "drill",
      title: "Practice a Strategy",
      description: "Practice individual Sudoku strategies.",
      icon: "target",
      testID: "HomeDrillButton",
      badge: "Preview",
      status: "available",
      action: {
        screen: "DrillPage",
        currentPage: "DrillPage",
      },
    });
    shortcutCatalogue.push(...getDrillStrategyShortcuts());
  }

  return {
    variants: getSudokuVariantCatalogue(),
    shortcutCatalogue,
    activeGameVariants: drillAvailable ? ["classic", "drill"] : ["classic"],
  };
};

export const getHomeResumeDescriptor = (
  game: BoardObjectProps,
): HomeResumeDescriptor => {
  switch (game.variant) {
    case "classic":
      return {
        id: "classic",
        title: "Classic Sudoku",
        description: `${toTitle(game.statistics.difficulty)} puzzle`,
        metadata: formatTime(game.statistics.time),
        icon: "grid",
        testID: "HomeResumeClassicButton",
        category: "play",
        action: {
          screen: "SudokuPage",
          currentPage: "SudokuPage",
          params: { action: "ResumeGame" },
        },
      };
    case "drill":
      return {
        id: "drill",
        title: "Strategy Drill",
        description: `${toTitle(game.statistics.difficulty)} practice`,
        metadata: formatTime(game.statistics.time),
        icon: "target",
        testID: "HomeResumeDrillButton",
        category: "practice",
        action: {
          screen: "DrillGame",
          currentPage: "DrillGame",
          params: { action: "ResumeGame" },
        },
      };
  }
};

export const getHomeHeroAction = (
  resumes: HomeResumeDescriptor[],
  variants: HomeDashboardCardDescriptor[],
): HomeHeroAction => {
  const playableResumes = resumes.filter((item) => item.category === "play");
  if (playableResumes.length === 1) {
    return {
      title: "Resume your puzzle",
      description:
        "Resume your saved Sudoku puzzle or choose another activity.",
      label: `Resume ${playableResumes[0].title}`,
      action: playableResumes[0].action,
    };
  }

  const firstAvailableVariant = variants.find(
    (variant) => variant.status === "available" && variant.action,
  );
  return {
    title: "Play Sudoku",
    description:
      "Choose a difficulty, take a lesson, or practice a solving strategy.",
    label: firstAvailableVariant
      ? `Play ${firstAvailableVariant.title}`
      : "Explore Sudoku",
    action: firstAvailableVariant?.action ?? {
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

export interface SudokuVariantMethods {
  doesCellHaveConflict(
    sudokuBoard: BoardObjectProps,
    r: number,
    c: number,
  ): boolean;
  isMoveCorrect(
    sudokuBoard: BoardObjectProps,
    r: number,
    c: number,
    currentEntry: CellProps,
  ): boolean;
  headerRowTitle(sudokuBoard: BoardObjectProps): string;
  headerRowHintCount(sudokuBoard: BoardObjectProps): string;
  finishSudokuGame(
    statistics: ClassicGameStatistics | DrillGameStatistics,
    variant: GameVariant,
  ): ClassicGameStatistics | DrillGameStatistics;
  generateGame(
    board: Board,
    initializeNotes: boolean,
  ): Promise<BoardObjectProps | null>;
  handlePause(sudokuBoard: BoardObjectProps, navigation: any): void;
  getEndGameModal({
    statistics,
  }: {
    statistics: ClassicGameStatistics | DrillGameStatistics;
  }): JSX.Element;
  hasResetActionButton(): boolean;
  hasEraseActionButton(): boolean;
  getInitialPuzzleState(sudokuBoard: BoardObjectProps): CellProps[][];
  getHintPreviewBase(
    sudokuBoard: BoardObjectProps,
    activeHint: ActiveHintState,
  ): CellProps[][];
  getSudokuBoardHint: (
    sudokuBoard: BoardObjectProps,
    strategyArray: SudokuStrategy[],
  ) => {
    hint: PersistedHintPayload;
    updatedBoard: BoardObjectProps;
  };
}

// Default methods for all variants
const defaultMethods: SudokuVariantMethods = {
  doesCellHaveConflict(sudokuBoard: BoardObjectProps, r: number, c: number) {
    return coreDoesCellHaveConflict(sudokuBoard, r, c);
  },
  isMoveCorrect(
    sudokuBoard: BoardObjectProps,
    r: number,
    c: number,
    currentEntry: CellProps,
  ) {
    return coreIsMoveCorrect(sudokuBoard, r, c, currentEntry);
  },
  headerRowTitle(sudokuBoard: BoardObjectProps) {
    return coreHeaderRowTitle(sudokuBoard);
  },
  headerRowHintCount(sudokuBoard: BoardObjectProps) {
    return coreHeaderRowHintCount(sudokuBoard as ClassicObjectProps);
  },
  finishSudokuGame(
    statistics: ClassicGameStatistics,
    variant: GameVariant,
  ): ClassicGameStatistics {
    return coreFinishGameStatistics(statistics, variant);
  },
  generateGame(
    board: ClassicBoard,
    initializeNotes: boolean,
  ): Promise<BoardObjectProps | null> {
    return coreGenerateGame(board, initializeNotes);
  },
  handlePause(sudokuBoard: BoardObjectProps, navigation: any) {
    return coreHandlePause(sudokuBoard, navigation);
  },
  getEndGameModal({ statistics }: { statistics: ClassicGameStatistics }) {
    return React.createElement(CoreEndGameModal, { statistics });
  },
  hasResetActionButton(): boolean {
    return false;
  },
  // todo implement for classic - right now just returns empty array
  getInitialPuzzleState(sudokuBoard: ClassicObjectProps) {
    return Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => ({}) as CellProps),
    );
  },
  getHintPreviewBase(
    sudokuBoard: ClassicObjectProps,
    activeHint: ActiveHintState,
  ) {
    return activeHint.puzzleStateBeforeHint;
  },
  hasEraseActionButton(): boolean {
    return true;
  },
  getSudokuBoardHint(
    sudokuBoard: BoardObjectProps,
    strategyArray: SudokuStrategy[],
  ) {
    return coreGetSudokuBoardHint(
      sudokuBoard as ClassicObjectProps,
      strategyArray,
    );
  },
};

// Any per‐variant overrides (only override what you really need)
const overrides: Partial<Record<GameVariant, Partial<SudokuVariantMethods>>> = {
  drill: {
    doesCellHaveConflict(sudokuBoard: DrillObjectProps, r: number, c: number) {
      return drillDoesCellHaveConflict(sudokuBoard, r, c);
    },
    isMoveCorrect(
      sudokuBoard: DrillObjectProps,
      r: number,
      c: number,
      currentEntry: CellProps,
    ) {
      return drillIsMoveCorrect(sudokuBoard, r, c, currentEntry);
    },
    headerRowTitle(sudokuBoard: DrillObjectProps) {
      return drillHeaderRowTitle(sudokuBoard);
    },
    headerRowHintCount(sudokuBoard: DrillObjectProps) {
      return drillHeaderRowHintCount(sudokuBoard);
    },
    finishSudokuGame(
      statistics: DrillGameStatistics,
      variant: GameVariant,
    ): DrillGameStatistics {
      return drillFinishGameStatistics(statistics, variant);
    },
    generateGame(
      board: DrillBoard,
      initializeNotes: boolean,
    ): Promise<BoardObjectProps | null> {
      return drillGenerateGame(board, initializeNotes);
    },
    handlePause(sudokuBoard: BoardObjectProps, navigation: any) {
      return drillHandlePause(sudokuBoard, navigation);
    },
    getEndGameModal({ statistics }: { statistics: DrillGameStatistics }) {
      return React.createElement(DrillEndGameModal, { statistics });
    },
    hasResetActionButton(): boolean {
      return true;
    },
    getInitialPuzzleState(sudokuBoard: DrillObjectProps) {
      return drillGetInitialPuzzleState(sudokuBoard);
    },
    getHintPreviewBase(sudokuBoard: DrillObjectProps) {
      return drillGetInitialPuzzleState(sudokuBoard);
    },
    hasEraseActionButton(): boolean {
      return false;
    },
    getSudokuBoardHint(
      sudokuBoard: BoardObjectProps,
      strategyArray: SudokuStrategy[],
    ) {
      return drillGetSudokuBoardHint(
        sudokuBoard as DrillObjectProps,
        strategyArray,
      );
    },
  },
  // classic has no overrides since classic is the default
  classic: {},
};

// Build the final runtime lookup by merging defaults + overrides
export const boardMethods: { [V in GameVariant]: SudokuVariantMethods } =
  Object.fromEntries(
    (Object.keys(overrides) as GameVariant[]).map((v) => [
      v,
      { ...defaultMethods, ...overrides[v] },
    ]),
  ) as { [V in GameVariant]: SudokuVariantMethods };
