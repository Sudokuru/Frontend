import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { SudokuObjectProps } from "../../../Functions/LocalDatabase";
import {
  getCellSize,
  saveGame,
  formatTime,
  handlePause,
} from "../Functions/BoardFunctions";
import PauseButton from "./PauseButton";

let fallbackHeight = 30;

interface HeaderRowProps {
  sudokuBoard: SudokuObjectProps;
  setSudokuBoard: (sudokuBoard: any) => void;
}

const HeaderRow = (props: HeaderRowProps) => {
  const { sudokuBoard, setSudokuBoard } = props;
  const difficulty = sudokuBoard.statistics.difficulty;

  const currentTime = sudokuBoard.statistics.time;
  const cellSize = getCellSize();
  const navigation = useNavigation();

  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      let interval = setInterval(() => {
        sudokuBoard.statistics.time = sudokuBoard.statistics.time + 1;
        setSudokuBoard((prevState: SudokuObjectProps) => ({
          ...prevState,
          statistics: sudokuBoard.statistics,
        }));
      }, 1000);
      return () => clearInterval(interval);
    }, [sudokuBoard.statistics.time])
  );

  return (
    <View
      style={{
        alignSelf: "center",
        width: cellSize ? cellSize * 9 : fallbackHeight * 9,
        height: cellSize ? cellSize * (3 / 4) : fallbackHeight * (3 / 4),
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginTop: cellSize ? cellSize * (1 / 2) : fallbackHeight * (1 / 2),
      }}
    >
      <View style={{ width: cellSize * 3 }}>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: cellSize
              ? cellSize * (1 / 3) + 1
              : fallbackHeight * (1 / 3) + 1,
            color: theme.colors.onBackground,
          }}
        >
          Time: {formatTime(currentTime)}
        </Text>
      </View>
      <View style={{ width: cellSize * 3, alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: cellSize
              ? cellSize * (1 / 3.5) + 1
              : fallbackHeight * (1 / 3.5) + 1,
            color: theme.colors.onBackground,
          }}
        >
          Difficulty: {difficulty}
        </Text>
      </View>
      <View style={{ width: cellSize * 3, alignItems: "flex-end" }}>
        <PauseButton
          handlePause={() => handlePause(sudokuBoard, navigation)}
          isPaused={false}
        />
      </View>
    </View>
  );
};

export default HeaderRow;
