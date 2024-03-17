import { useHeaderHeight } from "@react-navigation/elements";
import { ScaledSize, useWindowDimensions } from "react-native";

export const useMinWindowDimensions = (): number => {
  const size = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  return Math.min(size.width, size.height - headerHeight);
};

export function useNewWindowDimensions(): ScaledSize {
  const size = useWindowDimensions();
  const clone = JSON.parse(JSON.stringify(size));
  const headerHeight = useHeaderHeight();
  clone.height = size.height - headerHeight;
  return clone;
}
