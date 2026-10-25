import { ScaledSize, useWindowDimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// the useHeaderHook does equals 0 in nested stacks
// https://github.com/react-navigation/react-navigation/issues/8505
// https://stackoverflow.com/questions/68820636/react-navigation-6-custom-header-height
// https://github.com/react-navigation/react-navigation/issues/10097#issuecomment-1131928669

// The app runs edge-to-edge, so window dimensions include the unsafe system
// areas (notch and home indicator on iOS). The drawer content lives inside a
// SafeAreaView below the header, so those insets must be subtracted for pages
// to size themselves to the space that is actually visible. Insets are zero on
// web, so this changes nothing there.
export const useMinWindowDimensions = (): number => {
  const size = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  return Math.min(
    size.width - insets.left - insets.right,
    size.height - insets.top - insets.bottom - headerHeight,
  );
};

export function useNewWindowDimensions(): ScaledSize {
  const size = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  return {
    ...size,
    width: size.width - insets.left - insets.right,
    height: size.height - insets.top - insets.bottom - headerHeight,
  };
}
