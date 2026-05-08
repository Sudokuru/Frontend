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
  const lastThemeShortcutPressRef = useRef<number>(0);

  useEffect(() => {
    themeNameRef.current = themeName;
  }, [themeName]);

  useEffect(() => {
    getStoredTheme().then((stored) => {
      setThemeName(stored);
    });
  }, []);

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
    setStoredTheme(name);
  };

  // Listen for "t" key presses to toggle theme, but only on web (and desktop)
  // Double press "t" within 500ms to toggle the theme
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const DOUBLE_PRESS_WINDOW_MS = 500;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isThemeShortcutKey =
        event.key.toLowerCase() === "t" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey;

      if (!isThemeShortcutKey || event.repeat) {
        return;
      }

      const currentTime = Date.now();
      const isDoublePress =
        currentTime - lastThemeShortcutPressRef.current <=
        DOUBLE_PRESS_WINDOW_MS;

      lastThemeShortcutPressRef.current = currentTime;

      if (!isDoublePress) {
        return;
      }

      event.preventDefault();
      lastThemeShortcutPressRef.current = 0;

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

  // Set document.body background on web to match theme
  useEffect(() => {
    if (Platform.OS === "web") {
      document.body.style.backgroundColor = theme.colors.bg;
    }
  }, [theme.colors.bg]);

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
