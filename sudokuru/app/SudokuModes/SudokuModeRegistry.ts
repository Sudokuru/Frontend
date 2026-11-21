import { GAME_DIFFICULTIES } from "../Functions/GameDifficulties";
import type { GameDifficulty } from "../Functions/GameDifficulties";
import { DRILL_STRATEGIES } from "../Functions/DrillStrategies";
import type { DrillStrategy } from "../Functions/DrillStrategies";
import type { BoardObjectProps } from "../Functions/LocalDatabase";
import { toTitle } from "../Functions/Utils";
import {
  getActiveClassicGame,
  getActiveDrillGame,
  getActiveFocusClassicGame,
  getActiveFocusDrillGame,
} from "../Api/Puzzles";

export interface DashboardNavigationAction {
  screen: string;
  currentPage: string;
  params?: Record<string, string>;
}

export type DashboardIcon =
  | "grid"
  | "image-filter-center-focus"
  | "target"
  | "puzzle-outline"
  | "play"
  | "book-open-page-variant"
  | "chart-line"
  | "account-details"
  | "whistle";

export type HomeShortcutCategory =
  | "activities"
  | "difficulties"
  | "strategies"
  | "account";

export interface SudokuModeFlags {
  featurePreview: boolean;
  drillMode: boolean;
}

export interface SudokuDifficultyOption {
  label: string;
  value: GameDifficulty;
}

export type SudokuModeSection = "play" | "drill";

export interface SudokuModeCardDescriptor {
  id: string;
  title: string;
  description: string;
  icon: DashboardIcon;
  testID: string;
  badge?: string;
  status: "available" | "comingSoon";
  action?: DashboardNavigationAction;
  section?: SudokuModeSection;
}

export interface SudokuModeShortcutDescriptor extends SudokuModeCardDescriptor {
  id: SudokuModeShortcutId;
  shortcutCategory: HomeShortcutCategory;
  homeOrder: number;
}

interface SudokuModeQuickStart {
  title: string;
  description: string;
  label: string;
  testID: string;
  homeOrder: number;
  difficultyOptions?: readonly SudokuDifficultyOption[];
  getAction: (difficulty: GameDifficulty) => DashboardNavigationAction;
}

export interface HomeResumeDescriptor {
  id: string;
  title: string;
  description: string;
  testID: string;
  category: "play" | "practice";
  action: DashboardNavigationAction;
}

interface SudokuModeDefinition {
  id: BoardObjectProps["variant"];
  isAvailable: (flags: SudokuModeFlags) => boolean;
  catalogue?: SudokuModeCardDescriptor;
  quickStart?: SudokuModeQuickStart;
  shortcuts: readonly SudokuModeShortcutDescriptor[];
  getResumeCard: (game: BoardObjectProps) => HomeResumeDescriptor;
  getActiveGame: () => Promise<BoardObjectProps | null>;
}

type SudokuModeRegistry = {
  [Variant in BoardObjectProps["variant"]]: SudokuModeDefinition & {
    id: Variant;
  };
};

type KebabCase<Value extends string> =
  Value extends `${infer Head}_${infer Tail}`
    ? `${Lowercase<Head>}-${KebabCase<Tail>}`
    : Lowercase<Value>;

type ClassicHomeShortcutId = `classic-${GameDifficulty}`;
type FocusClassicHomeShortcutId = `focus-classic-${GameDifficulty}`;
type DrillStrategyHomeShortcutId = `drill-${KebabCase<DrillStrategy>}`;
type FocusDrillStrategyHomeShortcutId =
  `focus-drill-${KebabCase<DrillStrategy>}`;
export type SudokuModeShortcutId =
  | "drill"
  | "focus-classic"
  | "focus-drill"
  | ClassicHomeShortcutId
  | FocusClassicHomeShortcutId
  | DrillStrategyHomeShortcutId
  | FocusDrillStrategyHomeShortcutId;

const getClassicHomeShortcutId = (
  difficulty: GameDifficulty,
): ClassicHomeShortcutId => `classic-${difficulty}`;

const getFocusClassicHomeShortcutId = (
  difficulty: GameDifficulty,
): FocusClassicHomeShortcutId => `focus-classic-${difficulty}`;

