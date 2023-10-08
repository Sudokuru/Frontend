import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Statistic from "../Statistics/Statistic";

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
      <Text
        style={{
          fontSize: reSize ? reSize / 20 : 20,
          color: "#D9A05B",
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Game Results
      </Text>
      <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 20 }}>
        <Statistic statisticName="Score: " statisticValue={props.score} />
        <Statistic
          statisticName="Time Spent Playing: "
          statisticValue={formatTime(props.time)}
        />
        <Statistic
          statisticName="Number of Hints Used: "
          statisticValue={props.numHintsUsed}
        />
        <Statistic
          statisticName="Number of Wrong Cells Played: "
          statisticValue={props.numWrongCellsPlayed}
        />
        <Statistic
          statisticName="Internal Game Difficulty Score: "
          statisticValue={props.difficulty}
        />
      </View>
      <Button
        mode="contained"
        testID="StartNewGameButton"
        onPress={() => navigation.navigate("PlayPage")}
      >
        Play New Game
      </Button>
    </View>
  );
};

export default EndGameModal;
