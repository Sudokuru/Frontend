import { z } from "zod";
import { getKeyJSON, storeData } from "../Functions/AsyncStorage";

export const HOME_SHORTCUT_IDS = [
  "play",
  "learn",
  "drill",
  "statistics",
  "profile",
  "classic-novice",
  "classic-amateur",
  "classic-layman",
  "classic-trainee",
  "classic-protege",
  "classic-professional",
  "classic-pundit",
  "classic-master",
  "classic-grandmaster",
  "drill-obvious-single",
  "drill-obvious-pair",
  "drill-obvious-triplet",
  "drill-obvious-quadruplet",
  "drill-hidden-single",
  "drill-hidden-pair",
  "drill-hidden-triplet",
  "drill-hidden-quadruplet",
  "drill-pointing-pair",
  "drill-pointing-triplet",
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
