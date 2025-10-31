import { Pressable, Text, View } from "react-native";
import { range } from "../../SudokuBoardFunctions";
import React from "react";
import { useCellSize } from "../Functions/BoardFunctions";
import { LinearGradient } from "expo-linear-gradient";
import { PreferencesContext } from "../../../../Contexts/PreferencesContext";
import { SudokuObjectProps } from "../../../../Functions/LocalDatabase";
import { useTheme } from "../../../../Contexts/ThemeContext";

let fallbackHeight = 30;

// todo rewrite

interface NumberControlProps {
  areNumberButtonsDisabled: boolean;
  updateEntry: (inputValue: number) => void;
  getRemainingCellCountOfValue: (
    sudokuBoard: SudokuObjectProps,
    inputValue: number,
  ) => number;
  sudokuBoard: SudokuObjectProps;
}

const NumberControl = (props: NumberControlProps) => {
  const {
    areNumberButtonsDisabled,
    updateEntry,
    getRemainingCellCountOfValue,
    sudokuBoard,
  } = props;
  const cellSize = useCellSize();
  const { theme } = useTheme();

  const { progressIndicatorSetting } = React.useContext(PreferencesContext);

  return (
    <View
      style={{
        width: cellSize ? cellSize * 9 : fallbackHeight * 9,
        height: cellSize || fallbackHeight,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {range(9).map((i) => {
        const number = i + 1;
        const onClick = () => {
          updateEntry(number);
        };

        if (progressIndicatorSetting) {
          return (
            // Number Keys
            <Pressable
              key={number}
              onPress={onClick}
              disabled={areNumberButtonsDisabled} // disable also if cell is correct.
              testID={"numberControl" + number}
            >
              <LinearGradient
                colors={[
                  theme.useDarkTheme
                    ? theme.semantic.text.inverse
                    : theme.colors.onSurface,
                  theme.colors.primary,
                ]}
                locations={[
                  1 - getRemainingCellCountOfValue(sudokuBoard, number) / 9,
                  1 - getRemainingCellCountOfValue(sudokuBoard, number) / 9,
                ]}
                style={{
                  width: cellSize
                    ? cellSize * (50 / 60)
                    : fallbackHeight * (50 / 60),
                  height: cellSize || fallbackHeight,
                  alignItems: "center",
                  borderRadius: cellSize
                    ? cellSize * (10 / 60)
                    : fallbackHeight * (10 / 60),
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: cellSize
                      ? cellSize * (3 / 4) + 1
                      : fallbackHeight * (3 / 4) + 1,
                    color: theme.semantic.text.info,
                  }}
                  selectable={false}
                >
                  {number}
                </Text>
              </LinearGradient>
            </Pressable>
          );
        } else {
          return (
            <Pressable
              key={number}
              onPress={onClick}
              disabled={areNumberButtonsDisabled} // disable also if cell is correct.
              style={{
                width: cellSize
                  ? cellSize * (50 / 60)
                  : fallbackHeight * (50 / 60),
                height: cellSize || fallbackHeight,
                alignItems: "center",
                backgroundColor: theme.colors.primary,
                borderRadius: cellSize
                  ? cellSize * (10 / 60)
                  : fallbackHeight * (10 / 60),
              }}
              testID={"numberControl" + number}
            >
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: cellSize
                    ? cellSize * (3 / 4) + 1
                    : fallbackHeight * (3 / 4) + 1,
                  color: theme.colors.primary,
                }}
                selectable={false}
              >
                {number}
              </Text>
            </Pressable>
          );
        }
      })}
    </View>
  );
};

export default NumberControl;
