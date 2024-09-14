import { ScaledSize, useWindowDimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
// the useHeaderHook does equals 0 in nested stacks
// https://github.com/react-navigation/react-navigation/issues/8505
// https://stackoverflow.com/questions/68820636/react-navigation-6-custom-header-height
// https://github.com/react-navigation/react-navigation/issues/10097#issuecomment-1131928669

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
