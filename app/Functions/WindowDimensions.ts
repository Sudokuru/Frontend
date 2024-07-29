import { ScaledSize, useWindowDimensions } from "react-native";
import { getDefaultHeaderHeight } from "@react-navigation/elements";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// the useHeaderHook does equals 0 in nested stacks
// https://github.com/react-navigation/react-navigation/issues/8505
// https://stackoverflow.com/questions/68820636/react-navigation-6-custom-header-height
// https://github.com/react-navigation/react-navigation/issues/10097#issuecomment-1131928669

export const useMinWindowDimensions = (): number => {
  const size = useWindowDimensions();
  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight(frame, false, insets.top);
  return Math.min(size.width, size.height - headerHeight);
};

export function useNewWindowDimensions(): ScaledSize {
  const size = useWindowDimensions();
  const clone = JSON.parse(JSON.stringify(size));
  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight(frame, false, insets.top);
  clone.height = size.height - headerHeight;
  return clone;
}
