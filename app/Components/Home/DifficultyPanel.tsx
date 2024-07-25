import { ImageURISource, TouchableOpacity, View, Image } from "react-native";
import {
  calculateCardsPerRow,
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  CARD_PADDING,
  CARD_WIDTH,
  difficulty,
  getDifficultyColor,
} from "./Cards";
import React from "react";
import { Card, Text } from "react-native-paper";

let difficulties: string[] = [
  "Novice",
  "Amateur",
  "Layman",
  "Trainee",
  "Protege",
  "Professional",
  "Pundit",
  "Master",
  "Grandmaster",
];

let difficultyStars: ImageURISource[] = [
  require("../../../.assets/DifficultyStars/3points.png"),
  require("../../../.assets/DifficultyStars/4points.png"),
  require("../../../.assets/DifficultyStars/5points.png"),
  require("../../../.assets/DifficultyStars/9points.png"),
  require("../../../.assets/DifficultyStars/24points.png"),
];

const DifficultyPanel = (props: any) => {
  let difficultyButtonArray = [];
  let subArray = [];
  let columnCount: number = calculateCardsPerRow(
    props.width,
    difficulties.length
  );
  for (let i = 0; i < difficulties.length; i++) {
    let img: ImageURISource;
    let difficulty: string = difficulties[i];
    let description: difficulty;
    switch (difficulty) {
      case "Novice":
      case "Amateur":
        description = "Very Easy";
        img = difficultyStars[0];
        break;
      case "Layman":
      case "Trainee":
        description = "Easy";
        img = difficultyStars[1];
        break;
      case "Protege":
        description = "Intermediate";
        img = difficultyStars[2];
        break;
      case "Professional":
      case "Pundit":
        description = "Hard";
        img = difficultyStars[3];
        break;
      default:
        description = "Very Hard";
        img = difficultyStars[4];
        break;
    }
    let difficultyColor: string = getDifficultyColor(description);
    subArray.push(
      <View key={difficulty} testID={difficulty} style={{ width: CARD_WIDTH }}>
        <TouchableOpacity onPress={() => {}}>
          <Card mode="outlined">
            <Text variant="headlineMedium" style={{ alignSelf: "center" }}>
              {difficulty}
            </Text>
            <Text
              testID={"difficulty"}
              variant="headlineSmall"
              style={{ alignSelf: "center" }}
              theme={{ colors: { onSurface: difficultyColor } }}
            >
              {description}
            </Text>
            <Image
              source={img}
              style={{
                width: CARD_IMAGE_WIDTH / 3,
                height: CARD_IMAGE_HEIGHT / 3,
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
      difficultyButtonArray.push(subArray);
      subArray = [];
    }
  }
  // Add last row if not evenly divisible
  if (subArray.length > 0) {
    difficultyButtonArray.push(subArray);
  }

  // render each sub-array as a row
  return (
    <View style={{ flexWrap: "wrap", flexDirection: "column" }}>
      {difficultyButtonArray.map((subArray, index) => (
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

export default DifficultyPanel;
