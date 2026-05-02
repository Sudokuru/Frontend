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
  const headerHeight = cellSize ? cellSize * 1.75 : fallbackHeight * 1.75;
  const headerTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;
  const statPillBackgroundColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const statPillTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;
  const statusIconSize = cellSize ? cellSize * 0.48 : fallbackHeight * 0.48;
  const statusTextSize = cellSize ? cellSize * 0.49 : fallbackHeight * 0.49;
  const pillHorizontalPadding = cellSize
    ? cellSize * 0.2
    : fallbackHeight * 0.2;
  const pillVerticalPadding = cellSize
    ? cellSize * 0.04
    : fallbackHeight * 0.04;
  const pillBorderRadius = cellSize ? cellSize * 0.15 : fallbackHeight * 0.15;
  const pillGap = cellSize ? cellSize * 0.08 : fallbackHeight * 0.08;
  const rowGap = cellSize ? cellSize * 0.08 : fallbackHeight * 0.08;
  const statusRowHeight =
    Math.max(statusIconSize, statusTextSize) + pillVerticalPadding * 2;

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
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: rowGap,
            minHeight: statusRowHeight,
          }}
        >
          <View
            testID="difficultyCounter"
            style={{
              marginRight: pillGap,
              paddingHorizontal: pillHorizontalPadding,
              paddingVertical: pillVerticalPadding,
              borderRadius: pillBorderRadius,
              overflow: "hidden",
              backgroundColor: statPillBackgroundColor,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="signal-cellular-3"
              color={theme.colors.primary}
              size={statusIconSize}
            />
            <Text
              style={{
                marginLeft: pillGap,
                color: statPillTextColor,
                fontFamily: "Inter_400Regular",
                fontSize: statusTextSize,
              }}
            >
              {headerRowTitle(sudokuBoard)}
            </Text>
          </View>

          <View
            testID="timeCounter"
            style={{
              paddingHorizontal: pillHorizontalPadding,
              paddingVertical: pillVerticalPadding,
              borderRadius: pillBorderRadius,
              overflow: "hidden",
              backgroundColor: statPillBackgroundColor,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="clock-outline"
              color={headerTextColor}
              size={statusIconSize}
            />
            <Text
              style={{
                marginLeft: pillGap,
                color: statPillTextColor,
                fontFamily: "Inter_400Regular",
                fontSize: statusTextSize,
              }}
            >
              Time: {formatTime(currentTime)}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            minHeight: statusRowHeight,
          }}
        >
          <View
            testID="hintsCounter"
            style={{
              marginRight: pillGap,
              paddingHorizontal: pillHorizontalPadding,
              paddingVertical: pillVerticalPadding,
              borderRadius: pillBorderRadius,
              overflow: "hidden",
              backgroundColor: statPillBackgroundColor,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              color="#D9A05B"
              size={statusIconSize}
            />
            <Text
              style={{
                marginLeft: pillGap,
                color: statPillTextColor,
                fontFamily: "Inter_400Regular",
                fontSize: statusTextSize,
              }}
            >
              {getHintStatText(sudokuBoard)}
            </Text>
          </View>

          <View
            testID="mistakesCounter"
            style={{
              paddingHorizontal: pillHorizontalPadding,
              paddingVertical: pillVerticalPadding,
              borderRadius: pillBorderRadius,
              overflow: "hidden",
              backgroundColor: statPillBackgroundColor,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="alert-circle"
              color="#FF6B6B"
              size={statusIconSize}
            />
            <Text
              style={{
                marginLeft: pillGap,
                color: statPillTextColor,
                fontFamily: "Inter_400Regular",
                fontSize: statusTextSize,
              }}
            >
              {getMistakeStatText(sudokuBoard)}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          marginLeft: pillGap,
          minHeight: statusRowHeight * 2 + rowGap,
          justifyContent: "flex-start",
          alignItems: "flex-end",
        }}
      >
        <View style={{ height: statusRowHeight + rowGap }} />
        <View
          style={{
            height: statusRowHeight,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <PauseButton
            handlePause={() => handlePause(sudokuBoard, navigation)}
            isPaused={false}
          />
        </View>
      </View>
    </View>
  );
};

export default HeaderRow;
