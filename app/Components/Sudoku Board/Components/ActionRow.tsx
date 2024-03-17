import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, View } from "react-native";
import { useTheme } from "react-native-paper";

import { useCellSize } from "../Functions/BoardFunctions";

interface ActionRowProps {
  isEraseButtonDisabled: boolean;
  isUndoButtonDisabled: boolean;
  inNoteMode: boolean;
  undo: () => void;
  toggleNoteMode: () => void;
  eraseSelected: () => void;
}

const ActionRow = (props: ActionRowProps) => {
  const {
    isEraseButtonDisabled,
    isUndoButtonDisabled,
    inNoteMode,
    undo,
    toggleNoteMode,
    eraseSelected,
  } = props;
  const cellSize = useCellSize();
  const theme = useTheme();

  const sizeConst = Platform.OS === "web" ? 1.5 : 1;
  const fallbackHeight = 30;

  return (
    <View
      style={{
        width: cellSize ? cellSize * 8 : fallbackHeight * 8,
        height: cellSize ? cellSize : fallbackHeight,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: cellSize ? cellSize * (1 / 4) : fallbackHeight * (1 / 4),
      }}
    >
      {/* Undo */}
      <Pressable
        onPress={undo}
        disabled={isUndoButtonDisabled}
        testID="undoButton"
      >
        <MaterialCommunityIcons
          color={theme.colors.onBackground}
          name="undo"
          size={cellSize / sizeConst}
        />
      </Pressable>
      {/* Note mode */}
      <Pressable
        onPress={toggleNoteMode}
        disabled={false}
        testID="toggleNoteModeButton"
      >
        {inNoteMode ? (
          // note mode on
          <MaterialCommunityIcons
            color={theme.colors.onBackground}
            name="pencil-outline"
            size={cellSize / sizeConst}
          />
        ) : (
          // note mode off
          <MaterialCommunityIcons
            color={theme.colors.onBackground}
            name="pencil-off-outline"
            size={cellSize / sizeConst}
          />
        )}
      </Pressable>
      {/* Erase */}
      <Pressable
        onPress={eraseSelected}
        disabled={isEraseButtonDisabled}
        testID="eraseButton"
      >
        <MaterialCommunityIcons
          color={theme.colors.onBackground}
          name="eraser"
          size={cellSize / sizeConst}
        />
      </Pressable>
    </View>
  );
};

export default ActionRow;
