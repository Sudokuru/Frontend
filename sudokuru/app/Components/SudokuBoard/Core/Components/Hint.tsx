import { Text } from "react-native-paper";
import { HintObjectProps } from "../../SudokuBoard";
import { formatOneLessonName } from "../../../../Functions/learnedLessons";
import { Platform, Pressable, View, useWindowDimensions } from "react-native";
import { useCellSize } from "../Functions/BoardFunctions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { SudokuVariantMethods } from "../../SudokuBoardSharedFunctionsController";
import { useTheme } from "../../../../Contexts/ThemeContext";

interface HintProps extends HintObjectProps {
  incrementStage: (
    stageOffset: number,
    finishSudokuGame: SudokuVariantMethods["finishSudokuGame"],
  ) => void;
  finishSudokuGame: SudokuVariantMethods["finishSudokuGame"];
}

const Hint = (hintProps: HintProps) => {
  const { stage, hint, maxStage, incrementStage, finishSudokuGame } = hintProps;

  const cellSize = useCellSize();
  const { height } = useWindowDimensions();
  const { theme } = useTheme();

  const sizeConst = Platform.OS === "web" ? 1.5 : 1;
  const FALLBACK_HEIGHT = 30;
  const MIN_HEIGHT_FOR_SCALE = 620;
  const MAX_HEIGHT_FOR_SCALE = 980;
  const rawScale =
    1 +
    (height - MIN_HEIGHT_FOR_SCALE) /
      (MAX_HEIGHT_FOR_SCALE - MIN_HEIGHT_FOR_SCALE);
  const hintScale = Math.max(1, Math.min(2, rawScale));
  const strategyFontSize = 18 * hintScale;
  const contentFontSize = 14 * hintScale;

  const hintTitle = (
    <Text
      style={{
        textAlign: "center",
        fontSize: strategyFontSize,
        marginBottom: 2,
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
              fontSize: contentFontSize,
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
      ? { testId: "hintExit", icon: "close" }
      : { testId: "hintArrowLeft", icon: "arrow-left" },
    // right button
    stage === maxStage
      ? { testId: "hintFinish", icon: "check" }
      : { testId: "hintArrowRight", icon: "arrow-right" },
  ];

  const [leftButton, rightButton] = getButtonConfigs(stage, maxStage);

  const getResponsiveSize = (multiplier: number) => {
    const baseSize = cellSize || FALLBACK_HEIGHT;
    return baseSize * multiplier;
  };

  const navButtonSize = getResponsiveSize(0.82);
  const navButtonBackgroundColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;

  return (
    <View
      style={{
        position: "relative",
        width: getResponsiveSize(8.8),
        minHeight: getResponsiveSize(1),
        alignItems: "center",
        justifyContent: "center",
        marginBottom: getResponsiveSize(0.2),
      }}
    >
      <Pressable
        onPress={() => incrementStage(-1, finishSudokuGame)}
        testID={leftButton.testId}
        hitSlop={12}
        style={{
          position: "absolute",
          left: 0,
          top: getResponsiveSize(0.05),
          zIndex: 2,
          width: navButtonSize,
          height: navButtonSize,
          borderRadius: navButtonSize * 0.22,
          backgroundColor: navButtonBackgroundColor,
          alignItems: "center",
          justifyContent: "center",
        }}
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

      <View
        pointerEvents="none"
        style={{
          width: "100%",
          minWidth: 0,
          paddingHorizontal: getResponsiveSize(1),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {hintContent}
      </View>

      <Pressable
        onPress={() => incrementStage(1, finishSudokuGame)}
        testID={rightButton.testId}
        hitSlop={12}
        style={{
          position: "absolute",
          right: 0,
          top: getResponsiveSize(0.05),
          zIndex: 2,
          width: navButtonSize,
          height: navButtonSize,
          borderRadius: navButtonSize * 0.22,
          backgroundColor: navButtonBackgroundColor,
          alignItems: "center",
          justifyContent: "center",
        }}
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
  );
};

export default Hint;
