import { TouchableOpacity, View } from "react-native";
import {
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
  let cards = [];
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
    cards.push(
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
  }
};

export default DifficultyPanel;
