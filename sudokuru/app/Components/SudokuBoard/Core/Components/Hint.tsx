import { Text } from "react-native-paper";
import { HintObjectProps } from "../../SudokuBoard";
import { formatOneLessonName } from "../../../../Functions/learnedLessons";
import { Pressable, View, useWindowDimensions } from "react-native";
import { useCellSize } from "../Functions/BoardFunctions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { SudokuVariantMethods } from "../../SudokuBoardSharedFunctionsController";
import { useTheme } from "../../../../Contexts/ThemeContext";

interface HintProps extends HintObjectProps {
  incrementStage: (
    stageOffset: -1 | 0 | 1,
    finishSudokuGame: SudokuVariantMethods["finishSudokuGame"],
  ) => void;
  finishSudokuGame: SudokuVariantMethods["finishSudokuGame"];
}

const Hint = (hintProps: HintProps) => {
  const { stage, hint, maxStage, incrementStage, finishSudokuGame } = hintProps;

  const cellSize = useCellSize();
  const { height } = useWindowDimensions();
  const { theme } = useTheme();

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
    action: -1 | 0 | 1;
  }

  const getButtonConfigs = (
    stage: number,
    maxStage: number,
  ): [ButtonConfig, ButtonConfig] => {
    const leftButton: ButtonConfig =
      stage === 1
        ? { testId: "hintExit", icon: "close", action: 0 }
        : { testId: "hintArrowLeft", icon: "arrow-left", action: -1 };

    const rightButton: ButtonConfig =
      stage === maxStage
        ? { testId: "hintFinish", icon: "check", action: 1 }
        : { testId: "hintArrowRight", icon: "arrow-right", action: 1 };

    return [leftButton, rightButton];
  };

  const [leftButton, rightButton] = getButtonConfigs(stage, maxStage);

  const getResponsiveSize = (multiplier: number) => {
    const baseSize = cellSize || FALLBACK_HEIGHT;
    return baseSize * multiplier;
  };

  const navButtonSize = getResponsiveSize(0.82);
  const navButtonGap = getResponsiveSize(0.12);
  const navIconSize = navButtonSize * 0.72;
  const navIconColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;
  const navIconStyle = {
    width: navButtonSize,
    height: navButtonSize,
    lineHeight: navButtonSize,
    textAlign: "center" as const,
    textAlignVertical: "center" as const,
  };
  const navButtonBackgroundColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const showHintExit = stage > 1;
  const leftButtonHitSlop = showHintExit
    ? { top: 12, right: 12, bottom: 0, left: 12 }
    : 12;
  const exitButtonHitSlop = { top: 0, right: 12, bottom: 12, left: 12 };

  const NavButton = ({
    testID,
    icon,
    onPress,
    hitSlop,
    style,
  }: {
    testID: string;
    icon: IconName;
    onPress: () => void;
    hitSlop:
      | number
      | { top: number; right: number; bottom: number; left: number };
    style?: object;
  }) => (
    <Pressable
      onPress={onPress}
      testID={testID}
      hitSlop={hitSlop}
      style={[
        {
          width: navButtonSize,
          height: navButtonSize,
          borderRadius: navButtonSize * 0.22,
          backgroundColor: navButtonBackgroundColor,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        color={navIconColor}
        name={icon}
        size={navIconSize}
        style={navIconStyle}
      />
    </Pressable>
  );

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
      <NavButton
        testID={leftButton.testId}
        icon={leftButton.icon}
        onPress={() => incrementStage(leftButton.action, finishSudokuGame)}
        hitSlop={leftButtonHitSlop}
        style={{
          position: "absolute",
          left: 0,
          top: getResponsiveSize(0.05),
          zIndex: 2,
        }}
      />

      {showHintExit && (
        <NavButton
          testID="hintExit"
          icon="close"
          onPress={() => incrementStage(0, finishSudokuGame)}
          hitSlop={exitButtonHitSlop}
          style={{
            position: "absolute",
            left: 0,
            top: getResponsiveSize(0.05) + navButtonSize + navButtonGap,
            zIndex: 2,
          }}
        />
      )}

      <View
        pointerEvents="none"
        style={{
          width: "100%",
          minHeight: getResponsiveSize(1),
          minWidth: 0,
          paddingHorizontal: getResponsiveSize(1),
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {hintContent}
      </View>

      <NavButton
        testID={rightButton.testId}
        icon={rightButton.icon}
        onPress={() => incrementStage(rightButton.action, finishSudokuGame)}
        hitSlop={12}
        style={{
          position: "absolute",
          right: 0,
          top: getResponsiveSize(0.05),
          zIndex: 2,
        }}
      />
    </View>
  );
};

export default Hint;
