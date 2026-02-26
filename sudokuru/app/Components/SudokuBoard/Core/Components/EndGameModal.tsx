import { Button, Text } from "react-native-paper";
import { useWindowDimensions, ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Statistic from "../../../Statistics/Statistic";
import { formatTime } from "../Functions/BoardFunctions";
import React from "react";
import { NumHintsUsedPerStrategy } from "../../../NumHintsUsedPerStrategy";
import { useTheme } from "../../../../Contexts/ThemeContext";
import { ClassicGameStatistics } from "../../../../Functions/LocalDatabase";

export const EndGameModal = ({
  statistics,
}: {
  statistics: ClassicGameStatistics;
}) => {
  const { theme } = useTheme();
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const navigation: any = useNavigation();

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
          color: theme.semantic.text.primary,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Game Results
      </Text>
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 10,
          padding: 20,
        }}
      >
        <Statistic
          statisticName="Score: "
          statisticValue={statistics.score}
          testID="score"
        />
        <Statistic
          statisticName="Time Spent: "
          statisticValue={formatTime(statistics.time)}
          testID="time"
        />
        <Statistic
          statisticName="Mistakes Made: "
          statisticValue={statistics.numWrongCellsPlayed}
          testID="numWrongCellsPlayed"
        />
        <Statistic
          statisticName="Difficulty: "
          statisticValue={statistics.difficulty}
          testID="difficulty"
        />
        <Statistic
          statisticName="Number of Hints Used: "
          statisticValue={statistics.numHintsUsed}
          testID="numHintsUsed"
        />
        <NumHintsUsedPerStrategy
          numHintsUsedPerStrategy={statistics.numHintsUsedPerStrategy}
        />
      </View>
      <Button
        mode="contained"
        testID="ChangeDifficultyButton"
        textColor={theme.semantic.text.inverse}
        labelStyle={{ fontSize: 20, fontWeight: "700" }}
        onPress={() => navigation.navigate("PlayPage")}
        style={{ marginTop: 20 }}
      >
        Change Difficulty
      </Button>
      <Button
        mode="contained"
        testID="StartNewGameButton"
        textColor={theme.semantic.text.inverse}
        labelStyle={{ fontSize: 20, fontWeight: "700" }}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "SudokuPage",
                params: {
                  action: "StartGame",
                  difficulty: statistics.difficulty,
                },
              },
            ],
          });
        }}
        style={{ marginTop: 20 }}
      >
        New Game
      </Button>
    </ScrollView>
  );
};

export default EndGameModal;
