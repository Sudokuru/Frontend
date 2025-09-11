import { Text } from "react-native-paper";
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

  const { theme } = useTheme();

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
          backgroundColor: theme.semantic.text.inverse,
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
        <Statistic
          statisticName="Total Hints Used: "
          statisticValue={props.numHintsUsed}
          testID="numHintsUsed"
        />
        <NumHintsUsedPerStrategy
          numHintsUsedPerStrategy={props.numHintsUsedPerStrategy}
        />
      </View>
    </View>
  );
};

export default TotalStatistics;
