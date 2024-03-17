import { useNavigation } from "@react-navigation/native";
import { View, useWindowDimensions } from "react-native";
import { Button, Text } from "react-native-paper";

import Statistic from "../../Statistics/Statistic";
import { formatTime } from "../Functions/BoardFunctions";

interface EndGameModalProps {
  time: number;
  numHintsUsed: number;
  numWrongCellsPlayed: number;
  score: number;
  difficulty: string;
}

const EndGameModal = (props: EndGameModalProps) => {
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const navigation: any = useNavigation();

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
        <Statistic
          statisticName="Score: "
          statisticValue={props.score}
          testID="score"
        />
        <Statistic
          statisticName="Time Spent: "
          statisticValue={formatTime(props.time)}
          testID="time"
        />
        <Statistic
          statisticName="Number of Hints Used: "
          statisticValue={props.numHintsUsed}
          testID="numHintsUsed"
        />
        <Statistic
          statisticName="Mistakes Made: "
          statisticValue={props.numWrongCellsPlayed}
          testID="numWrongCellsPlayed"
        />
        <Statistic
          statisticName="Difficulty: "
          statisticValue={props.difficulty}
          testID="difficulty"
        />
      </View>
      <Button
        mode="contained"
        testID="StartNewGameButton"
        onPress={() => navigation.navigate("PlayPage")}
        style={{ marginTop: 20 }}
      >
        Play New Game
      </Button>
    </View>
  );
};

export default EndGameModal;
