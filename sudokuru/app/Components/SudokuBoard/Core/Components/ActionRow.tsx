import { MOBILE_BREAKPOINT, useCellSize } from "../Functions/BoardFunctions";
import { Pressable, View, useWindowDimensions } from "react-native";
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
  isMobileLayout: boolean;
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
  isMobileLayout,
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
          borderRadius:
            buttonHeight * ACTION_BUTTON_BACKGROUND_HEIGHT_RATIO * 0.22,
          backgroundColor: backgroundColor,
          flexDirection: isMobileLayout ? "row" : "column",
          paddingHorizontal: isMobileLayout ? buttonWidth * 0.05 : 0,
          overflow: "hidden",
        }}
      >
        <MaterialCommunityIcons
          color={iconColor}
          name={iconName}
          size={iconSize}
        />
        <Text
          ellipsizeMode={isMobileLayout ? "clip" : undefined}
          style={{
            color: iconColor,
            fontSize: labelSize,
            fontWeight: "bold",
            marginLeft: isMobileLayout ? buttonWidth * 0.05 : 0,
          }}
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
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const isMobileLayout = width < MOBILE_BREAKPOINT;
  const iconColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;
  const actionButtonBackgroundColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const noteIcon = inNoteMode ? "pencil-outline" : "pencil-off-outline";
  const noteLabel = isMobileLayout
    ? inNoteMode
      ? "VALUE"
      : "NOTE"
    : inNoteMode
      ? "VALUE"
      : "NOTE";

  type ActionButtonConfig = {
    key: string;
    iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    label: string;
    onPress: () => void;
    disabled: boolean;
    testID: string;
    visible: boolean;
  };

  const actionBaseSize = cellSize || FALLBACK_CELL_SIZE;
  const rowWidth = actionBaseSize * ROW_WIDTH_IN_CELLS;
  const rowHeightRatio = isMobileLayout ? 0.95 : ROW_HEIGHT_RATIO;
  const actionButtonHeightRatio = isMobileLayout
    ? 0.95
    : ACTION_BUTTON_HEIGHT_RATIO;
  const mobileButtonGap = isMobileLayout ? actionBaseSize * 0.08 : 0;

  const buttonConfigs: ActionButtonConfig[] = [
    {
      key: "undo",
      iconName: "undo" as React.ComponentProps<
        typeof MaterialCommunityIcons
      >["name"],
      label: "UNDO",
      onPress: undo,
      disabled: isUndoButtonDisabled,
      testID: "undoButton",
      visible: true,
    },
    {
      key: "note",
      iconName: noteIcon as React.ComponentProps<
        typeof MaterialCommunityIcons
      >["name"],
      label: noteLabel,
      onPress: toggleNoteMode,
      disabled: false,
      testID: "toggleNoteModeButton",
      visible: true,
    },
    {
      key: "erase",
      iconName: "eraser" as React.ComponentProps<
        typeof MaterialCommunityIcons
      >["name"],
      label: "ERASE",
      onPress: eraseSelected,
      disabled: isEraseButtonDisabled,
      testID: "eraseButton",
      visible: hasEraseButton,
    },
    {
      key: "reset",
      iconName: "restart" as React.ComponentProps<
        typeof MaterialCommunityIcons
      >["name"],
      label: "RESET",
      onPress: reset,
      disabled: isResetButtonDisabled,
      testID: "resetButton",
      visible: hasResetButton,
    },
    {
      key: "hint",
      iconName: "help" as React.ComponentProps<
        typeof MaterialCommunityIcons
      >["name"],
      label: "HINT",
      onPress: getHint,
      disabled: boardHasConflict,
      testID: "hintButton",
      visible: true,
    },
  ].filter((button) => button.visible);

  const actionButtonWidth = isMobileLayout
    ? (rowWidth - mobileButtonGap * (buttonConfigs.length - 1)) /
      buttonConfigs.length
    : actionBaseSize * ACTION_BUTTON_WIDTH_RATIO;
  const actionButtonHeight = actionBaseSize * actionButtonHeightRatio;
  const actionIconSize = isMobileLayout
    ? actionBaseSize / 2.25
    : actionBaseSize / ACTION_ICON_RATIO;
  const actionLabelSize = isMobileLayout
    ? actionBaseSize / 3.2
    : actionBaseSize / ACTION_LABEL_RATIO;

  return (
    <View
      style={{
        width: rowWidth,
        height: actionBaseSize * rowHeightRatio,
        justifyContent: isMobileLayout ? "flex-start" : "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      {buttonConfigs.map((button, index) => (
        <View
          key={button.key}
          style={{
            marginRight:
              isMobileLayout && index < buttonConfigs.length - 1
                ? mobileButtonGap
                : 0,
          }}
        >
          <ActionButton
            iconName={button.iconName}
            label={button.label}
            onPress={button.onPress}
            disabled={button.disabled}
            testID={button.testID}
            iconColor={iconColor}
            backgroundColor={actionButtonBackgroundColor}
            buttonWidth={actionButtonWidth}
            buttonHeight={actionButtonHeight}
            iconSize={actionIconSize}
            labelSize={actionLabelSize}
            isMobileLayout={isMobileLayout}
          />
        </View>
      ))}
    </View>
  );
};

export default ActionRow;
