import { useTheme } from "../Contexts/ThemeContext";

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
