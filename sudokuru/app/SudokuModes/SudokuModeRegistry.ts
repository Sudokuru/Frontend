import { GAME_DIFFICULTIES } from "../Functions/GameDifficulties";
import type { GameDifficulty } from "../Functions/GameDifficulties";
import { DRILL_STRATEGIES } from "../Functions/DrillStrategies";
import type { DrillStrategy } from "../Functions/DrillStrategies";
import type { BoardObjectProps } from "../Functions/LocalDatabase";
import { toTitle } from "../Functions/Utils";
import { getActiveClassicGame, getActiveDrillGame } from "../Api/Puzzles";

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

export interface SudokuModeCardDescriptor {
  id: string;
  title: string;
  description: string;
  icon: DashboardIcon;
  testID: string;
  badge?: string;
  status: "available" | "comingSoon";
  action?: DashboardNavigationAction;
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

interface SudokuModeResumeDefinition {
  title: string;
  descriptionSuffix: string;
  icon: DashboardIcon;
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
  resume: SudokuModeResumeDefinition;
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
type DrillStrategyHomeShortcutId = `drill-${KebabCase<DrillStrategy>}`;
export type SudokuModeShortcutId =
  | "drill"
  | ClassicHomeShortcutId
  | DrillStrategyHomeShortcutId;

const getClassicHomeShortcutId = (
  difficulty: GameDifficulty,
): ClassicHomeShortcutId => `classic-${difficulty}`;

const getDrillHomeShortcutId = (
  strategy: DrillStrategy,
): DrillStrategyHomeShortcutId =>
  `drill-${strategy.toLowerCase().replaceAll("_", "-")}` as DrillStrategyHomeShortcutId;

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
      params: { action: "StartGame", difficulty },
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
      screen: "DrillPage",
      currentPage: "DrillPage",
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
      params: { action: "StartGame", params: strategy },
    },
  })),
];

const SUDOKU_MODE_REGISTRY = {
  classic: {
    id: "classic",
    isAvailable: () => true,
    catalogue: {
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
        params: { action: "StartGame", difficulty },
      }),
    },
    shortcuts: CLASSIC_SHORTCUTS,
    resume: {
      title: "Classic Sudoku",
      descriptionSuffix: "puzzle",
      icon: "grid",
      testID: "HomeResumeClassicButton",
      category: "play",
      action: {
        screen: "SudokuPage",
        currentPage: "SudokuPage",
        params: { action: "ResumeGame" },
      },
    },
    getActiveGame: getActiveClassicGame,
  },
  drill: {
    id: "drill",
    isAvailable: (flags: SudokuModeFlags) =>
      flags.featurePreview && flags.drillMode,
    shortcuts: DRILL_SHORTCUTS,
    resume: {
      title: "Strategy Drill",
      descriptionSuffix: "practice",
      icon: "target",
      testID: "HomeResumeDrillButton",
      category: "practice",
      action: {
        screen: "DrillGame",
        currentPage: "DrillGame",
        params: { action: "ResumeGame" },
      },
    },
    getActiveGame: getActiveDrillGame,
  },
} satisfies SudokuModeRegistry;

const SUDOKU_MODES: readonly SudokuModeDefinition[] =
  Object.values(SUDOKU_MODE_REGISTRY);

const FOCUS_SUDOKU_PLACEHOLDER: SudokuModeCardDescriptor = {
  id: "focus",
  title: "Focus Sudoku",
  description: "Sudoku with the next region focused for fast play.",
  icon: "image-filter-center-focus",
  testID: "VariantFocusButton",
  badge: "Coming soon",
  status: "comingSoon",
};

export const SUDOKU_MODE_SHORTCUT_IDS: readonly SudokuModeShortcutId[] =
  SUDOKU_MODES.flatMap((mode) => mode.shortcuts).map((shortcut) => shortcut.id);

export const getAvailableSudokuModes = (flags: SudokuModeFlags) =>
  SUDOKU_MODES.filter((mode) => mode.isAvailable(flags));

export const getSudokuMode = (modeId: string) =>
  SUDOKU_MODES.find((mode) => mode.id === modeId);

export const getSudokuModeCatalogue = (
  flags: SudokuModeFlags,
): SudokuModeCardDescriptor[] => [
  ...getAvailableSudokuModes(flags).flatMap((mode) =>
    mode.catalogue ? [mode.catalogue] : [],
  ),
  ...(!getSudokuMode(FOCUS_SUDOKU_PLACEHOLDER.id)
    ? [FOCUS_SUDOKU_PLACEHOLDER]
    : []),
];

export const getSudokuModeShortcuts = (
  flags: SudokuModeFlags,
): SudokuModeShortcutDescriptor[] =>
  getAvailableSudokuModes(flags)
    .flatMap((mode) => [...mode.shortcuts])
    .sort((left, right) => left.homeOrder - right.homeOrder);

export const getSudokuModeResumeProviders = (flags: SudokuModeFlags) =>
  getAvailableSudokuModes(flags).map((mode) => mode.getActiveGame);

export const getQuickStartSudokuMode = (flags: SudokuModeFlags) =>
  getAvailableSudokuModes(flags)
    .filter((mode) => mode.quickStart)
    .sort(
      (left, right) =>
        (left.quickStart?.homeOrder ?? 0) - (right.quickStart?.homeOrder ?? 0),
    )[0];
