import { useTheme } from "../Contexts/ThemeContext";

const DARK_LOGO = require("../../.assets/goldLogoText.png");
const LIGHT_LOGO = require("../../.assets/lightBlueLogoText.png");

export const useLogo = () => {
  const { theme } = useTheme();
  return theme.useDarkTheme ? DARK_LOGO : LIGHT_LOGO;
};
