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
  shrinkage: number
): number {
  let fromCards: number = rowCount * ((CARD_WIDTH * 3) / 5);
  let fromPadding: number = (rowCount - 1) * CARD_PADDING;
  console.log(
    "rowCount: " +
      rowCount +
      ", fromCards: " +
      fromCards +
      ", fromPadding: " +
      fromPadding
  );
  return (fromCards + fromPadding) * (1 - shrinkage);
}

const DifficultyPanel = (props: any) => {
  let difficultyButtonArray = [];
  let subArray = [];

  // Calculate shrinkage based on screen size (shrinkage of 0.1 decreases card size by 10%, high shrinkage removes image and difficulty description)
  // Does this by adjusting total height of cards (row count * card height * (1-shrinkage) + padding) to be at most 50% of screen height
  let CARD_LENGTH = (CARD_WIDTH * 3) / 5;
  let shrinkage: number = -0.01,
    columnCount,
    rowCount;
  do {
    shrinkage += 0.01;
    columnCount = calculateCardsPerRow(props.width, difficulties.length);
    rowCount = getRowCount(difficulties.length, columnCount);
  } while (
    getTotalCardsHeight(rowCount, CARD_LENGTH, shrinkage) >
    props.height * 0.7
  );

  console.log("Shrinkage: " + shrinkage);
  console.log(
    "Card will be: " + (CARD_LENGTH + CARD_PADDING * (1 - shrinkage)) + " long."
  );
  CARD_LENGTH *= 1 - shrinkage;

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
      <View
        key={difficulty}
        testID={difficulty}
        style={{
          width: CARD_WIDTH,
          height: CARD_LENGTH + CARD_PADDING * (1 - shrinkage),
          padding: CARD_PADDING * (1 - shrinkage),
          margin: 5,
        }}
      >
        <TouchableOpacity onPress={() => {}}>
          <Card mode="outlined">
            <Text variant="headlineMedium" style={{ alignSelf: "center" }}>
              {difficulty}
            </Text>
            {shrinkage < 0.6 ? (
              <Text
                testID={"difficulty"}
                variant="headlineSmall"
                style={{ alignSelf: "center" }}
                theme={{ colors: { onSurface: difficultyColor } }}
              >
                {description}
              </Text>
            ) : (
              <></>
            )}
            {shrinkage < 0.3 ? (
              <Image
                source={img}
                style={{
                  width: (CARD_IMAGE_WIDTH / 3) * (1 - shrinkage),
                  height: (CARD_IMAGE_HEIGHT / 3) * (1 - shrinkage),
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />
            ) : (
              <></>
            )}
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
