import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

import { useCellSize } from "../Functions/BoardFunctions";
import { range } from "../sudoku";

const fallbackHeight = 30;

// todo rewrite

interface NumberControlProps {
  areNumberButtonsDisabled: boolean;
  updateEntry: (inputValue: number) => void;
}

const NumberControl = (props: NumberControlProps) => {
  const { areNumberButtonsDisabled: prefilled, updateEntry } = props;
  const cellSize = useCellSize();
  const theme = useTheme();
  return (
    <View
      style={{
        width: cellSize ? cellSize * 9 : fallbackHeight * 9,
        height: cellSize ? cellSize : fallbackHeight,
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
        return (
          // Number Keys
          <Pressable
            key={number}
            onPress={onClick}
            disabled={prefilled} // disable also if cell is correct.
            style={{
              width: cellSize
                ? cellSize * (50 / 60)
                : fallbackHeight * (50 / 60),
              height: cellSize ? cellSize : fallbackHeight,
              alignItems: "center",
              backgroundColor: theme.colors.primaryContainer,
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
                color: theme.colors.onPrimaryContainer,
              }}
            >
              {number}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default NumberControl;
