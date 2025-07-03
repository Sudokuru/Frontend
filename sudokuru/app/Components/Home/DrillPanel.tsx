import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Image, TouchableOpacity, ImageURISource } from "react-native";
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  Portal,
  Text,
} from "react-native-paper";
import { SudokuStrategy } from "sudokuru";
import {
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  CARD_PADDING,
  CARD_WIDTH,
  calculateCardsPerRow,
  difficulty,
  getDifficultyColor,
} from "./Cards";
import { toTitle } from "../../Functions/Utils";
import {
  getKeyJSON,
  removeData,
  storeData,
} from "../../Functions/AsyncStorage";
import { BoardObjectProps } from "../../Functions/LocalDatabase";
import { getGame } from "../../Api/Puzzles";
import { useMinWindowDimensions } from "../../Functions/WindowDimensions";

function defineDrillStrategies<T extends readonly SudokuStrategy[]>(arr: T): T {
  return arr;
}

export const DRILL_STRATEGIES = defineDrillStrategies([
  "OBVIOUS_SINGLE",
  "OBVIOUS_PAIR",
  "OBVIOUS_TRIPLET",
  "OBVIOUS_QUADRUPLET",
  "HIDDEN_SINGLE",
  "HIDDEN_PAIR",
  "HIDDEN_TRIPLET",
  "HIDDEN_QUADRUPLET",
  "POINTING_PAIR",
  "POINTING_TRIPLET",
] as const);

export type DrillStrategy = (typeof DRILL_STRATEGIES)[number];

let drillImages: ImageURISource[] = [
  require("./../../../.assets/CardImages/OBVIOUS_SINGLE.png"),
  require("./../../../.assets/CardImages/OBVIOUS_PAIR.png"),
  require("./../../../.assets/CardImages/OBVIOUS_TRIPLET.png"),
  require("./../../../.assets/CardImages/OBVIOUS_QUADRUPLET.png"),
  require("./../../../.assets/CardImages/HIDDEN_SINGLE.png"),
  require("./../../../.assets/CardImages/HIDDEN_PAIR.png"),
  require("./../../../.assets/CardImages/HIDDEN_TRIPLET.png"),
  require("./../../../.assets/CardImages/HIDDEN_QUADRUPLET.png"),
  require("./../../../.assets/CardImages/POINTING_PAIR.png"),
  require("./../../../.assets/CardImages/POINTING_TRIPLET.png"),
];

const DrillPanel = (props: any) => {
  const navigation: any = useNavigation();

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [checked, setChecked] = React.useState(false);

  const minWindowSize = useMinWindowDimensions();
  const newSize = minWindowSize / 25;

  // This determines if user has active game and displays resume button conditionally.
  async function showOrHideResumeButton() {
    const game: BoardObjectProps[] = await getGame("drill");
    console.log("HELLO ", game);
    if (game != null) {
      showResumeButton();
      return true;
    } else {
      hideResumeButton();
      return false;
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      showOrHideResumeButton();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const [resumeVisible, setResumeVisible] = React.useState(false);
  const showResumeButton = () => setResumeVisible(true);
  const hideResumeButton = () => setResumeVisible(false);

  async function showTutorialIfNotDismissed() {
    await getKeyJSON("dismissDrillTutorial").then((dismiss: any) => {
      if (!dismiss) {
        showDialog();
      }
    });
  }

  let drillButtonArray = [];
  let subArray = [];
  let columnCount: number = calculateCardsPerRow(
    props.width,
    DRILL_STRATEGIES.length,
  );
  for (let i = 0; i < DRILL_STRATEGIES.length; i++) {
    let img: ImageURISource = drillImages[i];
    let difficulty: difficulty;
    switch (DRILL_STRATEGIES[i]) {
      case "OBVIOUS_SINGLE":
        difficulty = "Very Easy";
        break;
      case "OBVIOUS_PAIR":
        difficulty = "Easy";
        break;
      case "OBVIOUS_TRIPLET":
      case "OBVIOUS_QUADRUPLET":
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
        key={DRILL_STRATEGIES[i]}
        style={{
          width: CARD_WIDTH,
          padding: CARD_PADDING,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            showTutorialIfNotDismissed().then(() => {
              navigation.navigate("DrillGame", {
                params: DRILL_STRATEGIES[i],
                action: "StartGame",
              });
            });
          }}
        >
          <Card mode="outlined">
            <Text variant="headlineMedium" style={{ alignSelf: "center" }}>
              {toTitle(DRILL_STRATEGIES[i])}
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
              defaultSource={img}
              style={{
                width: CARD_IMAGE_WIDTH,
                height: CARD_IMAGE_HEIGHT,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
          </Card>
        </TouchableOpacity>
      </View>,
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
      {resumeVisible ? (
        <Button
          style={{ margin: newSize / 4 }}
          mode="outlined"
          onPress={async function handlePress() {
            const game = await showOrHideResumeButton();
            if (game) {
              navigation.navigate("DrillGame", {
                action: "ResumeGame",
              });
            }
          }}
        >
          Resume Puzzle
        </Button>
      ) : (
        <></>
      )}
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
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{
            alignSelf: "center",
            alignItems: "center",
            width:
              props.width > 800
                ? props.width * 0.4
                : Math.min(600, props.width),
          }}
        >
          <Dialog.Title>How Drills Work</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyLarge">
              Drills are like do it yourself hints. Just alter the board to
              match what you think would happen if you applied the hint for the
              given strategy and then click submit to check your work.
              Can&apos;t figure it out? No worries, just click the hint ? button
              to get the solution.
            </Text>
            <Checkbox.Item
              label="Don't show this again"
              status={checked ? "checked" : "unchecked"}
              mode="android" // iOS doesn't have box around checkbox so best to just tell it to use android
              style={{
                alignSelf: "center",
                width:
                  props.width > 800
                    ? props.width * 0.2
                    : Math.min(300, props.width),
              }}
              testID="dismissDrillTutorial"
              onPress={() => {
                async function dismissTutorial() {
                  if (!checked) {
                    await storeData("dismissDrillTutorial", "true");
                  } else {
                    await removeData("dismissDrillTutorial");
                  }
                }
                dismissTutorial().then(() => {
                  setChecked(!checked);
                });
              }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={hideDialog}
              testID="hideDrillTutorialButton"
              labelStyle={{ fontSize: 20 }}
            >
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default DrillPanel;
