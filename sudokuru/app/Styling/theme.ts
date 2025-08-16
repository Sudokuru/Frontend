// For simplicity keep theme colors alphabetized everywhere
export type Theme = {
  useDarkTheme: boolean;
  colors: {
    bg: string;
    border: string;
    primary: string;
    surface: string;
    text: string;
    //surfaceAlt: string;
    //textMuted: string;
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
};

const classic: Theme = {
  useDarkTheme: true,
  colors: {
    bg: "#025E73",
    border: "#D9A05B",
    primary: "#D9A05B",
    surface: "#FFFFFF",
    text: "#025E73",
    //surfaceAlt: "#012D39",
    //textMuted: "#D9A05B",
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
};

const light: Theme = {
  useDarkTheme: false,
  colors: {
    bg: "#FFFFFF",
    border: "#CCCCCC",
    primary: "#025E73",
    surface: "#FFFFFF",
    text: "#111111",
    //surfaceAlt: "#F5F5F5",
    //textMuted: "#555555",
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
};

const dark: Theme = {
  useDarkTheme: true,
  colors: {
    bg: "#121212",
    border: "#333333",
    primary: "#D9A05B",
    surface: "#1E1E1E",
    text: "#E0E0E0",
    //surfaceAlt: "#2C2C2C",
    //textMuted: "#AAAAAA",
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
};

export const themes = {
  classic,
  light,
  dark,
};

export type ThemeName = keyof typeof themes;
