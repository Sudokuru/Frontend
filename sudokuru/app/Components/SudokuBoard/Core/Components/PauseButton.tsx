import { Pressable, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCellSize } from "../Functions/BoardFunctions";
import React from "react";
import { useTheme } from "../../../../Contexts/ThemeContext";

interface PauseButtonProps {
  handlePause: () => void;
  isPaused: boolean;
}

const PauseButton = (props: PauseButtonProps) => {
  const { handlePause, isPaused } = props;
  const cellSize = useCellSize();
  const sizeConst = Platform.OS === "web" ? 1.5 : 1;
  const { theme } = useTheme();

  return (
    <Pressable testID="PauseButton" onPress={handlePause}>
      {isPaused ? (
        <MaterialCommunityIcons
          color={
            theme.useDarkTheme
              ? theme.semantic.text.inverse
              : theme.semantic.text.info
          }
          name="play"
          size={cellSize / sizeConst}
        />
      ) : (
        <MaterialCommunityIcons
          color={
            theme.useDarkTheme
              ? theme.semantic.text.inverse
              : theme.semantic.text.info
          }
          name="pause"
          size={cellSize / sizeConst}
        />
      )}
    </Pressable>
  );
};

export default PauseButton;
