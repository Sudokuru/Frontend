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
import { useTheme } from "../../Contexts/ThemeContext";

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
]; /* Sources:
https://commons.wikimedia.org/wiki/File:Equilateral_Triangle_(PSF).png
https://commons.wikimedia.org/wiki/File:Black_4_Point_Star.png
https://commons.wikimedia.org/wiki/File:A_Black_Star.png
https://commons.wikimedia.org/wiki/File:Ninestar.svg
https://commons.wikimedia.org/wiki/File:24-pointed_star.svg
Used 512px when available, otherwise full resolution
Used following ImageMagick commands:
Turned surrounding white pixels into transparent pixels when needed with commands like this:
convert 3points.png -fuzz 50% -transparent white 3points.png
Above command also used to remove existing borders when needed.
Added final white border to non transparent pixels (shapes) like this:
convert 3points.png \( +clone -alpha extract -morphology dilate diamond:10 -background white -alpha shape \) -compose DstOver -composite 3points.png
*/

/**
 * Given total number of cards and number of cards per column calculates how many rows there are total
 * @param cardCount
 * @param columnCount
 * @returns number of rows
 */
function getRowCount(cardCount: number, columnCount: number): number {
  return Math.ceil(cardCount / columnCount);
}

/**
 * Calculates the total height taken up by cards and the padding in between them
 * @param rowCount
 * @param cardHeight
 * @param shrinkage
 * @returns total height taken up by cards and their padding
 */
function getTotalCardsHeight(
  rowCount: number,
  cardHeight: number,
  shrinkage: number,
): number {
  let fromCards: number = rowCount * cardHeight;
  let fromPadding: number = (rowCount - 1) * CARD_PADDING;
  return (fromCards + fromPadding) * (1 - shrinkage);
}

interface DifficultyPanelProps {
  width: number;
  height: number;
  navigation: any;
}

const DifficultyPanel = (props: DifficultyPanelProps) => {
  const { theme } = useTheme();

  let difficultyButtonArray = [];
  let subArray = [];

  // Calculate shrinkage based on screen size (shrinkage of 0.1 decreases card size by 10%, high shrinkage removes image and difficulty description)
  // Does this by adjusting total height of cards (row count * card height * (1-shrinkage) + padding) to be at most 70% of screen height
  let CARD_LENGTH = (CARD_WIDTH * 3) / 5;
  let shrinkage: number = -0.01,
    columnCount,
    rowCount;
  do {
    shrinkage += 0.01;
    columnCount = calculateCardsPerRow(
      props.width,
      props.height,
      difficulties.length,
    );
    rowCount = getRowCount(difficulties.length, columnCount);
  } while (
    getTotalCardsHeight(rowCount, CARD_LENGTH, shrinkage) >
    props.height * 0.7
  );

  let difficulty: string = "";
  for (let i = 0; i < difficulties.length; i++) {
    let img: ImageURISource;
    let alt: string;
    difficulty = difficulties[i];
    let description: difficulty;
    switch (difficulty) {
      case "Novice":
      case "Amateur":
        description = "Very Easy";
        img = difficultyStars[0];
        alt = "3 Point Star";
        break;
      case "Layman":
      case "Trainee":
        description = "Easy";
        img = difficultyStars[1];
        alt = "4 Point Star";
        break;
      case "Protege":
        description = "Intermediate";
        img = difficultyStars[2];
        alt = "5 Point Star";
        break;
      case "Professional":
      case "Pundit":
        description = "Hard";
        img = difficultyStars[3];
        alt = "9 Point Star";
        break;
      default:
        description = "Very Hard";
        img = difficultyStars[4];
        alt = "24 Point Star";
        break;
    }
    let difficultyColor: string = getDifficultyColor(description);
    const descriptionTestID = `${difficulty}Description`;
    const difficultyString = difficulty.toLowerCase();
    subArray.push(
      <View
        key={difficulty}
        testID={difficulty}
        style={{
          width: CARD_WIDTH,
          padding: CARD_PADDING * (1 - shrinkage),
          margin: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("SudokuPage", {
              action: "StartGame",
              difficulty: difficultyString,
            });
          }}
        >
          <Card
            mode="outlined"
            theme={{
              colors: {
                surface: theme.colors.surfaceAlt,
              },
            }}
          >
            <Text
              variant="headlineMedium"
              style={{
                alignSelf: "center",
                color: theme.semantic.text.inverse,
              }}
            >
              {difficulty}
            </Text>
            {shrinkage < 0.6 ? (
              <Text
                testID={descriptionTestID}
                variant="headlineSmall"
                style={{ alignSelf: "center" }}
                theme={{ colors: { onSurface: difficultyColor } }}
              >
                {description}
              </Text>
            ) : null}
            {shrinkage < 0.3 ? (
              <Image
                style={{
                  width: (CARD_IMAGE_WIDTH / 3) * (1 - shrinkage),
                  height: (CARD_IMAGE_HEIGHT / 3) * (1 - shrinkage),
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
                source={img}
                defaultSource={img}
                accessibilityLabel={alt}
              />
            ) : null}
          </Card>
        </TouchableOpacity>
      </View>,
    );

    // Add row
    if ((i + 1) % columnCount === 0) {
      difficultyButtonArray.push([difficulty + "Row", subArray]);
      subArray = [];
    }
  }
  // Add last row if not evenly divisible
  if (subArray.length > 0) {
    difficultyButtonArray.push([difficulty + "Row", subArray]);
  }

  // render each sub-array as a row
  return (
    <View style={{ flexWrap: "wrap", flexDirection: "column" }}>
      {difficultyButtonArray.map(([rowKey, difficultyCard]) => (
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
          }}
          key={String(rowKey)}
        >
          {difficultyCard}
        </View>
      ))}
    </View>
  );
};

export default DifficultyPanel;
