import React from "react";
import { Image, View } from "react-native";
import { useCellSize } from "../Core/Functions/BoardFunctions";
import {
  FocusBackgroundOption,
  FOCUS_BACKGROUND_TEXTURES,
} from "../../../Functions/FocusBackgrounds";

/**
 * One continuous background beneath the grid, following the selected
 * focus background option. Plain options render no texture at all.
 */
const FocusFog = ({
  enabled,
  option,
}: {
  enabled: boolean;
  option: FocusBackgroundOption;
}) => {
  const size = useCellSize();
  if (!enabled || option.style === "plain") return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: size * 9,
        height: size * 9,
        overflow: "hidden",
      }}
    >
      <Image
        source={FOCUS_BACKGROUND_TEXTURES[option.style]}
        style={{ width: "100%", height: "100%", resizeMode: "repeat" }}
      />
    </View>
  );
};

export default FocusFog;
