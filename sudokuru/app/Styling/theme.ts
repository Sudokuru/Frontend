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
    //accent: string;
    //accentMuted: string;
    //link: string;
    //danger: string;
    //warn: string;
    //success: string;
    //overlay: string;
    //focus: string;
    //selection: string;
    //shadow: string;
  };
  semantic: {
    text: {
      info: string;
      inverse: string;
      primary: string;
      secondary: string;
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
    onSurface: "#F2F2F2",
    primary: "#D9A05B",
    surface: "#FFFFFF",
    surfaceAlt: "#012D39",
    //accent: "#D9A05B",
    //accentMuted: "#D9A05B99",
    //link: "#D9A05B",
    //danger: "#FF0000",
    //warn: "#FFA500",
    //success: "#4CBB17",
    //overlay: "#00000080",
    //focus: "#F2CA7E",
    //selection: "#9CC4EC",
    //shadow: "#00000033",
  },
  semantic: {
    text: {
      info: "#000000",
      inverse: "#FFFFFF",
      primary: "#D9A05B",
      secondary: "#FFFFFF",
    },
  },
};

const light: Theme = {
  useDarkTheme: false,
  colors: {
    bg: "#F2F2F2",
    border: "#025E73",
    error: "#FF0000",
    onError: "#FFFFFF",
    onSurface: "#808080",
    primary: "#025E73",
    surface: "#FFFFFF",
    surfaceAlt: "#012D39",
    //accent: "#025E73",
    //accentMuted: "#025E7399",
    //link: "#025E73",
    //danger: "#B00020",
    //warn: "#F9A825",
    //success: "#388E3C",
    //overlay: "#00000080",
    //focus: "#025E73",
    //selection: "#BBDEFB",
    //shadow: "#00000033",
  },
  semantic: {
    text: {
      info: "#000000",
      inverse: "#FFFFFF",
      primary: "#025E73",
      secondary: "#025E73",
    },
  },
};

const dark: Theme = {
  useDarkTheme: true,
  colors: {
    bg: "#121212",
    border: "#333333",
    error: "#FF0000",
    onError: "#FFFFFF",
    onSurface: "#808080",
    primary: "#D9A05B",
    surface: "#1E1E1E",
    surfaceAlt: "#2C2C2C",
    //accent: "#D9A05B",
    //accentMuted: "#D9A05B99",
    //link: "#8AB4F8",
    //danger: "#CF6679",
    //warn: "#FBC02D",
    //success: "#81C784",
    //overlay: "#000000B3",
    //focus: "#BB86FC",
    //selection: "#333333",
    //shadow: "#00000066",
  },
  semantic: {
    text: {
      info: "#000000",
      inverse: "#FFFFFF",
      primary: "#D9A05B",
      secondary: "#025E73",
    },
  },
};

export const themes = {
  classic,
  light,
  dark,
};

export type ThemeName = keyof typeof themes;

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
