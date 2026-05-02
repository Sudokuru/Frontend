import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { range } from "../../SudokuBoardFunctions";
import React from "react";
import { MOBILE_BREAKPOINT, useCellSize } from "../Functions/BoardFunctions";
import { LinearGradient } from "expo-linear-gradient";
import { BoardObjectProps } from "../../../../Functions/LocalDatabase";
import { useTheme } from "../../../../Contexts/ThemeContext";

let fallbackHeight = 30;

// todo rewrite

interface NumberControlProps {
  areNumberButtonsDisabled: boolean;
  updateEntry: (inputValue: number) => void;
  getRemainingCellCountOfValue: (
    sudokuBoard: BoardObjectProps,
    inputValue: number,
  ) => number;
  sudokuBoard: BoardObjectProps;
  progressIndicatorSetting: boolean;
}

const NumberControl = (props: NumberControlProps) => {
  const {
    areNumberButtonsDisabled,
    updateEntry,
    getRemainingCellCountOfValue,
    sudokuBoard,
    progressIndicatorSetting,
  } = props;
  const cellSize = useCellSize();
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const isMobileLayout = width < MOBILE_BREAKPOINT;
  const visualKeyWidthRatio = isMobileLayout ? 100 / 60 : 50 / 60;
  const visualKeyWidth = cellSize
    ? cellSize * visualKeyWidthRatio
    : fallbackHeight * visualKeyWidthRatio;
  const touchKeyWidth = visualKeyWidth;
  const keyHeight = cellSize || fallbackHeight;
  const mobileRowGap = keyHeight * 0.2;
  const controlWidth = cellSize ? cellSize * 9 : fallbackHeight * 9;
  const mobileTopRowButtonGap = Math.max(
    (controlWidth - touchKeyWidth * 5) / 4,
    0,
  );

  const renderNumberButton = (number: number) => {
    const onClick = () => {
      updateEntry(number);
    };

    const numberText = (
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
    );

    if (progressIndicatorSetting) {
      return (
        <Pressable
          key={number}
          onPress={onClick}
          disabled={areNumberButtonsDisabled} // disable also if cell is correct.
          style={{
            width: touchKeyWidth,
            height: keyHeight,
            alignItems: "center",
            justifyContent: "center",
          }}
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
              width: visualKeyWidth,
              height: keyHeight,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: cellSize
                ? cellSize * (10 / 60)
                : fallbackHeight * (10 / 60),
            }}
          >
            {numberText}
          </LinearGradient>
        </Pressable>
      );
    }

    return (
      <Pressable
        key={number}
        onPress={onClick}
        disabled={areNumberButtonsDisabled} // disable also if cell is correct.
        style={{
          width: touchKeyWidth,
          height: keyHeight,
          alignItems: "center",
          justifyContent: "center",
        }}
        testID={"numberControl" + number}
      >
        <View
          style={{
            width: visualKeyWidth,
            height: keyHeight,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.primary,
            borderRadius: cellSize
              ? cellSize * (10 / 60)
              : fallbackHeight * (10 / 60),
          }}
        >
          {numberText}
        </View>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        width: controlWidth,
        height: isMobileLayout ? keyHeight * 2 + mobileRowGap : keyHeight,
        justifyContent: "space-between",
      }}
    >
      {isMobileLayout ? (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {[1, 2, 3, 4, 5].map(renderNumberButton)}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {[6, 7, 8, 9].map((number, index) => (
              <View
                key={number}
                style={{
                  marginRight: index < 3 ? mobileTopRowButtonGap : 0,
                }}
              >
                {renderNumberButton(number)}
              </View>
            ))}
          </View>
        </>
      ) : (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {range(9).map((i) => renderNumberButton(i + 1))}
        </View>
      )}
    </View>
  );
};

export default NumberControl;
