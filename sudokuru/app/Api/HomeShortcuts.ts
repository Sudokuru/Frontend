import { z } from "zod";
import { getKeyJSON, storeData } from "../Functions/AsyncStorage";
import { GAME_DIFFICULTIES } from "../Components/SudokuBoard/Core/Functions/DifficultyFunctions";
import type { GameDifficulty } from "../Components/SudokuBoard/Core/Functions/DifficultyFunctions";
import { DRILL_STRATEGIES } from "../Functions/DrillStrategies";
import type { DrillStrategy } from "../Functions/DrillStrategies";

type KebabCase<Value extends string> =
  Value extends `${infer Head}_${infer Tail}`
    ? `${Lowercase<Head>}-${KebabCase<Tail>}`
    : Lowercase<Value>;

type ClassicHomeShortcutId = `classic-${GameDifficulty}`;
type DrillHomeShortcutId = `drill-${KebabCase<DrillStrategy>}`;

export const getClassicHomeShortcutId = (
  difficulty: GameDifficulty,
): ClassicHomeShortcutId => `classic-${difficulty}`;

export const getDrillHomeShortcutId = (
  strategy: DrillStrategy,
): DrillHomeShortcutId =>
  `drill-${strategy.toLowerCase().replaceAll("_", "-")}` as DrillHomeShortcutId;

const STATIC_HOME_SHORTCUT_IDS = [
  "play",
  "learn",
  "drill",
  "statistics",
  "profile",
] as const;

export const HOME_SHORTCUT_IDS = [
  ...STATIC_HOME_SHORTCUT_IDS,
  ...GAME_DIFFICULTIES.map(getClassicHomeShortcutId),
  ...DRILL_STRATEGIES.map(getDrillHomeShortcutId),
] as const;

export type HomeShortcutId = (typeof HOME_SHORTCUT_IDS)[number];

export const DEFAULT_HOME_SHORTCUTS: HomeShortcutId[] = [
  "play",
  "learn",
  "drill",
];

const HomeShortcutsSchema = z.array(z.enum(HOME_SHORTCUT_IDS));

export const getHomeShortcuts = async (): Promise<HomeShortcutId[]> => {
  const value = await getKeyJSON("home_shortcuts", HomeShortcutsSchema);
  if (!Array.isArray(value)) return [...DEFAULT_HOME_SHORTCUTS];
  return [...new Set(value)] as HomeShortcutId[];
};

export const saveHomeShortcuts = async (shortcuts: HomeShortcutId[]) => {
  await storeData("home_shortcuts", JSON.stringify(shortcuts));
};
