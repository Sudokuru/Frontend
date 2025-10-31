import { getKeyJSON, storeData } from "../Functions/AsyncStorage";
import { ThemeSchema } from "../Functions/LocalDatabase";

const THEME_KEY = "theme";

export const getStoredTheme = async (): Promise<string | undefined> => {
  const value = await getKeyJSON(THEME_KEY, ThemeSchema);
  return value ?? undefined;
};

export const setStoredTheme = async (name: string) => {
  await storeData(THEME_KEY, JSON.stringify(name));
};
