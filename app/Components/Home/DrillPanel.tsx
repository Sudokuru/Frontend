import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
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

/**
 * Returns the string converted to a title format i.e. replaces _ with spaces and capitalizes only the first letter of each word
 * @param str - the string to convert
 * @returns the converted string
 */
const toTitle = (str: string) => {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const DrillPanel = (props: any) => {
  const navigation: any = useNavigation();

  let drillButtonArray = [];
  let subArray = [];
  const CARD_WIDTH: number = 300;
  const CARD_HEIGHT: number = 600;
  let columnCount: number = Math.floor(props.width / (CARD_WIDTH + 100));
  // Decrease the number of columns to the smallest number that is greater than or equal to the number of rows
  while (
    columnCount - 1 >=
    Math.ceil(drillStrategies.length / (columnCount - 1))
  ) {
    columnCount--;
  }
  for (let i = 0; i < drillStrategies.length; i++) {
    let img;
    switch (i) {
      case 0:
        img = require("./DrillCardImages/NAKED_SINGLE.png");
        break;
      case 1:
        img = require("./DrillCardImages/NAKED_PAIR.png");
        break;
      case 2:
        img = require("./DrillCardImages/NAKED_TRIPLET.png");
        break;
      case 3:
        img = require("./DrillCardImages/NAKED_QUADRUPLET.png");
        break;
      case 4:
        img = require("./DrillCardImages/HIDDEN_SINGLE.png");
        break;
      case 5:
        img = require("./DrillCardImages/HIDDEN_PAIR.png");
        break;
      case 6:
        img = require("./DrillCardImages/HIDDEN_TRIPLET.png");
        break;
      case 7:
        img = require("./DrillCardImages/HIDDEN_QUADRUPLET.png");
        break;
      case 8:
        img = require("./DrillCardImages/POINTING_PAIR.png");
        break;
      case 9:
        img = require("./DrillCardImages/POINTING_TRIPLET.png");
        break;
    }
    let difficulty: string, difficultyColor: string;
    switch (drillStrategies[i]) {
      case "NAKED_SINGLE":
        difficulty = "Very Easy";
        difficultyColor = "#4CBB17";
        break;
      case "NAKED_PAIR":
        difficulty = "Easy";
        difficultyColor = "#7CFC00";
        break;
      case "NAKED_TRIPLET":
      case "NAKED_QUADRUPLET":
        difficulty = "Intermediate";
        difficultyColor = "#FFFF00";
        break;
      case "HIDDEN_SINGLE":
        difficulty = "Hard";
        difficultyColor = "#FFA500";
        break;
      default:
        difficulty = "Very Hard";
        difficultyColor = "#FF0000";
        break;
    }
    subArray.push(
      <View
        style={{
          width: CARD_WIDTH,
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DrillGame", {
              params: drillStrategies[i],
            });
          }}
        >
          <Card
            mode="outlined"
            theme={{ colors: { surface: "#025E73", outline: "#D9A05B" } }}
          >
            <Text variant="headlineMedium" style={{ alignSelf: "center" }}>
              {toTitle(drillStrategies[i])}
            </Text>
            <Text
              variant="headlineSmall"
              style={{ alignSelf: "center" }}
              theme={{ colors: { onSurface: difficultyColor } }}
            >
              {difficulty}
            </Text>
            <Image
              source={img}
              style={{
                width: (CARD_WIDTH * 2) / 3,
                height: CARD_HEIGHT / 2,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
          </Card>
        </TouchableOpacity>
      </View>
    );

    // Add row
    if ((i + 1) % columnCount === 0) {
      drillButtonArray.push(subArray);
      subArray = [];
    }
  }
  // Add last row if not evenly divisible
  if (subArray.length > 0) {
    drillButtonArray.push(subArray);
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
