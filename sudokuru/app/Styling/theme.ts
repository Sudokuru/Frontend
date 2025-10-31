// For simplicity keep theme colors alphabetized everywhere
export type Theme = {
  useDarkTheme: boolean;
  colors: {
    bg: string;
    border: string;
    error: string;
    onError: string;
    onSurface: string;
    primary: string;
    surface: string;
    surfaceAlt: string;
  };
  semantic: {
    text: {
      info: string;
      inverse: string;
      primary: string;
      secondary: string;
      tertiary: string;
      quaternary: string;
    };
  };
};

const classic: Theme = {
  useDarkTheme: true,
  colors: {
    bg: "#025E73",
    border: "#D9A05B",
    error: "#FF0000",
    onError: "#FFFFFF",
    onSurface: "#DEDEDE",
    primary: "#D9A05B",
    surface: "#FFFFFF",
    surfaceAlt: "#012D39",
  },
  semantic: {
    text: {
      info: "#000000",
      inverse: "#FFFFFF",
      primary: "#D9A05B",
      secondary: "#FFFFFF",
      tertiary: "#FFFFFF",
      quaternary: "#025E73",
    },
  },
};

const light: Theme = {
  useDarkTheme: false,
  colors: {
    bg: "#F2F2F2",
    border: "#06A2C7",
    error: "#FF0000",
    onError: "#FFFFFF",
    onSurface: "#808080",
    primary: "#06A2C7",
    surface: "#FFFFFF",
    surfaceAlt: "#025E73",
  },
  semantic: {
    text: {
      info: "#000000",
      inverse: "#FFFFFF",
      primary: "#06A2C7",
      secondary: "#06A2C7",
      tertiary: "#025E73",
      quaternary: "#025E73",
    },
  },
};

const dark: Theme = {
  useDarkTheme: true,
  colors: {
    bg: "#121212",
    border: "#F2F2F2",
    error: "#FF0000",
    onError: "#FFFFFF",
    onSurface: "#808080",
    primary: "#D9A05B",
    surface: "#626262",
    surfaceAlt: "#424242",
  },
  semantic: {
    text: {
      info: "#000000",
      inverse: "#FFFFFF",
      primary: "#D9A05B",
      secondary: "#025E73",
      tertiary: "#FFFFFF",
      quaternary: "#FFFFFF",
    },
  },
};

export const themes = {
  classic,
  light,
  dark,
};

export type ThemeName = keyof typeof themes;

export const ThemeNames = Object.keys(themes) as ThemeName[];

export type ThemeOption = {
  key: ThemeName;
  label: string;
  theme: Theme;
};

export const THEME_OPTIONS: readonly ThemeOption[] = [
  { key: "classic", label: "Classic", theme: classic },
  { key: "light", label: "Light Mode", theme: light },
  { key: "dark", label: "Dark Mode", theme: dark },
];
