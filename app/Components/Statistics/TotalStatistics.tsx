import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Statistic from "./Statistic";

const TotalStatistics = (props: any) => {
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const theme = useTheme();
  const navigation: any = useNavigation();

  // https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds
  const formatTime = (inputSeconds: number) => {
    // Get minutes and remaining seconds
    const days = Math.floor(inputSeconds / (3600 * 24));
    const hours = Math.floor((inputSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((inputSeconds % 3600) / 60);
    const seconds = Math.floor(inputSeconds % 60);
    // Pad with zeros if needed
    const paddedDays = days > 0 ? (days < 10 ? "0" : "") + days + ":" : "";
    const paddedHours =
      hours > 0
        ? (hours < 10 ? "0" : "") + hours + ":"
        : hours == 0 && days != 0
        ? "00"
        : "";
    const paddedMinutes =
      minutes > 0
        ? (minutes < 10 ? "0" : "") + minutes + ":"
        : minutes == 0 && hours != 0
        ? "00"
        : "";
    const paddedSeconds =
      seconds > 0
        ? (seconds < 10 ? "0" : "") + seconds
        : seconds == 0 && minutes != 0
        ? "00"
        : "0";

    // Return formatted string
    return `${paddedDays}${paddedHours}${paddedMinutes}${paddedSeconds}`;
  };

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
        />
        <Statistic
          statisticName="Games Played: "
          statisticValue={props.numGamesPlayed}
        />
        <Statistic
          statisticName="Fastest Solve Time: "
          statisticValue={props.fastestSolveTime}
        />
        <Statistic
          statisticName="Average Solve Time: "
          statisticValue={props.averageSolveTime}
        />
        <Statistic
          statisticName="Total Solve Time: "
          statisticValue={props.totalSolveTime}
        />
        <Statistic
          statisticName="Total Hints Used: "
          statisticValue={props.numHintsUsed}
        />
        <Statistic
          statisticName="Total Wrong Cells Played: "
          statisticValue={props.numWrongCellsPlayed}
        />
      </View>
    </View>
  );
};

export default TotalStatistics;
