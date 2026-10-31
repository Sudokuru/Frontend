import { z } from "zod";
import { getKeyJSON, storeData } from "../Functions/AsyncStorage";
import { SUDOKU_MODE_SHORTCUT_IDS } from "../SudokuModes/SudokuModeRegistry";
import type { SudokuModeShortcutId } from "../SudokuModes/SudokuModeRegistry";

const STATIC_HOME_SHORTCUT_IDS = [
  "play",
  "learn",
  "statistics",
  "profile",
] as const;

export const HOME_SHORTCUT_IDS = [
  ...STATIC_HOME_SHORTCUT_IDS,
  ...SUDOKU_MODE_SHORTCUT_IDS,
] as const;

export type HomeShortcutId =
  | (typeof STATIC_HOME_SHORTCUT_IDS)[number]
  | SudokuModeShortcutId;

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
