import { mix } from "polished";
import { Theme } from "../../../Styling/theme";

/**
 * Guidance card colors follow the app theme so the card matches the rest of
 * the interface. The selected focus background only affects inactive cells.
 */
export const getFocusAppearance = (theme: Theme) => {
  const cardColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const foreground = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;
  return {
    borderColor: mix(0.1, foreground, cardColor),
    cardColor,
  };
};
