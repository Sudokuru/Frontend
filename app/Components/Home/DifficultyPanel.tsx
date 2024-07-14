import { TouchableOpacity, View } from "react-native";
import {
  calculateCardsPerRow,
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

const DifficultyPanel = (props: any) => {
  let difficultyButtonArray = [];
  let subArray = [];
  let columnCount: number = calculateCardsPerRow(
    props.width,
    difficulties.length
  );
  for (let i = 0; i < difficulties.length; i++) {
    let difficulty: string = difficulties[i];
    let description: difficulty;
    switch (difficulty) {
      case "Novice":
      case "Amateur":
        description = "Very Easy";
        break;
      case "Layman":
      case "Trainee":
        description = "Easy";
        break;
      case "Protege":
        description = "Intermediate";
        break;
      case "Professional":
      case "Pundit":
        description = "Hard";
        break;
      default:
        description = "Very Hard";
        break;
    }
    let difficultyColor: string = getDifficultyColor(description);
    subArray.push(
      <View
        key={difficulty}
        testID={difficulty}
        style={{ width: CARD_WIDTH, padding: CARD_PADDING }}
      >
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
