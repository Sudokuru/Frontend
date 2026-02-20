import { useCellSize } from "../Functions/BoardFunctions";
import { Platform, Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTheme } from "../../../../Contexts/ThemeContext";

interface ActionRowProps {
  isEraseButtonDisabled: boolean;
  isUndoButtonDisabled: boolean;
  isResetButtonDisabled: boolean;
  inNoteMode: boolean;
  undo: () => void;
  toggleNoteMode: () => void;
  eraseSelected: () => void;
  reset: () => void;
  getHint: () => void;
  boardHasConflict: boolean;
  hasResetButton: boolean;
  hasEraseButton: boolean;
}

const ActionRow = (props: ActionRowProps) => {
  const {
    isEraseButtonDisabled,
    isUndoButtonDisabled,
    isResetButtonDisabled,
    inNoteMode,
    undo,
    toggleNoteMode,
    eraseSelected,
    reset,
    getHint,
    boardHasConflict,
    hasResetButton,
    hasEraseButton,
  } = props;
  const cellSize = useCellSize();
  const { theme } = useTheme();
  const iconColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;

  const sizeConst = Platform.OS === "web" ? 1.5 : 1;
  let fallbackHeight = 30;

  const noteIcon = inNoteMode ? "pencil-outline" : "pencil-off-outline";

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
        testID={"undoButton"}
      >
        <MaterialCommunityIcons
          color={iconColor}
          name="undo"
          size={cellSize / sizeConst}
        />
      </Pressable>
      {/* Note mode */}
      <Pressable
        onPress={toggleNoteMode}
        disabled={false}
        testID={"toggleNoteModeButton"}
      >
        <MaterialCommunityIcons
          color={iconColor}
          name={noteIcon}
          size={cellSize / sizeConst}
        />
      </Pressable>
      {/* Erase */}
      {hasEraseButton ? (
        <Pressable
          onPress={eraseSelected}
          disabled={isEraseButtonDisabled}
          testID={"eraseButton"}
        >
          <MaterialCommunityIcons
            color={iconColor}
            name="eraser"
            size={cellSize / sizeConst}
          />
        </Pressable>
      ) : (
        <></>
      )}
      {/* Reset */}
      {hasResetButton ? (
        <Pressable
          onPress={reset}
          disabled={isResetButtonDisabled}
          testID={"resetButton"}
        >
          <MaterialCommunityIcons
            color={iconColor}
            name="restart"
            size={cellSize / sizeConst}
          />
        </Pressable>
      ) : (
        <></>
      )}
      {/* Hint */}
      <Pressable
        testID={"hintButton"}
        disabled={boardHasConflict}
        onPress={getHint}
      >
        <MaterialCommunityIcons
          color={iconColor}
          name="help"
          size={cellSize / sizeConst}
        />
      </Pressable>
    </View>
  );
};

export default ActionRow;
