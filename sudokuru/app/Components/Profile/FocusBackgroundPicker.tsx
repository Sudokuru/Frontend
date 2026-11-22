import React from "react";
import { Image, Pressable, View } from "react-native";
import { Text } from "react-native-paper";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import { useTheme } from "../../Contexts/ThemeContext";
import {
  FOCUS_BACKGROUND_FOG,
  FOCUS_BACKGROUND_OPTIONS,
  FOCUS_BACKGROUND_TEXTURES,
  getFocusBackgroundOption,
} from "../../Functions/FocusBackgrounds";

const SWATCH_HEIGHT = 56;
const SWATCH_WIDTH = SWATCH_HEIGHT * 2;
const SWATCH_BORDER = 2;

/**
 * Fixed-size swatch cards showing each option's actual appearance.
 * A constant border width keeps the layout stable while selecting.
 */
const FocusBackgroundPicker = () => {
  const { focusBackgroundSetting, updateFocusBackground } =
    React.useContext(PreferencesContext);
  const { theme } = useTheme();
  const selected = getFocusBackgroundOption(focusBackgroundSetting);

  return (
    <View
      style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 10 }}
    >
      {FOCUS_BACKGROUND_OPTIONS.map((option) => {
        const isSelected = selected.id === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => updateFocusBackground(option.id)}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isSelected }}
            testID={
              "FocusBackground" + option.id + (isSelected ? "-selected" : "")
            }
            style={{
              width: SWATCH_WIDTH,
              borderWidth: SWATCH_BORDER,
              borderRadius: 10,
              borderColor: isSelected ? theme.colors.primary : "transparent",
              padding: 4,
            }}
          >
            <View
              style={{
                height: SWATCH_HEIGHT,
                borderRadius: 6,
                overflow: "hidden",
                backgroundColor: FOCUS_BACKGROUND_FOG[option.color].fog,
              }}
            >
              {option.style !== "plain" && (
                <Image
                  source={FOCUS_BACKGROUND_TEXTURES[option.style]}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "repeat",
                  }}
                />
              )}
            </View>
            <Text
              numberOfLines={1}
              style={{
                marginTop: 4,
                textAlign: "center",
                fontSize: 11,
                color: theme.semantic.text.primary,
                fontWeight: isSelected ? "700" : "400",
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default FocusBackgroundPicker;
