import { Text, useTheme } from "react-native-paper";
import { HintObjectProps } from "../SudokuBoard";
import { formatOneLessonName } from "../../../Functions/learnedLessons";
import { Platform, Pressable, View } from "react-native";
import { getCellSize } from "../Functions/BoardFunctions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

interface HintProps extends HintObjectProps {
  incrementStage: (stageOffset: number) => void;
}

const Hint = (hintProps: HintProps) => {
  const { stage, hint, maxStage, incrementStage } = hintProps;

  const cellSize = getCellSize();
  const theme = useTheme();

  const sizeConst = Platform.OS == "web" ? 1.5 : 1;
  let fallbackHeight = 30;

  let hintContent: React.JSX.Element;
  console.log(stage);
  switch (stage) {
    case 1:
      hintContent = <Text>{formatOneLessonName(hint.strategy)}</Text>;
    case 2:
      hintContent = (
        <Text>
          {formatOneLessonName(hint.strategy)}
          {"\n"}
          {hint.cause}
        </Text>
      );
    default:
      hintContent = <Text>{formatOneLessonName(hint.strategy)}</Text>;
  }

  let leftButtonTestId = "hintArrowLeft";
  let leftButtonIcon: any = "arrow-left-circle-outline";
  let rightButtonTestId = "hintArrowRight";
  let rightButtonIcon: any = "arrow-right-circle-outline";
  if (stage == maxStage) {
    rightButtonTestId = "hintFinish";
    rightButtonIcon = "check-circle-outline";
  } else if (stage == 1) {
    leftButtonTestId = "hintExit";
    leftButtonIcon = "alpha-x-circle-outline";
  }

  return (
    <View
      style={{
        width: cellSize ? cellSize * 8 : fallbackHeight * 8,
        height: cellSize ? cellSize : fallbackHeight,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: cellSize ? cellSize * (1 / 4) : fallbackHeight * (1 / 4),
      }}
    >
      <Pressable onPress={() => incrementStage(-1)} testID={leftButtonTestId}>
        <MaterialCommunityIcons
          color={theme.colors.onBackground}
          name={leftButtonIcon}
          size={cellSize / sizeConst}
        />
      </Pressable>
      {hintContent}
      <Pressable onPress={() => incrementStage(1)} testID={rightButtonTestId}>
        <MaterialCommunityIcons
          color={theme.colors.onBackground}
          name={rightButtonIcon}
          size={cellSize / sizeConst}
        />
      </Pressable>
    </View>
  );
};

export default Hint;
