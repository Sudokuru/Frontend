import { Button, List, Text, TouchableRipple } from "react-native-paper";
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
  const statFontSize = Math.max(18, Math.min(reSize / 21, 22));

  const navigation: any = useNavigation();
  const [isHintsBreakdownExpanded, setHintsBreakdownExpanded] =
    React.useState(false);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 30,
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
          width: "90%",
          maxWidth: 480,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 16,
            maxHeight: size.height * 0.5,
          }}
        >
          <ScrollView>
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
            <TouchableRipple
              onPress={() =>
                setHintsBreakdownExpanded(!isHintsBreakdownExpanded)
              }
              style={{ marginBottom: 4 }}
              rippleColor={theme.colors.border}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{
                    color: theme.semantic.text.quaternary,
                    fontSize: statFontSize,
                    flex: 1,
                    marginRight: 10,
                  }}
                >
                  Number of Hints Used:
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: theme.semantic.text.primary,
                      fontSize: statFontSize,
                      fontWeight: "bold",
                      flexShrink: 0,
                    }}
                    testID="numHintsUsed"
                  >
                    {statistics.numHintsUsed}
                  </Text>
                  <List.Icon
                    icon={
                      isHintsBreakdownExpanded ? "chevron-up" : "chevron-down"
                    }
                    color={theme.semantic.text.primary}
                    style={{ margin: 0 }}
                  />
                </View>
              </View>
            </TouchableRipple>
            {isHintsBreakdownExpanded ? (
              <NumHintsUsedPerStrategy
                numHintsUsedPerStrategy={statistics.numHintsUsedPerStrategy}
              />
            ) : null}
          </ScrollView>
        </View>

        <Button
          mode="contained"
          testID="ChangeDifficultyButton"
          textColor={theme.semantic.text.inverse}
          labelStyle={{ fontSize: 20, fontWeight: "700" }}
          onPress={() => navigation.navigate("PlayPage")}
          style={{ marginTop: 16 }}
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
          style={{ marginTop: 12 }}
        >
          New Game
        </Button>
      </View>
    </View>
  );
};

export default EndGameModal;
