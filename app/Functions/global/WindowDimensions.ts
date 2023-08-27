import { ScaledSize, useWindowDimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

export const getMinWindowDimensions = (): number => {
  const size = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  return Math.min(size.width, size.height - headerHeight);
};

export const getWindowDimensions = (): ScaledSize => {
  const size = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  size.height -= headerHeight;
  return size;
};
