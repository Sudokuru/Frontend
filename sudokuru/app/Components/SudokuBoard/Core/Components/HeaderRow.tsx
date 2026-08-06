import React from "react";
import { Image, View } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BoardObjectProps } from "../../../../Functions/LocalDatabase";
import { useCellSize, formatTime } from "../Functions/BoardFunctions";
import { useTheme } from "../../../../Contexts/ThemeContext";
import { useLogo } from "../../../../Styling/logos";
import { GOLD_COLOR, MISTAKE_COLOR } from "../../../../Styling/HighlightColors";
import { DEFAULT_FONT } from "../../../../Styling/theme";

interface HeaderRowProps {
  sudokuBoard: BoardObjectProps;
  headerRowTitle: (sudokuBoard: BoardObjectProps) => string;
  headerRowHintCount: (sudokuBoard: BoardObjectProps) => string;
}

const getMistakeStatValue = (sudokuBoard: BoardObjectProps): string => {
  return `${sudokuBoard.statistics.numWrongCellsPlayed}`;
};

const HeaderRow = (props: HeaderRowProps) => {
  const { sudokuBoard, headerRowTitle, headerRowHintCount } = props;

  const currentTime = sudokuBoard.statistics.time;
  const cellSize = useCellSize();
  const { theme } = useTheme();
  const mobileCompactScale = 0.75;
  const mobileSpacingScale = 0.5;
  const headerHeightMultiplier = 1.05;

  const boardWidth = cellSize * 9;
  const headerHeight = cellSize * headerHeightMultiplier;
  const headerTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;
  const statPillBackgroundColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const statPillTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;
  const statusIconSize = cellSize * 0.48 * mobileCompactScale;
  const statusTextSize = cellSize * 0.49 * mobileCompactScale;
  const pillHorizontalPadding =
    cellSize * 0.2 * mobileCompactScale * mobileSpacingScale;
  const pillVerticalPadding =
    cellSize * 0.035 * mobileCompactScale * mobileSpacingScale;
  const pillBorderRadius = cellSize * 0.15;
  const pillGap = cellSize * 0.08 * mobileCompactScale * mobileSpacingScale;
  const iconOnlyPillSize = statusIconSize + cellSize * 0.2 * mobileCompactScale;
  const mobileStatPillGap = pillGap;
  const mobileHeaderPuzzleGapOffset = cellSize * 0.08;

  const logoSource = useLogo();
  const logoHeight = cellSize * 0.65;
  const logoWidth = logoHeight * (100 / 45);
  const logoPillWidth = logoWidth + pillHorizontalPadding * 2;

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
          position: "relative",
          paddingRight: logoPillWidth + mobileStatPillGap,
        }}
      >
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            paddingHorizontal: pillHorizontalPadding,
            paddingVertical: pillVerticalPadding * 0.1,
            borderRadius: pillBorderRadius,
            overflow: "hidden",
            backgroundColor: statPillBackgroundColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            testID="sudokuBoardLogo"
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
              fontFamily: DEFAULT_FONT,
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
            color={MISTAKE_COLOR}
            size={statusIconSize}
          />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: pillGap,
              color: statPillTextColor,
              fontFamily: DEFAULT_FONT,
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
            color={GOLD_COLOR}
            size={statusIconSize}
          />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: pillGap,
              color: statPillTextColor,
              fontFamily: DEFAULT_FONT,
              fontSize: statusTextSize,
            }}
          >
            {headerRowHintCount(sudokuBoard)}
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
              fontFamily: DEFAULT_FONT,
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
