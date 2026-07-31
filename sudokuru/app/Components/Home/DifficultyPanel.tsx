import { ImageURISource } from "react-native";
import { difficulty, getDifficultyColor } from "./Cards";
import React from "react";
import ListPanel from "./ListPanel";
import { GameDifficulty } from "../SudokuBoard/Core/Functions/DifficultyFunctions";
import { strategyDemoDefinitions } from "../../Data/hints/demo_strategy_hints";

interface DifficultyItem {
  label: string;
  value: GameDifficulty;
  testID: string;
}

const difficulties: DifficultyItem[] = [
  { label: "Novice", value: "novice", testID: "Novice" },
  { label: "Amateur", value: "amateur", testID: "Amateur" },
  { label: "Layman", value: "layman", testID: "Layman" },
  { label: "Trainee", value: "trainee", testID: "Trainee" },
  { label: "Protege", value: "protege", testID: "Protege" },
  {
    label: "Professional",
    value: "professional",
    testID: "Professional",
  },
  { label: "Pundit", value: "pundit", testID: "Pundit" },
  { label: "Master", value: "master", testID: "Master" },
  {
    label: "Grandmaster",
    value: "grandmaster",
    testID: "Grandmaster",
  },
  {
    label: "Wrong Value Direct Conflict",
    value: "wrong-value-direct-conflict",
    testID: "WrongValueDirectConflict",
  },
  {
    label: "Wrong Value No Direct Conflict",
    value: "wrong-value-no-direct-conflict",
    testID: "WrongValueNoDirectConflict",
  },
  {
    label: "Amend Notes Basic",
    value: "amend-notes-basic",
    testID: "AmendNotesBasic",
  },
  {
    label: "Amend Notes Corrective",
    value: "amend-notes-corrective",
    testID: "AmendNotesCorrective",
  },
  {
    label: "Obvious Single",
    value: "obvious-single",
    testID: "ObviousSingle",
  },
  {
    label: "Obvious Single With Note Simplification",
    value: "obvious-single-with-note-simplification",
    testID: "ObviousSingleWithNoteSimplification",
  },
  ...strategyDemoDefinitions.map(({ difficulty, testID, demoCase }) => ({
    label: demoCase.label,
    value: difficulty,
    testID,
  })),
];

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
  description?: difficulty;
  image?: ImageURISource;
  alt?: string;
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
    case "master":
    case "grandmaster":
      return {
        description: "Very Hard",
        image: difficultyStars[4],
        alt: "24 Point Star",
      };
    default:
      return {};
  }
}

const DifficultyPanel = (props: DifficultyPanelProps) => {
  return (
    <ListPanel
      width={props.width}
      height={props.height}
      items={difficulties}
      getKey={(level) => level.value}
      getTestID={(level) => level.testID}
      getTitle={(level) => level.label}
      getSubtitle={(level) => getDifficultyCardData(level.value).description}
      getSubtitleTestID={(level) => `${level.label}Description`}
      getSubtitleColor={(level) =>
        getDifficultyCardData(level.value).description
          ? getDifficultyColor(getDifficultyCardData(level.value).description!)
          : undefined
      }
      getCardImage={(level) => getDifficultyCardData(level.value).image}
      getImageAccessibilityLabel={(level) =>
        getDifficultyCardData(level.value).alt
      }
      onPress={(level) => {
        props.navigation.navigate("SudokuPage", {
          action: "StartGame",
          difficulty: level.value,
        });
      }}
    />
  );
};

export default DifficultyPanel;
