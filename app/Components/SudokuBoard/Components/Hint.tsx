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

  const STRATEGY_FONT_SIZE = 30;

  const hintTitle = (
    <Text
      style={{
        textAlign: "center",
        fontSize: STRATEGY_FONT_SIZE,
        marginBottom: 10,
        color: theme.colors.primary,
      }}
    >
      {formatOneLessonName(hint.strategy)}
    </Text>
  );

  interface StageContent {
    title: boolean;
    content?: string;
  }

  const STAGE_CONFIG: Record<number, StageContent> = {
    1: { title: true },
    2: { title: true, content: hint.info },
    3: { title: true, content: "The hint is located in this region" },
    4: { title: true, content: hint.action },
    5: { title: true, content: hint.action },
  };

  const renderStageContent = (stage: number) => {
    const config = STAGE_CONFIG[stage];
    return (
      <>
        {config.title && hintTitle}
        {config.content && (
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: theme.colors.onBackground,
            }}
          >
            {config.content}
          </Text>
        )}
      </>
    );
  };

  const hintContent = renderStageContent(stage);

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
    <>
      <View
        style={{
          flexDirection: "row",
          width: cellSize ? cellSize * 8 : fallbackHeight * 8,
          justifyContent: "space-evenly",
        }}
      >
        <Pressable onPress={() => incrementStage(-1)} testID={leftButtonTestId}>
          <MaterialCommunityIcons
            color={theme.colors.onBackground}
            name={leftButtonIcon}
            size={cellSize / sizeConst}
          />
        </Pressable>
        <Pressable onPress={() => incrementStage(1)} testID={rightButtonTestId}>
          <MaterialCommunityIcons
            color={theme.colors.onBackground}
            name={rightButtonIcon}
            size={cellSize / sizeConst}
          />
        </Pressable>
      </View>
      <View
        style={{
          maxWidth: (cellSize || fallbackHeight) * 8,
          alignItems: "center",
          flexDirection: "column",
          marginBottom: cellSize
            ? cellSize * (1 / 4)
            : fallbackHeight * (1 / 4),
        }}
      >
        {hintContent}
      </View>
    </>
  );
};

export default Hint;
