import { Button, Text } from "react-native-paper";
import { useWindowDimensions, ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Statistic from "../../../Statistics/Statistic";
import React from "react";
import { DrillGameStatistics } from "../../../../Functions/LocalDatabase";
import { formatTime } from "../../Core/Functions/BoardFunctions";
import { toTitle } from "../../../../Functions/Utils";

export const EndGameModal = (props: DrillGameStatistics) => {
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const navigation: any = useNavigation();

  console.log(props);

  props = props.statistics;

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
          statisticName="Time Spent: "
          statisticValue={formatTime(props.time)}
          testID="time"
        />
        <Statistic
          statisticName="Strategy: "
          statisticValue={toTitle(props.difficulty)}
          testID="strategy"
        />
        <Statistic
          statisticName="Mistakes Made: "
          statisticValue={props.numWrongCellsPlayed}
          testID="numWrongCellsPlayed"
        />
        <Statistic
          statisticName="Hint Used: "
          statisticValue={props.hintUsed ? "Yes" : "No"}
          testID="numHintsUsed"
        />
      </View>
      <Button
        mode="contained"
        testID="StartNewDrillGame"
        onPress={() => navigation.navigate("DrillPage")}
        style={{ marginTop: 20 }}
      >
        Start New Drill
      </Button>
    </ScrollView>
  );
};

export default EndGameModal;
