import { ImageURISource } from "react-native";
import { difficulty, getDifficultyColor } from "./Cards";
import React from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import ListPanel from "./ListPanel";
import {
  GAME_DIFFICULTIES,
  GameDifficulty,
} from "../../Functions/GameDifficulties";
import { toTitle } from "../../Functions/Utils";

const difficultyStars: ImageURISource[] = [
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

function getDifficultyCardData(level: GameDifficulty): {
  description: difficulty;
  image: ImageURISource;
  alt: string;
} {
  switch (level) {
    case "novice":
    case "amateur":
      return {
        description: "Very Easy",
        image: difficultyStars[0],
        alt: "3 Point Star",
      };
    case "layman":
    case "trainee":
      return {
        description: "Easy",
        image: difficultyStars[1],
        alt: "4 Point Star",
      };
    case "protege":
      return {
        description: "Intermediate",
        image: difficultyStars[2],
        alt: "5 Point Star",
      };
    case "professional":
    case "pundit":
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
  const { theme } = useTheme();
  return (
    <ListPanel
      width={props.width}
      height={props.height}
      items={GAME_DIFFICULTIES}
      getKey={(level) => level}
      getTestID={(level) => toTitle(level)}
      getTitle={(level) => toTitle(level)}
      getSubtitle={(level) => getDifficultyCardData(level).description}
      getSubtitleTestID={(level) => `${toTitle(level)}Description`}
      getSubtitleColor={(level) =>
        getDifficultyColor(
          getDifficultyCardData(level).description,
          theme.useDarkTheme,
        )
      }
      getCardImage={(level) => getDifficultyCardData(level).image}
      getImageAccessibilityLabel={(level) => getDifficultyCardData(level).alt}
      onPress={(level) => {
        props.navigation.navigate("SudokuPage", {
          action: "StartGame",
          difficulty: level,
        });
      }}
    />
  );
};

export default DifficultyPanel;
