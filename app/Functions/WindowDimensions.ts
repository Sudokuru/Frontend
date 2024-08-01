import { ScaledSize, useWindowDimensions } from "react-native";
import {
  useHeaderHeight,
  getDefaultHeaderHeight,
} from "@react-navigation/elements";
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
  const headerHeightOld = useHeaderHeight();
  // const frame = useSafeAreaFrame();
  // const insets = useSafeAreaInsets();
  // const headerHeight = getDefaultHeaderHeight(frame, false, insets.top);
  // console.log("COMPARISON: ", headerHeightOld, headerHeight);
  return Math.min(size.width, size.height - headerHeightOld);
};

export function useNewWindowDimensions(): ScaledSize {
  const size = useWindowDimensions();
  const clone = JSON.parse(JSON.stringify(size));
  const headerHeightOld = useHeaderHeight();
  // const frame = useSafeAreaFrame();
  // const insets = useSafeAreaInsets();
  // const headerHeight = getDefaultHeaderHeight(frame, false, insets.top);
  // console.log("COMPARISON: ", headerHeightOld, headerHeight);
  clone.height = size.height - headerHeightOld;
  return clone;
}
