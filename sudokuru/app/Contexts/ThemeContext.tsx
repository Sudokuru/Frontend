import React, { createContext, useContext, useEffect, useState } from "react";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { MD3LightTheme, Provider as PaperProvider } from "react-native-paper";
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

  const paperTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: theme.colors.accent,
      background: theme.colors.bg,
      surface: theme.colors.surface,
      onPrimary: theme.colors.text,
      onSurface: theme.colors.text,
    },
  } as any;

  const navigationTheme = {
    ...NavigationDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
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
