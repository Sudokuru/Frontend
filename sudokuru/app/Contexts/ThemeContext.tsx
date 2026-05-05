import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { Platform } from "react-native";
import { Theme, themes, ThemeName, THEME_OPTIONS } from "../Styling/theme";
import { getStoredTheme, setStoredTheme } from "../Api/Theme";

interface ThemeContextValue {
  themeName: ThemeName;
  theme: Theme;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeName: THEME_OPTIONS[0].key,
  theme: THEME_OPTIONS[0].theme,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>(THEME_OPTIONS[0].key);
  const themeNameRef = useRef<ThemeName>(themeName);
  themeNameRef.current = themeName;

  useEffect(() => {
    getStoredTheme().then((stored) => {
      setThemeName(stored);
    });
  }, []);

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
    setStoredTheme(name);
  };

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isThemeShortcut =
        event.key.toLowerCase() === "t" &&
        (event.ctrlKey || event.metaKey) &&
        event.altKey;

      if (!isThemeShortcut) return;

      event.preventDefault();

      const currentIndex = THEME_OPTIONS.findIndex(
        (option) => option.key === themeNameRef.current,
      );
      const nextTheme =
        THEME_OPTIONS[(currentIndex + 1) % THEME_OPTIONS.length].key;
      setTheme(nextTheme);
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, []);

  const theme = themes[themeName];

  const md3Theme = theme.useDarkTheme ? MD3DarkTheme : MD3LightTheme;
  const navTheme = theme.useDarkTheme
    ? NavigationDarkTheme
    : NavigationDefaultTheme;

  const paperTheme = {
    ...md3Theme,
    colors: {
      ...md3Theme.colors,
      background: theme.colors.bg,
      elevation: theme.colors.bg,
      onPrimary: theme.semantic.text.secondary,
      onSurface: theme.colors.surface,
      outline: theme.colors.border,
      primary: theme.colors.primary,
      surface: theme.colors.surface,
      // Following three colors are for the react navigation bar
      secondaryContainer: theme.colors.surface,
      onSecondaryContainer: theme.colors.primary,
      onSurfaceVariant: theme.colors.primary,
    },
  };

  const navigationTheme = {
    ...navTheme,
    colors: {
      ...navTheme.colors,
      background: theme.colors.bg,
      border: theme.colors.border,
      card: theme.colors.surface,
      primary: theme.colors.primary,
      text: theme.semantic.text.secondary,
    },
  };

  return (
    <ThemeContext.Provider value={{ themeName, theme, setTheme }}>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={navigationTheme}>
          {children}
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
