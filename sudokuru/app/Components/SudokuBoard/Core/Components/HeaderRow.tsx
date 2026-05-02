import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { Image, View } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BoardObjectProps } from "../../../../Functions/LocalDatabase";
import { useCellSize, formatTime } from "../Functions/BoardFunctions";
import { useTheme } from "../../../../Contexts/ThemeContext";

let fallbackHeight = 30;

interface HeaderRowProps {
  sudokuBoard: BoardObjectProps;
  setSudokuBoard: (sudokuBoard: any) => void;
  headerRowTitle: (sudokuBoard: BoardObjectProps) => string;
}

const getHintStatValue = (sudokuBoard: BoardObjectProps): string => {
  if ("numHintsUsed" in sudokuBoard.statistics) {
    return `${sudokuBoard.statistics.numHintsUsed}`;
  }

  return sudokuBoard.statistics.hintUsed ? "1" : "0";
};

const getMistakeStatValue = (sudokuBoard: BoardObjectProps): string => {
  return `${sudokuBoard.statistics.numWrongCellsPlayed}`;
};

const HeaderRow = (props: HeaderRowProps) => {
  const { sudokuBoard, setSudokuBoard, headerRowTitle } = props;

  const currentTime = sudokuBoard.statistics.time;
  const cellSize = useCellSize();
  const { theme } = useTheme();
  const mobileCompactScale = 0.75;
  const mobileSpacingScale = 0.5;
  const headerHeightMultiplier = 1.05;

  const boardWidth = cellSize ? cellSize * 9 : fallbackHeight * 9;
  const headerHeight = cellSize
    ? cellSize * headerHeightMultiplier
    : fallbackHeight * headerHeightMultiplier;
  const headerTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;
  const statPillBackgroundColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const statPillTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;
  const statusIconSize =
    (cellSize ? cellSize * 0.48 : fallbackHeight * 0.48) * mobileCompactScale;
  const statusTextSize =
    (cellSize ? cellSize * 0.49 : fallbackHeight * 0.49) * mobileCompactScale;
  const pillHorizontalPadding = cellSize
    ? cellSize * 0.2 * mobileCompactScale * mobileSpacingScale
    : fallbackHeight * 0.2 * mobileCompactScale * mobileSpacingScale;
  const pillVerticalPadding = cellSize
    ? cellSize * 0.035 * mobileCompactScale * mobileSpacingScale
    : fallbackHeight * 0.035 * mobileCompactScale * mobileSpacingScale;
  const pillBorderRadius = cellSize ? cellSize * 0.15 : fallbackHeight * 0.15;
  const pillGap =
    (cellSize ? cellSize * 0.08 : fallbackHeight * 0.08) *
    mobileCompactScale *
    mobileSpacingScale;
  const iconOnlyPillSize =
    statusIconSize +
    (cellSize ? cellSize * 0.2 : fallbackHeight * 0.2) * mobileCompactScale;
  const mobileStatPillGap = pillGap;
  const mobileHeaderPuzzleGapOffset =
    (cellSize ? cellSize : fallbackHeight) * 0.08;

  const DARK_LOGO = require("../../../../../.assets/goldLogoText.png");
  const LIGHT_LOGO = require("../../../../../.assets/lightBlueLogoText.png");
  const logoSource = theme.useDarkTheme ? DARK_LOGO : LIGHT_LOGO;
  const logoHeight = cellSize ? cellSize * 0.65 : fallbackHeight * 0.65;
  const logoWidth = logoHeight * (100 / 45);

  useFocusEffect(
    React.useCallback(() => {
      let interval = setInterval(() => {
        sudokuBoard.statistics.time = sudokuBoard.statistics.time + 1;
        setSudokuBoard((prevState: BoardObjectProps) => ({
          ...prevState,
          statistics: sudokuBoard.statistics,
        }));
      }, 1000);
      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sudokuBoard.statistics.time]),
  );

  return (
    <View
      style={{
        alignSelf: "center",
        width: boardWidth,
        height: headerHeight,
        marginBottom: -mobileHeaderPuzzleGapOffset,
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <View
          style={{
            paddingHorizontal: pillHorizontalPadding,
            paddingVertical: pillVerticalPadding * 0.1,
            borderRadius: pillBorderRadius,
            overflow: "hidden",
            backgroundColor: statPillBackgroundColor,
            marginRight: mobileStatPillGap,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={logoSource}
            style={{
              height: logoHeight,
              width: logoWidth,
              resizeMode: "contain",
            }}
          />
        </View>
        <View
          testID="difficultyCounter"
          style={{
            paddingHorizontal: pillHorizontalPadding,
            paddingVertical: pillVerticalPadding,
            borderRadius: pillBorderRadius,
            overflow: "hidden",
            backgroundColor: statPillBackgroundColor,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="signal-cellular-3"
            color={theme.colors.primary}
            size={statusIconSize}
          />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: pillGap,
              color: statPillTextColor,
              fontFamily: "Inter_400Regular",
              fontSize: statusTextSize,
            }}
          >
            {headerRowTitle(sudokuBoard)}
          </Text>
        </View>

        <View
          testID="mistakesCounter"
          style={{
            marginLeft: mobileStatPillGap,
            minWidth: iconOnlyPillSize,
            height: iconOnlyPillSize,
            paddingHorizontal: pillHorizontalPadding,
            borderRadius: pillBorderRadius,
            overflow: "hidden",
            backgroundColor: statPillBackgroundColor,
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          <MaterialCommunityIcons
            name="alert-circle"
            color="#FF6B6B"
            size={statusIconSize}
          />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: pillGap,
              color: statPillTextColor,
              fontFamily: "Inter_400Regular",
              fontSize: statusTextSize,
            }}
          >
            {getMistakeStatValue(sudokuBoard)}
          </Text>
        </View>

        <View
          testID="hintsCounter"
          style={{
            marginLeft: mobileStatPillGap,
            minWidth: iconOnlyPillSize,
            height: iconOnlyPillSize,
            paddingHorizontal: pillHorizontalPadding,
            borderRadius: pillBorderRadius,
            overflow: "hidden",
            backgroundColor: statPillBackgroundColor,
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            color="#D9A05B"
            size={statusIconSize}
          />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: pillGap,
              color: statPillTextColor,
              fontFamily: "Inter_400Regular",
              fontSize: statusTextSize,
            }}
          >
            {getHintStatValue(sudokuBoard)}
          </Text>
        </View>

        <View
          testID="timeCounter"
          style={{
            marginLeft: mobileStatPillGap,
            minWidth: iconOnlyPillSize,
            height: iconOnlyPillSize,
            paddingHorizontal: pillHorizontalPadding,
            borderRadius: pillBorderRadius,
            overflow: "hidden",
            backgroundColor: statPillBackgroundColor,
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          <MaterialCommunityIcons
            name="clock-outline"
            color={headerTextColor}
            size={statusIconSize}
          />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: pillGap,
              color: statPillTextColor,
              fontFamily: "Inter_400Regular",
              fontSize: statusTextSize,
            }}
          >
            {formatTime(currentTime)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HeaderRow;
