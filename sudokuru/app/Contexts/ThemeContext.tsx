import React, { createContext, useContext, useEffect, useState } from "react";
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
import { Theme, themes, ThemeName } from "../Styling/theme";
import { getStoredTheme, setStoredTheme } from "../Api/Theme";

interface ThemeContextValue {
  themeName: ThemeName;
  theme: Theme;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeName: "classic",
  theme: themes.classic,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>("classic");

  useEffect(() => {
    getStoredTheme().then((stored) => {
      if (stored && themes[stored as ThemeName]) {
        setThemeName(stored as ThemeName);
      }
    });
  }, []);

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
    setStoredTheme(name);
  };

  const theme = themes[themeName];

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = themeName;
    }
  }, [themeName]);

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
  } as any;

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
