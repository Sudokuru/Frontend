import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { useTheme, Text } from "react-native-paper";

import PauseButton from "./PauseButton";
import { SudokuObjectProps } from "../../../Functions/LocalDatabase";
import { useCellSize, saveGame, formatTime } from "../Functions/BoardFunctions";

const fallbackHeight = 30;

interface HeaderRowProps {
  sudokuBoard: SudokuObjectProps;
  setSudokuBoard: (sudokuBoard: any) => void;
}

const HeaderRow = (props: HeaderRowProps) => {
  const { sudokuBoard, setSudokuBoard } = props;

  const currentTime = sudokuBoard.statistics.time;
  const cellSize = useCellSize();
  const navigation = useNavigation();

  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(() => {
        sudokuBoard.statistics.time = sudokuBoard.statistics.time + 1;
        setSudokuBoard((prevState: SudokuObjectProps) => ({
          ...prevState,
          statistics: sudokuBoard.statistics,
        }));
      }, 1000);
      return () => clearInterval(interval);
    }, [sudokuBoard.statistics.time]),
  );

  const handlePause = () => {
    saveGame(sudokuBoard);
    navigation.goBack();
  };

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
      <PauseButton handlePause={handlePause} isPaused={false} />
    </View>
  );
};

export default HeaderRow;
