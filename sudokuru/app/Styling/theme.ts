export type Theme = {
  colors: {
    bg: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textMuted: string;
    border: string;
    accent: string;
    primary: string;
    accentMuted: string;
    link: string;
    danger: string;
    warn: string;
    success: string;
    overlay: string;
    focus: string;
    selection: string;
    shadow: string;
  };
};

export type ThemeName = keyof typeof themes;

const classic: Theme = {
  colors: {
    bg: "#025E73",
    surface: "#FFFFFF",
    surfaceAlt: "#012D39",
    text: "#025E73",
    textMuted: "#D9A05B",
    border: "#025E73",
    accent: "#D9A05B",
    primary: "#D9A05B",
    accentMuted: "#D9A05B99",
    link: "#D9A05B",
    danger: "#FF0000",
    warn: "#FFA500",
    success: "#4CBB17",
    overlay: "#00000080",
    focus: "#F2CA7E",
    selection: "#9CC4EC",
    shadow: "#00000033",
  },
};

const light: Theme = {
  colors: {
    bg: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceAlt: "#F5F5F5",
    text: "#111111",
    textMuted: "#555555",
    border: "#CCCCCC",
    accent: "#025E73",
    primary: "#025E73",
    accentMuted: "#025E7399",
    link: "#025E73",
    danger: "#B00020",
    warn: "#F9A825",
    success: "#388E3C",
    overlay: "#00000080",
    focus: "#025E73",
    selection: "#BBDEFB",
    shadow: "#00000033",
  },
};

const dark: Theme = {
  colors: {
    bg: "#121212",
    surface: "#1E1E1E",
    surfaceAlt: "#2C2C2C",
    text: "#E0E0E0",
    textMuted: "#AAAAAA",
    border: "#333333",
    accent: "#D9A05B",
    primary: "#D9A05B",
    accentMuted: "#D9A05B99",
    link: "#8AB4F8",
    danger: "#CF6679",
    warn: "#FBC02D",
    success: "#81C784",
    overlay: "#000000B3",
    focus: "#BB86FC",
    selection: "#333333",
    shadow: "#00000066",
  },
};

export const themes = {
  classic,
  light,
  dark,
};
