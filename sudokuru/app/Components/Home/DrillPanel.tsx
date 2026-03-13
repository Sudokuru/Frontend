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
import { useTheme } from "../../Contexts/ThemeContext";
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

  const { theme } = useTheme();

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [checked, setChecked] = React.useState(false);

  const minWindowSize = useMinWindowDimensions();
  const newSize = minWindowSize / 25;

  // This determines if user has active game and displays resume button conditionally.
  async function showOrHideResumeButton() {
    const game: BoardObjectProps[] = await getGame("drill");
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

  // Calculate shrinkage based on screen size
  let CARD_LENGTH = (CARD_WIDTH * 3) / 5;
  let shrinkage: number = -0.01,
    columnCount,
    rowCount;
  do {
    shrinkage += 0.01;
    columnCount = calculateCardsPerRow(
      props.width,
      props.height,
      DRILL_STRATEGIES.length,
    );
    rowCount = getRowCount(DRILL_STRATEGIES.length, columnCount);
  } while (
    getTotalCardsHeight(rowCount, CARD_LENGTH, shrinkage) >
    props.height * 0.7
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
        testID={DRILL_STRATEGIES[i]}
        style={{
          width: CARD_WIDTH,
          padding: CARD_PADDING * (1 - shrinkage),
          margin: 5,
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
              {toTitle(DRILL_STRATEGIES[i])}
            </Text>
            {shrinkage < 0.6 ? (
              <Text
                variant="headlineSmall"
                style={{ alignSelf: "center" }}
                theme={{ colors: { onSurface: difficultyColor } }}
              >
                {difficulty}
              </Text>
            ) : (
              <></>
            )}
            {shrinkage < 0.3 ? (
              <Image
                source={img}
                defaultSource={img}
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
          Resume Drill
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
