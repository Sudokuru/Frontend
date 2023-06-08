import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

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
    <View style={styles().totalStatisticsView}>
      <Text style={styles(reSize, theme.colors.primary).statisticsTitle}>
        Total Game Statistics
      </Text>
      <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 20 }}>
        <View style={{ marginBottom: 10, flexDirection: "row" }}>
          <Text style={styles(reSize).statisticText}>Total Score: </Text>
          <Text style={styles(reSize).statisticValue}>{props.totalScore}</Text>
        </View>
        <View style={styles().statisticView}>
          <Text style={styles(reSize).statisticText}>Games Played: </Text>
          <Text style={styles(reSize).statisticValue}>
            {props.numGamesPlayed}
          </Text>
        </View>
        <View style={styles().statisticView}>
          <Text style={styles(reSize).statisticText}>Fastest Solve Time: </Text>
          <Text style={styles(reSize).statisticValue}>
            {formatTime(props.fastestSolveTime)}
          </Text>
        </View>
        <View style={styles().statisticView}>
          <Text style={styles(reSize).statisticText}>Average Solve Time: </Text>
          <Text style={styles(reSize).statisticValue}>
            {formatTime(props.averageSolveTime)}
          </Text>
        </View>
        <View style={styles().statisticView}>
          <Text style={styles(reSize).statisticText}>Total Solve Time: </Text>
          <Text style={styles(reSize).statisticValue}>
            {formatTime(props.totalSolveTime)}
          </Text>
        </View>
        <View style={styles().statisticView}>
          <Text style={styles(reSize).statisticText}>Total Hints Used: </Text>
          <Text style={styles(reSize).statisticValue}>
            {props.numHintsUsed}
          </Text>
        </View>
        <View style={styles().statisticView}>
          <Text style={styles(reSize).statisticText}>
            Total Wrong Cells Played:{" "}
          </Text>
          <Text style={styles(reSize).statisticValue}>
            {props.numWrongCellsPlayed}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = (reSize?: number, themeColor?: any) =>
  StyleSheet.create({
    totalStatisticsView: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 30,
    },
    statisticsTitle: {
      fontSize: reSize ? reSize / 20 : 20,
      color: themeColor,
      fontWeight: "bold",
      marginBottom: 10,
    },
    statisticView: {
      marginBottom: 10,
      flexDirection: "row",
    },
    statisticText: {
      fontSize: reSize ? reSize / 22 : 20,
      color: "#025E73",
    },
    statisticValue: {
      fontSize: reSize ? reSize / 20 : 20,
      fontWeight: "bold",
      color: "#D9A05B",
    },
  });

export default TotalStatistics;
