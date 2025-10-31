import { Text } from "react-native-paper";
import { HintObjectProps } from "../../SudokuBoard";
import { formatOneLessonName } from "../../../../Functions/learnedLessons";
import { Platform, Pressable, View } from "react-native";
import { useCellSize } from "../Functions/BoardFunctions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTheme } from "../../../../Contexts/ThemeContext";

interface HintProps extends HintObjectProps {
  incrementStage: (stageOffset: number) => void;
}

const Hint = (hintProps: HintProps) => {
  const { stage, hint, maxStage, incrementStage } = hintProps;

  const cellSize = useCellSize();
  const { theme } = useTheme();

  const sizeConst = Platform.OS === "web" ? 1.5 : 1;
  let FALLBACK_HEIGHT = 30;

  const STRATEGY_FONT_SIZE = 30;

  const hintTitle = (
    <Text
      style={{
        textAlign: "center",
        fontSize: STRATEGY_FONT_SIZE,
        marginBottom: 10,
        color: theme.semantic.text.primary,
      }}
    >
      {formatOneLessonName(hint.strategy)}
    </Text>
  );

  interface HintStageContent {
    title: boolean;
    content?: string;
  }

  const STAGE_CONFIG: Record<number, HintStageContent> = {
    1: { title: true },
    2: { title: true, content: hint.info },
    3: { title: true, content: "The hint is located in this region" },
    4: { title: true, content: hint.action },
    5: { title: true, content: hint.action },
  };

  const renderHintStageContent = (stage: number) => {
    const config = STAGE_CONFIG[stage];
    return (
      <>
        {config.title && hintTitle}
        {config.content && (
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: theme.useDarkTheme
                ? theme.semantic.text.inverse
                : theme.semantic.text.info,
            }}
          >
            {config.content}
          </Text>
        )}
      </>
    );
  };

  const hintContent = renderHintStageContent(stage);

  type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

  interface ButtonConfig {
    testId: string;
    icon: IconName;
  }

  const getButtonConfigs = (
    stage: number,
    maxStage: number,
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

  const getResponsiveSize = (multiplier: number) => {
    const baseSize = cellSize || FALLBACK_HEIGHT;
    return baseSize * multiplier;
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          width: getResponsiveSize(8),
          justifyContent: "space-evenly",
        }}
      >
        <Pressable
          onPress={() => incrementStage(-1)}
          testID={leftButton.testId}
        >
          <MaterialCommunityIcons
            color={
              theme.useDarkTheme
                ? theme.semantic.text.inverse
                : theme.semantic.text.info
            }
            name={leftButton.icon}
            size={cellSize / sizeConst}
          />
        </Pressable>
        <Pressable
          onPress={() => incrementStage(1)}
          testID={rightButton.testId}
        >
          <MaterialCommunityIcons
            color={
              theme.useDarkTheme
                ? theme.semantic.text.inverse
                : theme.semantic.text.info
            }
            name={rightButton.icon}
            size={cellSize / sizeConst}
          />
        </Pressable>
      </View>
      <View
        style={{
          maxWidth: getResponsiveSize(8),
          alignItems: "center",
          flexDirection: "column",
          marginBottom: getResponsiveSize(0.25),
        }}
      >
        {hintContent}
      </View>
    </>
  );
};

export default Hint;
