import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  const { theme } = useTheme();

  const boardWidth = cellSize ? cellSize * 9 : fallbackHeight * 9;
  const headerHeight = cellSize ? cellSize * 1.15 : fallbackHeight * 1.15;
  const headerTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;
  const statPillBackgroundColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const statPillTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;

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
        alignItems: "flex-end",
        flexDirection: "row",
        paddingBottom: cellSize ? cellSize * 0.05 : fallbackHeight * 0.05,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: cellSize ? cellSize * 0.18 : fallbackHeight * 0.18,
        }}
      >
        <View
          testID="difficultyCounter"
          style={{
            marginRight: cellSize ? cellSize * 0.08 : fallbackHeight * 0.08,
            paddingHorizontal: cellSize ? cellSize * 0.2 : fallbackHeight * 0.2,
            paddingVertical: cellSize ? cellSize * 0.04 : fallbackHeight * 0.04,
            borderRadius: cellSize ? cellSize * 0.15 : fallbackHeight * 0.15,
            overflow: "hidden",
            backgroundColor: statPillBackgroundColor,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="signal-cellular-3"
            color={theme.colors.primary}
            size={cellSize ? cellSize * 0.2 : fallbackHeight * 0.2}
          />
          <Text
            style={{
              marginLeft: cellSize ? cellSize * 0.08 : fallbackHeight * 0.08,
              color: statPillTextColor,
              fontFamily: "Inter_400Regular",
              fontSize: cellSize ? cellSize * 0.21 : fallbackHeight * 0.21,
            }}
          >
            {headerRowTitle(sudokuBoard)}
          </Text>
        </View>

        <View
          testID="hintsCounter"
          style={{
            marginRight: cellSize ? cellSize * 0.08 : fallbackHeight * 0.08,
            paddingHorizontal: cellSize ? cellSize * 0.2 : fallbackHeight * 0.2,
            paddingVertical: cellSize ? cellSize * 0.04 : fallbackHeight * 0.04,
            borderRadius: cellSize ? cellSize * 0.15 : fallbackHeight * 0.15,
            overflow: "hidden",
            backgroundColor: statPillBackgroundColor,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            color="#D9A05B"
            size={cellSize ? cellSize * 0.2 : fallbackHeight * 0.2}
          />
          <Text
            style={{
              marginLeft: cellSize ? cellSize * 0.08 : fallbackHeight * 0.08,
              color: statPillTextColor,
              fontFamily: "Inter_400Regular",
              fontSize: cellSize ? cellSize * 0.21 : fallbackHeight * 0.21,
            }}
          >
            {getHintStatText(sudokuBoard)}
          </Text>
        </View>

        <View
          testID="mistakesCounter"
          style={{
            marginRight: cellSize ? cellSize * 0.08 : fallbackHeight * 0.08,
            paddingHorizontal: cellSize ? cellSize * 0.2 : fallbackHeight * 0.2,
            paddingVertical: cellSize ? cellSize * 0.04 : fallbackHeight * 0.04,
            borderRadius: cellSize ? cellSize * 0.15 : fallbackHeight * 0.15,
            overflow: "hidden",
            backgroundColor: statPillBackgroundColor,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="alert-circle"
            color="#FF6B6B"
            size={cellSize ? cellSize * 0.2 : fallbackHeight * 0.2}
          />
          <Text
            style={{
              marginLeft: cellSize ? cellSize * 0.08 : fallbackHeight * 0.08,
              color: statPillTextColor,
              fontFamily: "Inter_400Regular",
              fontSize: cellSize ? cellSize * 0.21 : fallbackHeight * 0.21,
            }}
          >
            {getMistakeStatText(sudokuBoard)}
          </Text>
        </View>

        <View
          testID="timeCounter"
          style={{
            paddingHorizontal: cellSize ? cellSize * 0.2 : fallbackHeight * 0.2,
            paddingVertical: cellSize ? cellSize * 0.04 : fallbackHeight * 0.04,
            borderRadius: cellSize ? cellSize * 0.15 : fallbackHeight * 0.15,
            overflow: "hidden",
            backgroundColor: statPillBackgroundColor,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="clock-outline"
            color={headerTextColor}
            size={cellSize ? cellSize * 0.2 : fallbackHeight * 0.2}
          />
          <Text
            style={{
              marginLeft: cellSize ? cellSize * 0.08 : fallbackHeight * 0.08,
              color: statPillTextColor,
              fontFamily: "Inter_400Regular",
              fontSize: cellSize ? cellSize * 0.21 : fallbackHeight * 0.21,
            }}
          >
            Time: {formatTime(currentTime)}
          </Text>
        </View>
      </View>

      <PauseButton
        handlePause={() => handlePause(sudokuBoard, navigation)}
        isPaused={false}
      />
    </View>
  );
};

export default HeaderRow;
