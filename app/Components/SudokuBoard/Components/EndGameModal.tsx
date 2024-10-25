import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Statistic from "../../Statistics/Statistic";
import { formatTime } from "../Functions/BoardFunctions";
import React from "react";
import { SudokuStrategy } from "sudokuru";
import { ScrollView } from "react-native-gesture-handler";
import { formatOneLessonName } from "../../../Functions/learnedLessons";

interface EndGameModalProps {
  time: number;
  numHintsUsed: number;
  numWrongCellsPlayed: number;
  numHintsUsedPerStrategy: {
    hintStrategy: SudokuStrategy;
    numHintsUsed: number;
  }[];
  score: number;
  difficulty: string;
}

const EndGameModal = (props: EndGameModalProps) => {
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const theme = useTheme();
  const navigation: any = useNavigation();

  // sort by most number of hints
  const sortedHints = [...props.numHintsUsedPerStrategy].sort(
    (a, b) => b.numHintsUsed - a.numHintsUsed
  );

  const strategyHints: React.JSX.Element[] = [];
  for (const strategyHint of sortedHints) {
    strategyHints.push(
      <Statistic
        statisticName={
          "  " + formatOneLessonName(strategyHint.hintStrategy) + ": "
        }
        statisticValue={strategyHint.numHintsUsed}
        testID={"hintsUsed" + strategyHint.hintStrategy}
        key={strategyHint.hintStrategy}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
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
          statisticName="Mistakes Made: "
          statisticValue={props.numWrongCellsPlayed}
          testID="numWrongCellsPlayed"
        />
        <Statistic
          statisticName="Difficulty: "
          statisticValue={props.difficulty}
          testID="difficulty"
        />
        <Statistic
          statisticName="Number of Hints Used: "
          statisticValue={props.numHintsUsed}
          testID="numHintsUsed"
        />
        {strategyHints}
      </View>
      <Button
        mode="contained"
        testID="StartNewGameButton"
        onPress={() => navigation.navigate("PlayPage")}
        style={{ marginTop: 20 }}
      >
        Play New Game
      </Button>
    </ScrollView>
  );
};

export default EndGameModal;
