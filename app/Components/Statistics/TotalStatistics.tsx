import { View, useWindowDimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";

import Statistic from "./Statistic";
import { formatTime } from "../Sudoku Board/Functions/BoardFunctions";

export interface StatisticsProps {
  totalScore: number;
  numGamesPlayed: number;
  fastestSolveTime: number;
  averageSolveTime: number;
  totalSolveTime: number;
  numHintsUsed: number;
  numWrongCellsPlayed: number;
}

const TotalStatistics = (props: StatisticsProps) => {
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const theme = useTheme();

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
          color: theme.colors.primary,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Total Game Statistics
      </Text>
      <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 20 }}>
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
          statisticName="Total Hints Used: "
          statisticValue={props.numHintsUsed}
          testID="numHintsUsed"
        />
        <Statistic
          statisticName="Total Mistakes Made: "
          statisticValue={props.numWrongCellsPlayed}
          testID="numWrongCellsPlayed"
        />
      </View>
    </View>
  );
};

export default TotalStatistics;
