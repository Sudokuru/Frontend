import { getKeyJSON, storeData } from "../Functions/AsyncStorage";

const THEME_KEY = "theme";

export const getStoredTheme = async (): Promise<string | undefined> => {
  const value = await getKeyJSON(THEME_KEY);
  return value ?? undefined;
};

export const setStoredTheme = async (name: string) => {
  await storeData(THEME_KEY, JSON.stringify(name));
};
