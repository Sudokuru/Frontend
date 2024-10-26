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

  type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

  interface ButtonConfig {
    testId: string;
    icon: IconName;
  }

  const getButtonConfigs = (
    stage: number,
    maxStage: number
  ): [ButtonConfig, ButtonConfig] => [
    // left button
    stage === 1
      ? { testId: "hintExit", icon: "alpha-x-circle-outline" }
      : { testId: "hintArrowLeft", icon: "arrow-left-circle-outline" },
    // right button
    stage === maxStage
      ? { testId: "hintFinish", icon: "check-circle-outline" }
      : { testId: "hintArrowRight", icon: "arrow-right-circle-outline" },
  ];

  const [leftButton, rightButton] = getButtonConfigs(stage, maxStage);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          width: cellSize ? cellSize * 8 : fallbackHeight * 8,
          justifyContent: "space-evenly",
        }}
      >
        <Pressable
          onPress={() => incrementStage(-1)}
          testID={leftButton.testId}
        >
          <MaterialCommunityIcons
            color={theme.colors.onBackground}
            name={leftButton.icon}
            size={cellSize / sizeConst}
          />
        </Pressable>
        <Pressable
          onPress={() => incrementStage(1)}
          testID={rightButton.testId}
        >
          <MaterialCommunityIcons
            color={theme.colors.onBackground}
            name={rightButton.icon}
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