const DRILL_HOME_SHORTCUT_IDS: {
  [Strategy in DrillStrategy]: `drill-${KebabCase<Strategy>}`;
} = {
  OBVIOUS_SINGLE: "drill-obvious-single",
  OBVIOUS_PAIR: "drill-obvious-pair",
  OBVIOUS_TRIPLET: "drill-obvious-triplet",
  OBVIOUS_QUADRUPLET: "drill-obvious-quadruplet",
  HIDDEN_SINGLE: "drill-hidden-single",
  HIDDEN_PAIR: "drill-hidden-pair",
  HIDDEN_TRIPLET: "drill-hidden-triplet",
  HIDDEN_QUADRUPLET: "drill-hidden-quadruplet",
  POINTING_PAIR: "drill-pointing-pair",
  POINTING_TRIPLET: "drill-pointing-triplet",
};

const getDrillHomeShortcutId = (
  strategy: DrillStrategy,
): DrillStrategyHomeShortcutId => DRILL_HOME_SHORTCUT_IDS[strategy];

const FOCUS_DRILL_HOME_SHORTCUT_IDS: {
  [Strategy in DrillStrategy]: `focus-drill-${KebabCase<Strategy>}`;
} = {
  OBVIOUS_SINGLE: "focus-drill-obvious-single",
  OBVIOUS_PAIR: "focus-drill-obvious-pair",
  OBVIOUS_TRIPLET: "focus-drill-obvious-triplet",
  OBVIOUS_QUADRUPLET: "focus-drill-obvious-quadruplet",
  HIDDEN_SINGLE: "focus-drill-hidden-single",
  HIDDEN_PAIR: "focus-drill-hidden-pair",
  HIDDEN_TRIPLET: "focus-drill-hidden-triplet",
  HIDDEN_QUADRUPLET: "focus-drill-hidden-quadruplet",
  POINTING_PAIR: "focus-drill-pointing-pair",
  POINTING_TRIPLET: "focus-drill-pointing-triplet",
};

const getFocusDrillHomeShortcutId = (
  strategy: DrillStrategy,
): FocusDrillStrategyHomeShortcutId => FOCUS_DRILL_HOME_SHORTCUT_IDS[strategy];

const DIFFICULTY_OPTIONS: readonly SudokuDifficultyOption[] =
  GAME_DIFFICULTIES.map((difficulty) => ({
    label: toTitle(difficulty),
    value: difficulty,
  }));

const CLASSIC_SHORTCUTS: readonly SudokuModeShortcutDescriptor[] =
  GAME_DIFFICULTIES.map((difficulty, index) => ({
    id: getClassicHomeShortcutId(difficulty),
    title: `${toTitle(difficulty)} Puzzle`,
    description: `Start a Classic Sudoku puzzle at ${toTitle(difficulty)} difficulty.`,
    icon: "puzzle-outline",
    testID: `HomeClassic${toTitle(difficulty).replaceAll(" ", "")}Shortcut`,
    badge: "Classic",
    status: "available",
    shortcutCategory: "difficulties",
    homeOrder: 100 + index,
    action: {
      screen: "SudokuPage",
      currentPage: "SudokuPage",
      params: { action: "StartGame", difficulty, focus: "false" },
    },
  }));

const FOCUS_CLASSIC_SHORTCUTS: readonly SudokuModeShortcutDescriptor[] =
  GAME_DIFFICULTIES.map((difficulty, index) => ({
    id: getFocusClassicHomeShortcutId(difficulty),
    title: `${toTitle(difficulty)} Focus Puzzle`,
    description: `Start a Focus Mode Classic puzzle at ${toTitle(difficulty)} difficulty.`,
    icon: "image-filter-center-focus" as const,
    testID: `HomeFocusClassic${toTitle(difficulty).replaceAll(" ", "")}Shortcut`,
    badge: "Focus",
    status: "available" as const,
    shortcutCategory: "difficulties" as const,
    homeOrder: 110 + index,
    action: {
      screen: "SudokuPage",
      currentPage: "SudokuPage",
      params: { action: "StartGame", difficulty, focus: "true" },
    },
  }));

const DRILL_SHORTCUTS: readonly SudokuModeShortcutDescriptor[] = [
  {
    id: "drill",
    title: "Practice a Strategy",
    description: "Practice individual Sudoku strategies.",
    icon: "whistle",
    testID: "HomeDrillButton",
    badge: "Preview",
    status: "available",
    shortcutCategory: "activities",
    homeOrder: 20,
    action: {
      screen: "ModeVariantsPage",
      currentPage: "DrillPage",
      params: { game: "drill" },
    },
  },
  ...DRILL_STRATEGIES.map((strategy, index) => ({
    id: getDrillHomeShortcutId(strategy),
    title: `${toTitle(strategy)} Drill`,
    description: `Start a focused ${toTitle(strategy)} strategy drill.`,
    icon: "whistle" as const,
    testID: `Home${toTitle(strategy).replaceAll(" ", "")}DrillShortcut`,
    badge: "Drill",
    status: "available" as const,
    shortcutCategory: "strategies" as const,
    homeOrder: 200 + index,
    action: {
      screen: "DrillGame",
      currentPage: "DrillGame",
      params: { action: "StartGame", params: strategy, focus: "false" },
    },
  })),
];

