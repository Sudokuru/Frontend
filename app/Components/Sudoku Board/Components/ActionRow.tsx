import { getCellSize } from "../Functions/BoardFunctions";
import { useTheme } from "react-native-paper";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import React from "react";

const ActionRow = (props: any) => {
  const {
    history,
    prefilled,
    inNoteMode,
    undo,
    toggleNoteMode,
    eraseSelected,
    toggleHintMode,
    updateBoardInPlace,
    inHintMode,
    boardHasConflict,
  } = props;
  const cellSize = getCellSize();
  const theme = useTheme();

  const sizeConst = Platform.OS == "web" ? 1.5 : 1;

  return (
    <View style={styles(cellSize).actionControlRow}>
      {/* Undo */}
      <Pressable
        onPress={undo}
        disabled={!history.size || inHintMode}
        testID={"undoButton"}
      >
        <MaterialCommunityIcons
          color={theme.colors.onBackground}
          name="undo"
          size={cellSize / sizeConst}
        />
      </Pressable>
      {/* Note mode */}
      <Pressable onPress={toggleNoteMode} disabled={inHintMode}>
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
      <Pressable onPress={eraseSelected} disabled={prefilled || inHintMode}>
        <MaterialCommunityIcons
          color={theme.colors.onBackground}
          name="eraser"
          size={cellSize / sizeConst}
        />
      </Pressable>
      {/* Hint */}
      <Pressable
        testID={"hintButton"}
        onPress={
          !boardHasConflict() ? updateBoardInPlace && toggleHintMode : null
        }
      >
        <MaterialCommunityIcons
          color={theme.colors.onBackground}
          name="help"
          size={cellSize / sizeConst}
        />
      </Pressable>
    </View>
  );
};

let fallbackHeight = 30;

const styles = (cellSize?: number, themeColor?: any) =>
  StyleSheet.create({
    actionControlRow: {
      width: cellSize ? cellSize * 8 : fallbackHeight * 8,
      height: cellSize ? cellSize : fallbackHeight,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      marginBottom: cellSize ? cellSize * (1 / 4) : fallbackHeight * (1 / 4),
    },
  });

ActionRow.propTypes = {
  inNoteMode: PropTypes.bool.isRequired,
  prefilled: PropTypes.bool.isRequired,
  undo: PropTypes.func.isRequired,
  toggleNoteMode: PropTypes.func.isRequired,
  eraseSelected: PropTypes.func.isRequired,
  toggleHintMode: PropTypes.func.isRequired,
  updateBoardInPlace: PropTypes.func.isRequired,
  inHintMode: PropTypes.bool.isRequired,
  boardHasConflict: PropTypes.func.isRequired,
};

export default ActionRow;
