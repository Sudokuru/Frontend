import { useWindowDimensions } from "react-native";

const LARGE_SCREEN_WIDTH = 800;
const MIN_FONT_SIZE = 16;
const SMALL_SCREEN_DIVISOR = 23;
const LARGE_SCREEN_DIVISOR = 19;
const SMALL_SCREEN_MAX_FONT_SIZE = 24;
const LARGE_SCREEN_MAX_FONT_SIZE = 30;
const LINE_HEIGHT_RATIO = 1.2;

export const useStatisticFontSize = (): {
  fontSize: number;
  lineHeight: number;
} => {
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);
  const isLargeScreen = size.width >= LARGE_SCREEN_WIDTH;
  const fontSize = Math.max(
    MIN_FONT_SIZE,
    Math.min(
      reSize / (isLargeScreen ? LARGE_SCREEN_DIVISOR : SMALL_SCREEN_DIVISOR),
      isLargeScreen ? LARGE_SCREEN_MAX_FONT_SIZE : SMALL_SCREEN_MAX_FONT_SIZE,
    ),
  );
  return { fontSize, lineHeight: fontSize * LINE_HEIGHT_RATIO };
};
