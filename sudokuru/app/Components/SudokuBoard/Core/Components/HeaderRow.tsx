import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { BoardObjectProps } from "../../../../Functions/LocalDatabase";
import { useCellSize, formatTime } from "../Functions/BoardFunctions";
import PauseButton from "./PauseButton";
import { useTheme } from "../../../../Contexts/ThemeContext";

let fallbackHeight = 30;

interface HeaderRowProps {
  sudokuBoard: BoardObjectProps;
  setSudokuBoard: (sudokuBoard: any) => void;
  headerRowTitle: (sudokuBoard: BoardObjectProps) => string;
  handlePause: (sudokuBoard: BoardObjectProps, navigation: any) => void;
}

const getHintStatText = (sudokuBoard: BoardObjectProps): string => {
  if ("numHintsUsed" in sudokuBoard.statistics) {
    return `Hints: ${sudokuBoard.statistics.numHintsUsed}`;
  }

  return `Hint: ${sudokuBoard.statistics.hintUsed ? "Used" : "None"}`;
};

const getMistakeStatText = (sudokuBoard: BoardObjectProps): string => {
  return `Mistakes: ${sudokuBoard.statistics.numWrongCellsPlayed}`;
};

const HeaderRow = (props: HeaderRowProps) => {
  const { sudokuBoard, setSudokuBoard, headerRowTitle, handlePause } = props;

  const currentTime = sudokuBoard.statistics.time;
  const cellSize = useCellSize();
  const navigation = useNavigation();

  const boardWidth = cellSize ? cellSize * 9 : fallbackHeight * 9;
  const sectionWidth = boardWidth / 3;
  const headerHeight = cellSize ? cellSize * 1.35 : fallbackHeight * 1.35;

  const { theme } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      let interval = setInterval(() => {
        sudokuBoard.statistics.time = sudokuBoard.statistics.time + 1;
        setSudokuBoard((prevState: BoardObjectProps) => ({
          ...prevState,
          statistics: sudokuBoard.statistics,
        }));
      }, 1000);
      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sudokuBoard.statistics.time]),
  );

  return (
    <View
      style={{
        alignSelf: "center",
        width: boardWidth,
        height: headerHeight,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <View style={{ width: sectionWidth }}>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: cellSize ? cellSize * 0.42 : fallbackHeight * 0.42,
            color: theme.useDarkTheme
              ? theme.semantic.text.inverse
              : theme.semantic.text.info,
          }}
        >
          Time: {formatTime(currentTime)}
        </Text>
        <Text
          testID="mistakesCounter"
          style={{
            marginTop: cellSize ? cellSize * 0.06 : fallbackHeight * 0.06,
            paddingHorizontal: cellSize ? cellSize * 0.2 : fallbackHeight * 0.2,
            paddingVertical: cellSize ? cellSize * 0.04 : fallbackHeight * 0.04,
            borderRadius: cellSize ? cellSize * 0.15 : fallbackHeight * 0.15,
            alignSelf: "flex-start",
            overflow: "hidden",
            backgroundColor: theme.colors.surface,
            color: theme.semantic.text.info,
            fontFamily: "Inter_400Regular",
            fontSize: cellSize ? cellSize * 0.21 : fallbackHeight * 0.21,
          }}
        >
          {getMistakeStatText(sudokuBoard)}
        </Text>
      </View>
      <View style={{ width: sectionWidth, alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: cellSize ? cellSize * 0.39 : fallbackHeight * 0.39,
            color: theme.useDarkTheme
              ? theme.semantic.text.inverse
              : theme.semantic.text.info,
          }}
        >
          {headerRowTitle(sudokuBoard)}
        </Text>
        <Text
          testID="hintsCounter"
          style={{
            marginTop: cellSize ? cellSize * 0.06 : fallbackHeight * 0.06,
            paddingHorizontal: cellSize ? cellSize * 0.2 : fallbackHeight * 0.2,
            paddingVertical: cellSize ? cellSize * 0.04 : fallbackHeight * 0.04,
            borderRadius: cellSize ? cellSize * 0.15 : fallbackHeight * 0.15,
            overflow: "hidden",
            backgroundColor: theme.colors.surface,
            color: theme.semantic.text.info,
            fontFamily: "Inter_400Regular",
            fontSize: cellSize ? cellSize * 0.21 : fallbackHeight * 0.21,
          }}
        >
          {getHintStatText(sudokuBoard)}
        </Text>
      </View>
      <View style={{ width: sectionWidth, alignItems: "flex-end" }}>
        <PauseButton
          handlePause={() => handlePause(sudokuBoard, navigation)}
          isPaused={false}
        />
      </View>
    </View>
  );
};

export default HeaderRow;
