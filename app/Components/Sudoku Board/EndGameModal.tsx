import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const EndGameModal = (props: any) => {
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const theme = useTheme();
  const navigation: any = useNavigation();

  const formatTime = (seconds: number) => {
    // Get minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    // Pad with zeros if needed
    const paddedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const paddedSeconds = secs < 10 ? "0" + secs : secs;
    // Return formatted string
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 30,
      }}
    >
      <Text style={styles(reSize).totalGameResultsText}>Game Results</Text>
      <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 20 }}>
        <View style={styles().statisticView}>
          <Text style={styles(reSize).statisticText}>Score:</Text>
          <Text style={styles(reSize).statisticValue}>{props.score}</Text>
        </View>
        <View style={styles().statisticView}>
          <Text style={styles(reSize).statisticText}>Time Spent Playing:</Text>
          <Text style={styles(reSize).statisticValue}>
            {formatTime(props.time)}
          </Text>
        </View>
        <View style={styles().statisticView}>
          <Text style={styles(reSize).statisticText}>
            Number of Hints Used:
          </Text>
          <Text style={styles(reSize).statisticValue}>
            {props.numHintsUsed}
          </Text>
        </View>
        <View style={styles().statisticView}>
          <Text style={styles(reSize).statisticText}>
            Number of Wrong Cells Played:
          </Text>
          <Text style={styles(reSize).statisticValue}>
            {props.numWrongCellsPlayed}
          </Text>
        </View>
        <View style={styles().statisticView}>
          <Text style={styles(reSize).statisticText}>
            Internal Game Difficulty Score:
          </Text>
          <Text style={styles(reSize).statisticValue}>{props.difficulty}</Text>
        </View>
      </View>
      <Button mode="contained" onPress={() => navigation.navigate("PlayPage")}>
        Go Home
      </Button>
    </View>
  );
};

const styles = (reSize?: number, themeColor?: any) =>
  StyleSheet.create({
    totalGameResultsText: {
      fontSize: reSize ? reSize / 20 : 20,
      color: "#D9A05B",
      fontWeight: "bold",
      marginBottom: 10,
    },
    statisticView: {
      marginBottom: 10,
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

export default EndGameModal;
