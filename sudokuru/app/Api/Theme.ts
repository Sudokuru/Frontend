import { getKeyJSON, storeData } from "../Functions/AsyncStorage";
import { ThemeSchema } from "../Functions/LocalDatabase";
import { ThemeName, ThemeNames } from "../Styling/theme";

const THEME_KEY = "theme";

export const getStoredTheme = async (): Promise<ThemeName> => {
  const value: ThemeName = await getKeyJSON(THEME_KEY, ThemeSchema);
  if (!value) {
    return ThemeNames[0];
  }
  return value;
};

export const setStoredTheme = async (name: ThemeName) => {
  await storeData(THEME_KEY, JSON.stringify(name));
};
