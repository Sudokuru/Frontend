import { useCellSize } from "../Functions/BoardFunctions";
import { Platform, Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native-paper";
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
  const actionBaseSize = cellSize || fallbackHeight;
  const actionButtonWidth = actionBaseSize * 1.55;
  const actionButtonHeight = actionBaseSize * 1.2;
  const actionIconSize = actionBaseSize / (1.45 * sizeConst);
  const actionLabelSize = actionBaseSize / (5 * sizeConst);

  const noteIcon = inNoteMode ? "pencil-outline" : "pencil-off-outline";

  return (
    <View
      style={{
        width: actionBaseSize * 9,
        height: actionBaseSize * 1.35,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: actionBaseSize * (1 / 4),
      }}
    >
      {/* Undo */}
      <Pressable
        onPress={undo}
        disabled={isUndoButtonDisabled}
        testID={"undoButton"}
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: actionButtonWidth,
          height: actionButtonHeight,
        }}
      >
        <MaterialCommunityIcons
          color={iconColor}
          name="undo"
          size={actionIconSize}
        />
        <Text style={{ color: iconColor, fontSize: actionLabelSize }}>
          UNDO
        </Text>
      </Pressable>
      {/* Note mode */}
      <Pressable
        onPress={toggleNoteMode}
        disabled={false}
        testID={"toggleNoteModeButton"}
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: actionButtonWidth,
          height: actionButtonHeight,
        }}
      >
        <MaterialCommunityIcons
          color={iconColor}
          name={noteIcon}
          size={actionIconSize}
        />
        <Text style={{ color: iconColor, fontSize: actionLabelSize }}>
          NOTES/VALUE
        </Text>
      </Pressable>
      {/* Erase */}
      {hasEraseButton ? (
        <Pressable
          onPress={eraseSelected}
          disabled={isEraseButtonDisabled}
          testID={"eraseButton"}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: actionButtonWidth,
            height: actionButtonHeight,
          }}
        >
          <MaterialCommunityIcons
            color={iconColor}
            name="eraser"
            size={actionIconSize}
          />
          <Text style={{ color: iconColor, fontSize: actionLabelSize }}>
            ERASE
          </Text>
        </Pressable>
      ) : null}
      {/* Reset */}
      {hasResetButton ? (
        <Pressable
          onPress={reset}
          disabled={isResetButtonDisabled}
          testID={"resetButton"}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: actionButtonWidth,
            height: actionButtonHeight,
          }}
        >
          <MaterialCommunityIcons
            color={iconColor}
            name="restart"
            size={actionIconSize}
          />
          <Text style={{ color: iconColor, fontSize: actionLabelSize }}>
            RESET
          </Text>
        </Pressable>
      ) : null}
      {/* Hint */}
      <Pressable
        testID={"hintButton"}
        disabled={boardHasConflict}
        onPress={getHint}
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: actionButtonWidth,
          height: actionButtonHeight,
        }}
      >
        <MaterialCommunityIcons
          color={iconColor}
          name="help"
          size={actionIconSize}
        />
        <Text style={{ color: iconColor, fontSize: actionLabelSize }}>
          HINT
        </Text>
      </Pressable>
    </View>
  );
};

export default ActionRow;
