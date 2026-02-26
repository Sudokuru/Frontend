import { List, Text, TouchableRipple } from "react-native-paper";
import { useWindowDimensions, View } from "react-native";
import Statistic from "./Statistic";
import { formatTime } from "../SudokuBoard/Core/Functions/BoardFunctions";
import { SudokuStrategy } from "sudokuru";
import React from "react";
import { NumHintsUsedPerStrategy } from "../NumHintsUsedPerStrategy";
import { useTheme } from "../../Contexts/ThemeContext";

export interface TotalStatisticsProps {
  totalScore: number;
  numGamesPlayed: number;
  fastestSolveTime: number;
  averageSolveTime: number;
  totalSolveTime: number;
  numHintsUsed: number;
  numHintsUsedPerStrategy: {
    hintStrategy: SudokuStrategy;
    numHintsUsed: number;
  }[];
  numWrongCellsPlayed: number;
}

const TotalStatistics = (props: TotalStatisticsProps) => {
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);
  const isLargeScreen = size.width >= 800;
  const statFontSize = Math.max(
    16,
    Math.min(reSize / (isLargeScreen ? 19 : 23), isLargeScreen ? 30 : 24),
  );

  const { theme } = useTheme();
  const [isHintsBreakdownExpanded, setHintsBreakdownExpanded] =
    React.useState(false);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 30,
      }}
    >
      <Text
        style={{
          fontSize: reSize ? reSize / 20 : 20,
          color: theme.semantic.text.primary,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Total Game Statistics
      </Text>
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 10,
          padding: 20,
        }}
      >
        <Statistic
          statisticName="Total Score: "
          statisticValue={props.totalScore}
          testID="totalScore"
        />
        <Statistic
          statisticName="Games Played: "
          statisticValue={props.numGamesPlayed}
          testID="numGamesPlayed"
        />
        <Statistic
          statisticName="Fastest Solve Time: "
          statisticValue={formatTime(props.fastestSolveTime)}
          testID="fastestSolveTime"
        />
        <Statistic
          statisticName="Average Solve Time: "
          statisticValue={formatTime(props.averageSolveTime)}
          testID="averageSolveTime"
        />
        <Statistic
          statisticName="Total Solve Time: "
          statisticValue={formatTime(props.totalSolveTime)}
          testID="totalSolveTime"
        />
        <Statistic
          statisticName="Total Mistakes Made: "
          statisticValue={props.numWrongCellsPlayed}
          testID="numWrongCellsPlayed"
        />
        <TouchableRipple
          onPress={() => setHintsBreakdownExpanded(!isHintsBreakdownExpanded)}
          style={{ marginBottom: 8 }}
          rippleColor={theme.colors.border}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "baseline",
              flexWrap: "wrap",
            }}
          >
            <Text
              style={{
                color: theme.semantic.text.quaternary,
                fontSize: statFontSize,
                lineHeight: statFontSize * 1.2,
                marginRight: 2,
              }}
            >
              {"Total Hints Used: "}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  color: theme.semantic.text.primary,
                  fontSize: statFontSize,
                  lineHeight: statFontSize * 1.2,
                  fontWeight: "bold",
                }}
                testID="numHintsUsed"
              >
                {props.numHintsUsed}
              </Text>
              <List.Icon
                icon={isHintsBreakdownExpanded ? "chevron-up" : "chevron-down"}
                color={theme.semantic.text.primary}
                style={{ margin: 0 }}
              />
            </View>
          </View>
        </TouchableRipple>
        {isHintsBreakdownExpanded ? (
          <NumHintsUsedPerStrategy
            numHintsUsedPerStrategy={props.numHintsUsedPerStrategy}
          />
        ) : null}
      </View>
    </View>
  );
};

export default TotalStatistics;
