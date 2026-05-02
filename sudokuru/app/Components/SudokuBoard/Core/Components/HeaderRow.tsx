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
  const sectionWidth = boardWidth / 3;
  const headerHeight = cellSize ? cellSize * 1.15 : fallbackHeight * 1.15;
  const headerTextColor = theme.useDarkTheme
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
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          width: boardWidth,
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        <View style={{ width: sectionWidth, justifyContent: "center" }}>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: cellSize ? cellSize * 0.42 : fallbackHeight * 0.42,
              color: headerTextColor,
            }}
          >
            Time: {formatTime(currentTime)}
          </Text>
          <View
            style={{
              marginTop: cellSize ? cellSize * 0.06 : fallbackHeight * 0.06,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              testID="hintsCounter"
              style={{
                marginRight: cellSize ? cellSize * 0.08 : fallbackHeight * 0.08,
                paddingHorizontal: cellSize
                  ? cellSize * 0.2
                  : fallbackHeight * 0.2,
                paddingVertical: cellSize
                  ? cellSize * 0.04
                  : fallbackHeight * 0.04,
                borderRadius: cellSize
                  ? cellSize * 0.15
                  : fallbackHeight * 0.15,
                overflow: "hidden",
                backgroundColor: theme.colors.surface,
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
                  marginLeft: cellSize
                    ? cellSize * 0.08
                    : fallbackHeight * 0.08,
                  color: headerTextColor,
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
                paddingHorizontal: cellSize
                  ? cellSize * 0.2
                  : fallbackHeight * 0.2,
                paddingVertical: cellSize
                  ? cellSize * 0.04
                  : fallbackHeight * 0.04,
                borderRadius: cellSize
                  ? cellSize * 0.15
                  : fallbackHeight * 0.15,
                alignSelf: "flex-start",
                overflow: "hidden",
                backgroundColor: theme.colors.surface,
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
                  marginLeft: cellSize
                    ? cellSize * 0.08
                    : fallbackHeight * 0.08,
                  color: headerTextColor,
                  fontFamily: "Inter_400Regular",
                  fontSize: cellSize ? cellSize * 0.21 : fallbackHeight * 0.21,
                }}
              >
                {getMistakeStatText(sudokuBoard)}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: sectionWidth,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: cellSize ? cellSize * 0.39 : fallbackHeight * 0.39,
              color: headerTextColor,
            }}
          >
            {headerRowTitle(sudokuBoard)}
          </Text>
        </View>
        <View
          style={{
            width: sectionWidth,
            alignItems: "flex-end",
            justifyContent: "center",
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
