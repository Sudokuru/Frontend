import { useTheme } from "../Contexts/ThemeContext";

// The light theme logos are recolored copies of the dark theme ones, with transparent pixels preserved.
// To create one with imagemagick 6:
// convert sudokuru/.assets/goldLogoNoText.png -channel RGB -fill "#06A2C7" -colorize 100 +channel sudokuru/.assets/lightBlueLogoNoText.png
const DARK_LOGO = require("../../.assets/goldLogoText.png");
const LIGHT_LOGO = require("../../.assets/lightBlueLogoText.png");
const DARK_LOGO_WITHOUT_TEXT = require("../../.assets/goldLogoNoText.png");
const LIGHT_LOGO_WITHOUT_TEXT = require("../../.assets/lightBlueLogoNoText.png");

export const useLogo = () => {
  const { theme } = useTheme();
  return theme.useDarkTheme ? DARK_LOGO : LIGHT_LOGO;
};

export const useLogoWithoutText = () => {
  const { theme } = useTheme();
  return theme.useDarkTheme ? DARK_LOGO_WITHOUT_TEXT : LIGHT_LOGO_WITHOUT_TEXT;
};
