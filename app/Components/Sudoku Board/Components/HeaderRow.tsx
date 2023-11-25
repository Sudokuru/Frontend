import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { SudokuBoardProps } from "../../../Functions/LocalStore/DataStore/LocalDatabase";
import { getCellSize, saveGame, formatTime } from "../Functions/BoardFunctions";
import PauseButton from "./PauseButton";

let fallbackHeight = 30;

const HeaderRow = (props: {
  sudokuBoard: SudokuBoardProps;
  setSudokuBoard: any;
}) => {
  //  Header w/ timer and pause button
  const { sudokuBoard, setSudokuBoard } = props;

  const currentTime = sudokuBoard.statistics.time;
  const cellSize = getCellSize();
  const navigation = useNavigation();

  const theme = useTheme();

  // ! Interesting note, whole board will rerender every second because timer is part of board
  // ! May be good to externalize timer into its own react state like before.

  useFocusEffect(
    React.useCallback(() => {
      let interval = setInterval(() => {
        sudokuBoard.statistics.time = sudokuBoard.statistics.time + 1;
        setSudokuBoard({ ...sudokuBoard, statistics: sudokuBoard.statistics });
      }, 1000);
      return () => clearInterval(interval);
    }, [sudokuBoard])
  );

  const handlePause = () => {
    saveGame(sudokuBoard);
    //@ts-ignore
    //todo fix this
    navigation.replace("PlayPage");
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