const FOCUS_DRILL_SHORTCUTS: readonly SudokuModeShortcutDescriptor[] = [
  ...DRILL_STRATEGIES.map((strategy, index) => ({
    id: getFocusDrillHomeShortcutId(strategy),
    title: `${toTitle(strategy)} Focus Drill`,
    description: `Start a guided ${toTitle(strategy)} Focus Mode drill.`,
    icon: "target" as const,
    testID: `HomeFocus${toTitle(strategy).replaceAll(" ", "")}DrillShortcut`,
    badge: "Focus",
    status: "available" as const,
    shortcutCategory: "strategies" as const,
    homeOrder: 210 + index,
    action: {
      screen: "DrillGame",
      currentPage: "DrillGame",
      params: { action: "StartGame", params: strategy, focus: "true" },
    },
  })),
];

const SUDOKU_MODE_REGISTRY = {
  classic: {
    id: "classic",
    isAvailable: () => true,
    catalogue: {
      id: "classic",
      title: "Classic",
      description: "Choose a difficulty and start a new Classic puzzle.",
      icon: "grid",
      testID: "VariantClassicButton",
      status: "available",
      section: "play",
      action: {
        screen: "PlayPage",
        currentPage: "PlayPage",
        params: { focus: "false" },
      },
    },
    quickStart: {
      title: "Play Sudoku",
      description: "Choose a difficulty and start a new Sudoku puzzle.",
      label: "Play Sudoku",
      testID: "HomeHeroActionButton",
      homeOrder: 0,
      difficultyOptions: DIFFICULTY_OPTIONS,
      getAction: (difficulty: GameDifficulty) => ({
        screen: "SudokuPage",
        currentPage: "SudokuPage",
        params: { action: "StartGame", difficulty, focus: "false" },
      }),
    },
    shortcuts: CLASSIC_SHORTCUTS,
    getResumeCard: (game) => ({
      id: "classic",
      title: "Classic Sudoku",
      description: `${toTitle(game.statistics.difficulty)} puzzle`,
      testID: "HomeResumeClassicButton",
      category: "play",
      action: {
        screen: "SudokuPage",
        currentPage: "SudokuPage",
        params: { action: "ResumeGame", focus: "false" },
      },
    }),
    getActiveGame: getActiveClassicGame,
  },
  drill: {
    id: "drill",
    isAvailable: (flags: SudokuModeFlags) =>
      flags.featurePreview && flags.drillMode,
    catalogue: {
      id: "drill",
      title: "Classic Drill",
      description: "Practice individual Sudoku strategies.",
      icon: "whistle",
      testID: "VariantDrillButton",
      badge: "Preview",
      status: "available",
      section: "drill",
      action: {
        screen: "DrillPage",
        currentPage: "DrillPage",
        params: { focus: "false" },
      },
    },
    shortcuts: DRILL_SHORTCUTS,
    getResumeCard: (game) => ({
      id: "drill",
      title: "Strategy Drill",
      description: `${toTitle(game.statistics.difficulty)} practice`,
      testID: "HomeResumeDrillButton",
      category: "practice",
      action: {
        screen: "DrillGame",
        currentPage: "DrillGame",
        params: { action: "ResumeGame", focus: "false" },
      },
    }),
    getActiveGame: getActiveDrillGame,
  },
  "focus-classic": {
    id: "focus-classic",
    isAvailable: () => true,
    catalogue: {
      id: "focus-classic",
      title: "Focus Mode Classic",
      description:
        "Solve a full puzzle with a strategy, explanation, and region guiding every step.",
      icon: "image-filter-center-focus",
      testID: "VariantFocusClassicButton",
      status: "available",
      section: "play",
      action: {
        screen: "PlayPage",
        currentPage: "PlayPage",
        params: { focus: "true" },
      },
    },
    shortcuts: [
      {
        id: "focus-classic",
        title: "Focus Mode Classic",
        description: "Solve a guided Sudoku puzzle, one strategy at a time.",
        icon: "image-filter-center-focus",
        testID: "HomeFocusClassicButton",
        status: "available",
        shortcutCategory: "activities",
        homeOrder: 21,
        action: {
          screen: "PlayPage",
          currentPage: "PlayPage",
          params: { focus: "true" },
        },
      },
      ...FOCUS_CLASSIC_SHORTCUTS,
    ],
    getResumeCard: (game) => ({
      id: "focus-classic",
      title: "Focus Mode Classic",
      description: `${toTitle(game.statistics.difficulty)} guided puzzle`,
      testID: "HomeResumeFocusClassicButton",
      category: "play",
      action: {
        screen: "SudokuPage",
        currentPage: "SudokuPage",
        params: { action: "ResumeGame", focus: "true" },
      },
    }),
    getActiveGame: getActiveFocusClassicGame,
  },
  "focus-drill": {
    id: "focus-drill",
    isAvailable: (flags: SudokuModeFlags) =>
      flags.featurePreview && flags.drillMode,
    catalogue: {
      id: "focus-drill",
      title: "Focus Mode Drill",
      description:
        "Practice a strategy with its explanation and region always shown.",
      icon: "target",
      testID: "VariantFocusDrillButton",
      badge: "Preview",
      status: "available",
      section: "drill",
      action: {
        screen: "DrillPage",
        currentPage: "DrillPage",
        params: { focus: "true" },
      },
    },
    shortcuts: [
      {
        id: "focus-drill",
        title: "Focus Mode Drill",
        description:
          "Practice a strategy with its explanation and region always shown.",
        icon: "target",
        testID: "HomeFocusDrillButton",
        badge: "Preview",
        status: "available",
        shortcutCategory: "activities",
        homeOrder: 22,
        action: {
          screen: "DrillPage",
          currentPage: "DrillPage",
          params: { focus: "true" },
        },
      },
      ...FOCUS_DRILL_SHORTCUTS,
    ],
    getResumeCard: (game) => ({
      id: "focus-drill",
      title: "Focus Mode Drill",
      description: `${toTitle(game.statistics.difficulty)} guided practice`,
      testID: "HomeResumeFocusDrillButton",
      category: "practice",
      action: {
        screen: "DrillGame",
        currentPage: "DrillGame",
        params: { action: "ResumeGame", focus: "true" },
      },
    }),
    getActiveGame: getActiveFocusDrillGame,
  },
} satisfies SudokuModeRegistry;

