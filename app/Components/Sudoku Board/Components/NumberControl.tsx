import { useTheme } from "react-native-paper";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { range } from "../sudoku";
import React from "react";
import { getCellSize } from "../Functions/BoardFunctions";

const NumberControl = (props: any) => {
  const { prefilled, inNoteMode, updateEntry, inHintMode } = props;
  const cellSize = getCellSize();
  const theme = useTheme();
  return (
    <View style={styles(cellSize).numberControlRow}>
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
            disabled={prefilled || inHintMode}
            style={
              styles(cellSize, theme.colors.primaryContainer).numberContainer
            }
            testID={"numberControl" + number}
          >
            <Text
              style={
                styles(cellSize, theme.colors.onPrimaryContainer)
                  .numberControlText
              }
            >
              {number}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

let fallbackHeight = 30;

const styles = (cellSize?: number, themeColor?: any) =>
  StyleSheet.create({
    numberContainer: {
      width: cellSize ? cellSize * (50 / 60) : fallbackHeight * (50 / 60),
      height: cellSize ? cellSize : fallbackHeight,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
      textAlign: "center",
      backgroundColor: themeColor,
      borderRadius: cellSize
        ? cellSize * (10 / 60)
        : fallbackHeight * (10 / 60),
    },
    numberControlRow: {
      width: cellSize ? cellSize * 9 : fallbackHeight * 9,
      height: cellSize ? cellSize : fallbackHeight,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    numberControlText: {
      fontFamily: "Inter_400Regular",
      fontSize: cellSize
        ? cellSize * (3 / 4) + 1
        : fallbackHeight * (3 / 4) + 1,
      color: themeColor,
    },
  });

export default NumberControl;
