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
        Drill Results
      </Text>
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 10,
          padding: 20,
        }}
      >
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
      </View>
      <Button
        mode="contained"
        testID="StartNewDrillGame"
        textColor={theme.semantic.text.inverse}
        onPress={() => navigation.navigate("DrillPage")}
        style={{ marginTop: 20 }}
      >
        Start New Drill
      </Button>
    </ScrollView>
  );
};

export default EndGameModal;
