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

const HeaderRow = (props: HeaderRowProps) => {
  const { sudokuBoard, setSudokuBoard, headerRowTitle, handlePause } = props;

  const currentTime = sudokuBoard.statistics.time;
  const cellSize = useCellSize();
  const navigation = useNavigation();

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
            color: theme.useDarkTheme
              ? theme.semantic.text.inverse
              : theme.semantic.text.info,
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
            color: theme.useDarkTheme
              ? theme.semantic.text.inverse
              : theme.semantic.text.info,
          }}
        >
          {headerRowTitle(sudokuBoard)}
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
