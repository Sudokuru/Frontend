import { ImageURISource } from "react-native";
import { difficulty, getDifficultyColor } from "./Cards";
import React from "react";
import ListPanel from "./ListPanel";

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

interface DifficultyPanelProps {
  width: number;
  height: number;
  navigation: any;
}

function getDifficultyCardData(level: string): {
  description: difficulty;
  image: ImageURISource;
  alt: string;
} {
  switch (level) {
    case "Novice":
    case "Amateur":
      return {
        description: "Very Easy",
        image: difficultyStars[0],
        alt: "3 Point Star",
      };
    case "Layman":
    case "Trainee":
      return {
        description: "Easy",
        image: difficultyStars[1],
        alt: "4 Point Star",
      };
    case "Protege":
      return {
        description: "Intermediate",
        image: difficultyStars[2],
        alt: "5 Point Star",
      };
    case "Professional":
    case "Pundit":
      return {
        description: "Hard",
        image: difficultyStars[3],
        alt: "9 Point Star",
      };
    default:
      return {
        description: "Very Hard",
        image: difficultyStars[4],
        alt: "24 Point Star",
      };
  }
}

const DifficultyPanel = (props: DifficultyPanelProps) => {
  return (
    <ListPanel
      width={props.width}
      height={props.height}
      items={difficulties}
      getKey={(level) => level}
      getTestID={(level) => level}
      getTitle={(level) => level}
      getSubtitle={(level) => getDifficultyCardData(level).description}
      getSubtitleTestID={(level) => `${level}Description`}
      getSubtitleColor={(level) =>
        getDifficultyColor(getDifficultyCardData(level).description)
      }
      getCardImage={(level) => getDifficultyCardData(level).image}
      getImageAccessibilityLabel={(level) => getDifficultyCardData(level).alt}
      onPress={(level) => {
        props.navigation.navigate("SudokuPage", {
          action: "StartGame",
          difficulty: level.toLowerCase(),
        });
      }}
    />
  );
};

export default DifficultyPanel;
