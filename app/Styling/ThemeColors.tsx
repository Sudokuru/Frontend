import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import merge from "deepmerge";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

const dTheme = {
  ...MD3DarkTheme, // or MD3DarkTheme
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#D9A05B",
    onPrimary: "#025E73",
    primaryContainer: "rgb(217, 160, 91)",
    onPrimaryContainer: "#000000",
    elevation: "#025E73",
    background: "#025E73",
    onBackground: "#F2F2F2",
    secondary: "#F2F2F2",
    secondaryContainer: "#F2F2F2",
    tertiary: "#F2F2F2",
    tertiaryContainer: "#F2F2F2",
    backdrop: "#025E73",
    onSecondaryContainer: "#D9A05B",
    onTertiary: "#F2F2F2",
    onTertiaryContainer: "#F2F2F2",
    outline: "#D9A05B",
    surface: "#012F39FF",
    onSurface: "#F2F2F2",
    onSurfaceVariant: "#D9A05B",
  },
};

const d2Theme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: "#D9A05B",
    onPrimary: "#000000",
    primaryContainer: "rgb(217, 160, 91)",
    onPrimaryContainer: "#000000",
    elevation: "#025E73",
    background: "#025E73",
    onBackground: "#F2F2F2",
    secondary: "#F2F2F2",
    secondaryContainer: "#F2F2F2",
    tertiary: "#F2F2F2",
    tertiaryContainer: "#F2F2F2",
    backdrop: "#025E73",
    onSecondaryContainer: "#D9A05B",
    onTertiary: "#F2F2F2",
    onTertiaryContainer: "#F2F2F2",
    outline: "#D9A05B",
    surface: "#012F39FF",
    onSurface: "#F2F2F2",
    onSurfaceVariant: "#D9A05B",
  },
};

export const l2Theme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: "#025E73",
    onPrimary: "#F2F2F2",
    primaryContainer: "#025E73",
    onPrimaryContainer: "#F2F2F2",
    elevation: "#F2F2F2",
    background: "#F2F2F2",
    onBackground: "#000000",
    secondary: "#F2F2F2",
    secondaryContainer: "#025E73",
    tertiary: "#F2F2F2",
    tertiaryContainer: "#F2F2F2",
    backdrop: "#F2F2F2",
    onSecondaryContainer: "#F2F2F2",
    onTertiary: "#F2F2F2",
    onTertiaryContainer: "#F2F2F2",
    outline: "#D9A05B",
    surface: "#012F39FF",
    onSurface: "#F2F2F2",
    onSurfaceVariant: "#025E73",
  },
};

export const lTheme = {
  ...MD3LightTheme, // or MD3DarkTheme
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#025E73",
    onPrimary: "#F2F2F2",
    primaryContainer: "#025E73",
    onPrimaryContainer: "#F2F2F2",
    elevation: "#F2F2F2",
    background: "#F2F2F2",
    onBackground: "#000000",
    secondary: "#F2F2F2",
    secondaryContainer: "#025E73",
    tertiary: "#F2F2F2",
    tertiaryContainer: "#F2F2F2",
    backdrop: "#F2F2F2",
    onSecondaryContainer: "#F2F2F2",
    onTertiary: "#F2F2F2",
    onTertiaryContainer: "#F2F2F2",
    outline: "#D9A05B",
    surface: "#012F39FF",
    onSurface: "#F2F2F2",
    onSurfaceVariant: "#025E73",
  },
};

export const CombinedDefaultTheme = merge(lTheme, l2Theme);
export const CombinedDarkTheme = merge(dTheme, d2Theme);
