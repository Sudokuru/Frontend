import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { sudokuStrategyArray } from "sudokuru";

let drillStrategies: sudokuStrategyArray = [
  "NAKED_SINGLE",
  "NAKED_PAIR",
  "NAKED_TRIPLET",
  "NAKED_QUADRUPLET",
  "HIDDEN_SINGLE",
  "HIDDEN_PAIR",
  "HIDDEN_TRIPLET",
  "HIDDEN_QUADRUPLET",
  "POINTING_PAIR",
  "POINTING_TRIPLET",
];

const DrillPanel = () => {
  const navigation: any = useNavigation();

  // dynamically render in lesson buttons based on criteria
  let drillButtonArray = [];
  let NUM_LESSONS_PER_ROW = 2;

  let subArray = [];
  for (let i = 0; i < drillStrategies.length; i++) {
    subArray.push(
      <Button
        key={drillStrategies[i]}
        mode="contained"
        onPress={() => {
          navigation.navigate("DrillGame", { params: drillStrategies[i] });
        }}
        style={{ margin: 10 }}
      >
        {drillStrategies[i]}
      </Button>
    );

    // push sub-array to main array after every NUM_LESSONS_PER_ROW elements
    if (
      (i + 1) % NUM_LESSONS_PER_ROW === 0 ||
      i === drillStrategies.length - 1
    ) {
      drillButtonArray.push(subArray);
      subArray = [];
    }
  }

  // render each sub-array as a row
  return (
    <View style={{ flexWrap: "wrap", flexDirection: "column" }}>
      {drillButtonArray.map((subArray, index) => (
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
          }}
          key={index}
        >
          {subArray}
        </View>
      ))}
    </View>
  );
};

export default DrillPanel;
