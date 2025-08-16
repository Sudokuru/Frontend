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
      primary: theme.colors.accent,
      background: theme.colors.bg,
      surface: theme.colors.surface,
      onPrimary: theme.colors.text,
      onSurface: theme.colors.text,
    },
  } as any;

  const navigationTheme = {
    ...navTheme,
    colors: {
      ...navTheme.colors,
      background: theme.colors.bg,
      primary: theme.colors.accent,
      text: theme.colors.text,
      card: theme.colors.surface,
      border: theme.colors.border,
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
