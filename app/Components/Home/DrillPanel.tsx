import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Image, TouchableOpacity, ImageURISource } from "react-native";
import { Card, Text } from "react-native-paper";
import { sudokuStrategyArray } from "sudokuru";
import {
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  CARD_PADDING,
  CARD_WIDTH,
  calculateCardsPerRow,
  difficulty,
  getDifficultyColor,
} from "./Cards";

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

let drillImages: ImageURISource[] = [
  require("./CardImages/NAKED_SINGLE.png"),
  require("./CardImages/NAKED_PAIR.png"),
  require("./CardImages/NAKED_TRIPLET.png"),
  require("./CardImages/NAKED_QUADRUPLET.png"),
  require("./CardImages/HIDDEN_SINGLE.png"),
  require("./CardImages/HIDDEN_PAIR.png"),
  require("./CardImages/HIDDEN_TRIPLET.png"),
  require("./CardImages/HIDDEN_QUADRUPLET.png"),
  require("./CardImages/POINTING_PAIR.png"),
  require("./CardImages/POINTING_TRIPLET.png"),
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
  let columnCount: number = calculateCardsPerRow(
    props.width,
    drillStrategies.length
  );
  for (let i = 0; i < drillStrategies.length; i++) {
    let img: ImageURISource = drillImages[i];
    let difficulty: difficulty;
    switch (drillStrategies[i]) {
      case "NAKED_SINGLE":
        difficulty = "Very Easy";
        break;
      case "NAKED_PAIR":
        difficulty = "Easy";
        break;
      case "NAKED_TRIPLET":
      case "NAKED_QUADRUPLET":
        difficulty = "Intermediate";
        break;
      case "HIDDEN_SINGLE":
        difficulty = "Hard";
        break;
      default:
        difficulty = "Very Hard";
        break;
    }
    let difficultyColor: string = getDifficultyColor(difficulty);
    subArray.push(
      <View
        key={drillStrategies[i]}
        style={{
          width: CARD_WIDTH,
          padding: CARD_PADDING,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DrillGame", {
              params: drillStrategies[i],
            });
          }}
        >
          <Card mode="outlined">
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
                width: CARD_IMAGE_WIDTH,
                height: CARD_IMAGE_HEIGHT,
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
