import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCellSize } from "../Functions/BoardFunctions";
import React from "react";
import { Text } from "react-native-paper";
import { useTheme } from "../../../../Contexts/ThemeContext";

const ACTION_BUTTON_BACKGROUND_HEIGHT_RATIO = 0.82;

interface PauseButtonProps {
  handlePause: () => void;
  isPaused: boolean;
}

const PauseButton = (props: PauseButtonProps) => {
  const { handlePause, isPaused } = props;
  const cellSize = useCellSize();
  const { theme } = useTheme();

  const iconColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;
  const backgroundColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;

  const iconName = isPaused ? "play" : "pause";
  const label = isPaused ? "PLAY" : "PAUSE";

  const buttonHeight = cellSize * 0.95;
  const buttonWidth = cellSize * 1.75;
  const iconSize = cellSize / 2.25;
  const labelSize = cellSize / 3.2;

  return (
    <Pressable
      testID="PauseButton"
      onPress={handlePause}
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: buttonWidth,
        height: buttonHeight,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: buttonWidth,
          height: buttonHeight * ACTION_BUTTON_BACKGROUND_HEIGHT_RATIO,
          borderRadius:
            buttonHeight * ACTION_BUTTON_BACKGROUND_HEIGHT_RATIO * 0.22,
          backgroundColor: backgroundColor,
          flexDirection: "row",
          paddingHorizontal: buttonWidth * 0.05,
          overflow: "hidden",
        }}
      >
        <MaterialCommunityIcons
          color={iconColor}
          name={iconName}
          size={iconSize}
        />
        <Text
          style={{
            color: iconColor,
            fontSize: labelSize,
            fontWeight: "bold",
            marginLeft: buttonWidth * 0.05,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

export default PauseButton;
