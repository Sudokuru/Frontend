import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import merge from "deepmerge";

const dTheme = {
  ...MD3DarkTheme, // or MD3DarkTheme
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
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
    onSecondaryContainer: "#F2F2F2",
    onTertiary: "#F2F2F2",
    onTertiaryContainer: "#F2F2F2",
    onSurface: "#F2F2F2",
    onSurfaceVariant: "#F2F2F2",
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
    onSecondaryContainer: "#F2F2F2",
    onTertiary: "#F2F2F2",
    onTertiaryContainer: "#F2F2F2",
    onSurface: "#F2F2F2",
    onSurfaceVariant: "#F2F2F2",
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
    secondaryContainer: "#F2F2F2",
    tertiary: "#F2F2F2",
    tertiaryContainer: "#F2F2F2",
    backdrop: "#F2F2F2",
    onSecondaryContainer: "#F2F2F2",
    onTertiary: "#F2F2F2",
    onTertiaryContainer: "#F2F2F2",
    onSurface: "#025E73",
    onSurfaceVariant: "#F2F2F2",
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
    secondaryContainer: "#F2F2F2",
    tertiary: "#F2F2F2",
    tertiaryContainer: "#F2F2F2",
    backdrop: "#F2F2F2",
    onSecondaryContainer: "#F2F2F2",
    onTertiary: "#F2F2F2",
    onTertiaryContainer: "#F2F2F2",
    onSurface: "#025E73",
    onSurfaceVariant: "#F2F2F2",
  },
};

export const CombinedDefaultTheme = merge(lTheme, l2Theme);
export const CombinedDarkTheme = merge(dTheme, d2Theme);
