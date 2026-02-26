import { Button, Text } from "react-native-paper";
import { useWindowDimensions, ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Statistic from "../../../Statistics/Statistic";
import React from "react";
import { DrillGameStatistics } from "../../../../Functions/LocalDatabase";
import { formatTime } from "../../Core/Functions/BoardFunctions";
import { toTitle } from "../../../../Functions/Utils";
import { useTheme } from "../../../../Contexts/ThemeContext";

export const EndGameModal = ({
  statistics,
}: {
  statistics: DrillGameStatistics;
}) => {
  const { theme } = useTheme();
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const navigation: any = useNavigation();

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
        Drill Results
      </Text>
      <View
        style={{
          width: "100%",
          maxWidth: 620,
          paddingHorizontal: 8,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 16,
            maxHeight: size.height * 0.5,
          }}
        >
          <ScrollView>
            <Statistic
              statisticName="Time Spent: "
              statisticValue={formatTime(statistics.time)}
              testID="time"
            />
            <Statistic
              statisticName="Strategy: "
              statisticValue={toTitle(statistics.difficulty)}
              testID="strategy"
            />
            <Statistic
              statisticName="Mistakes Made: "
              statisticValue={statistics.numWrongCellsPlayed}
              testID="numWrongCellsPlayed"
            />
            <Statistic
              statisticName="Hint Used: "
              statisticValue={statistics.hintUsed ? "Yes" : "No"}
              testID="numHintsUsed"
            />
          </ScrollView>
        </View>

        <Button
          mode="contained"
          testID="ChangeDrillButton"
          textColor={theme.semantic.text.inverse}
          labelStyle={{ fontSize: 20, fontWeight: "700" }}
          onPress={() => navigation.navigate("DrillPage")}
          style={{ marginTop: 16 }}
        >
          Change Drill
        </Button>
        <Button
          mode="contained"
          testID="StartNewDrillGame"
          textColor={theme.semantic.text.inverse}
          labelStyle={{ fontSize: 20, fontWeight: "700" }}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "DrillGame",
                  params: {
                    params: statistics.difficulty,
                    action: "StartGame",
                  },
                },
              ],
            });
          }}
          style={{ marginTop: 12 }}
        >
          New Drill
        </Button>
      </View>
    </View>
  );
};

export default EndGameModal;