const SUDOKU_MODES: readonly SudokuModeDefinition[] =
  Object.values(SUDOKU_MODE_REGISTRY);

export const SUDOKU_MODE_SHORTCUT_IDS: readonly SudokuModeShortcutId[] =
  SUDOKU_MODES.flatMap((mode) => mode.shortcuts).map((shortcut) => shortcut.id);

export const getAvailableSudokuModes = (flags: SudokuModeFlags) =>
  SUDOKU_MODES.filter((mode) => mode.isAvailable(flags));

export const getSudokuMode = (modeId: string) =>
  SUDOKU_MODES.find((mode) => mode.id === modeId);

export const getSudokuModeCatalogue = (
  flags: SudokuModeFlags,
): SudokuModeCardDescriptor[] =>
  getAvailableSudokuModes(flags).flatMap((mode) =>
    mode.catalogue ? [mode.catalogue] : [],
  );

export const getSudokuModeShortcuts = (
  flags: SudokuModeFlags,
): SudokuModeShortcutDescriptor[] =>
  getAvailableSudokuModes(flags)
    .flatMap((mode) => [...mode.shortcuts])
    .sort((left, right) => left.homeOrder - right.homeOrder);

export const getSudokuModeResumeCards = async (
  flags: SudokuModeFlags,
): Promise<HomeResumeDescriptor[]> => {
  const results = await Promise.allSettled(
    getAvailableSudokuModes(flags).map(async (mode) => {
      const game = await mode.getActiveGame();
      return game ? mode.getResumeCard(game) : null;
    }),
  );
  return results.flatMap((result) =>
    result.status === "fulfilled" && result.value ? [result.value] : [],
  );
};

export const getQuickStartSudokuMode = (flags: SudokuModeFlags) =>
  getAvailableSudokuModes(flags)
    .filter((mode) => mode.quickStart)
    .sort(
      (left, right) =>
        (left.quickStart?.homeOrder ?? 0) - (right.quickStart?.homeOrder ?? 0),
    )[0];
