import { useCellSize } from "../Functions/BoardFunctions";
import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native-paper";
import { useTheme } from "../../../../Contexts/ThemeContext";

const FALLBACK_CELL_SIZE = 30;
const ROW_WIDTH_IN_CELLS = 9;
const ROW_HEIGHT_RATIO = 1.6;
const ACTION_BUTTON_WIDTH_RATIO = 1.55;
const ACTION_BUTTON_HEIGHT_RATIO = 1.6;
const ACTION_BUTTON_BACKGROUND_HEIGHT_RATIO = 0.82;
const ACTION_ICON_RATIO = 1.4;
const ACTION_LABEL_RATIO = 2.2;

interface ActionButtonProps {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  onPress: () => void;
  disabled: boolean;
  testID: string;
  iconColor: string;
  backgroundColor: string;
  buttonWidth: number;
  buttonHeight: number;
  iconSize: number;
  labelSize: number;
}

const ActionButton = ({
  iconName,
  label,
  onPress,
  disabled,
  testID,
  iconColor,
  backgroundColor,
  buttonWidth,
  buttonHeight,
  iconSize,
  labelSize,
}: ActionButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
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
          borderRadius: buttonWidth * 0.18,
          backgroundColor: backgroundColor,
        }}
      >
        <MaterialCommunityIcons
          color={iconColor}
          name={iconName}
          size={iconSize}
        />
        <Text
          style={{ color: iconColor, fontSize: labelSize, fontWeight: "bold" }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

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
  const actionButtonBackgroundColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;

  const actionBaseSize = cellSize || FALLBACK_CELL_SIZE;
  const actionButtonWidth = actionBaseSize * ACTION_BUTTON_WIDTH_RATIO;
  const actionButtonHeight = actionBaseSize * ACTION_BUTTON_HEIGHT_RATIO;
  const actionIconSize = actionBaseSize / ACTION_ICON_RATIO;
  const actionLabelSize = actionBaseSize / ACTION_LABEL_RATIO;

  const noteIcon = inNoteMode ? "pencil-outline" : "pencil-off-outline";

  return (
    <View
      style={{
        width: actionBaseSize * ROW_WIDTH_IN_CELLS,
        height: actionBaseSize * ROW_HEIGHT_RATIO,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <ActionButton
        iconName="undo"
        label="UNDO"
        onPress={undo}
        disabled={isUndoButtonDisabled}
        testID="undoButton"
        iconColor={iconColor}
        backgroundColor={actionButtonBackgroundColor}
        buttonWidth={actionButtonWidth}
        buttonHeight={actionButtonHeight}
        iconSize={actionIconSize}
        labelSize={actionLabelSize}
      />
      <ActionButton
        iconName={noteIcon}
        label={inNoteMode ? "VALUE" : "NOTE"}
        onPress={toggleNoteMode}
        disabled={false}
        testID="toggleNoteModeButton"
        iconColor={iconColor}
        backgroundColor={actionButtonBackgroundColor}
        buttonWidth={actionButtonWidth}
        buttonHeight={actionButtonHeight}
        iconSize={actionIconSize}
        labelSize={actionLabelSize}
      />
      {hasEraseButton ? (
        <ActionButton
          iconName="eraser"
          label="ERASE"
          onPress={eraseSelected}
          disabled={isEraseButtonDisabled}
          testID="eraseButton"
          iconColor={iconColor}
          backgroundColor={actionButtonBackgroundColor}
          buttonWidth={actionButtonWidth}
          buttonHeight={actionButtonHeight}
          iconSize={actionIconSize}
          labelSize={actionLabelSize}
        />
      ) : null}
      {hasResetButton ? (
        <ActionButton
          iconName="restart"
          label="RESET"
          onPress={reset}
          disabled={isResetButtonDisabled}
          testID="resetButton"
          iconColor={iconColor}
          backgroundColor={actionButtonBackgroundColor}
          buttonWidth={actionButtonWidth}
          buttonHeight={actionButtonHeight}
          iconSize={actionIconSize}
          labelSize={actionLabelSize}
        />
      ) : null}
      <ActionButton
        iconName="help"
        label="HINT"
        onPress={getHint}
        disabled={boardHasConflict}
        testID="hintButton"
        iconColor={iconColor}
        backgroundColor={actionButtonBackgroundColor}
        buttonWidth={actionButtonWidth}
        buttonHeight={actionButtonHeight}
        iconSize={actionIconSize}
        labelSize={actionLabelSize}
      />
    </View>
  );
};

export default ActionRow;
