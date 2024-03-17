import { useNavigation } from "@react-navigation/native";
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
import { sudokuStrategyArray } from "sudokuru";

import {
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  CARD_PADDING,
  CARD_WIDTH,
  calculateCardsPerRow,
  difficulty,
  getDifficultyColor,
} from "./Cards";
import {
  getKeyJSON,
  removeData,
  storeData,
} from "../../Functions/AsyncStorage";
import { toTitle } from "../Sudoku Board/sudoku";

const drillStrategies: sudokuStrategyArray = [
  "NAKED_SINGLE",
  "NAKED_PAIR",
  "NAKED_TRIPLET",
  "NAKED_QUADRUPLET",
  "HIDDEN_SINGLE",
  "HIDDEN_PAIR",
  "HIDDEN_TRIPLET",
  "HIDDEN_QUADRUPLET",
  "POINTING_PAIR",
  "POINTING_TRIPLET",
];

const drillImages: ImageURISource[] = [
  require("./../../../.assets/CardImages/NAKED_SINGLE.png"),
  require("./../../../.assets/CardImages/NAKED_PAIR.png"),
  require("./../../../.assets/CardImages/NAKED_TRIPLET.png"),
  require("./../../../.assets/CardImages/NAKED_QUADRUPLET.png"),
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

  async function showTutorialIfNotDismissed() {
    await getKeyJSON("dismissDrillTutorial").then((dismiss: any) => {
      // eslint-disable-next-line eqeqeq
      if (dismiss == undefined) {
        showDialog();
      }
    });
  }

  const drillButtonArray = [];
  let subArray = [];
  const columnCount: number = calculateCardsPerRow(
    props.width,
    drillStrategies.length,
  );
  for (let i = 0; i < drillStrategies.length; i++) {
    const img: ImageURISource = drillImages[i];
    let difficulty: difficulty;
    switch (drillStrategies[i]) {
      case "NAKED_SINGLE":
        difficulty = "Very Easy";
        break;
      case "NAKED_PAIR":
        difficulty = "Easy";
        break;
      case "NAKED_TRIPLET":
      case "NAKED_QUADRUPLET":
        difficulty = "Intermediate";
        break;
      case "HIDDEN_SINGLE":
        difficulty = "Hard";
        break;
      default:
        difficulty = "Very Hard";
        break;
    }
    const difficultyColor: string = getDifficultyColor(difficulty);
    subArray.push(
      <View
        key={drillStrategies[i]}
        style={{
          width: CARD_WIDTH,
          padding: CARD_PADDING,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            showTutorialIfNotDismissed().then(() => {
              navigation.navigate("DrillGame", {
                params: drillStrategies[i],
              });
            });
          }}
        >
          <Card mode="outlined">
            <Text variant="headlineMedium" style={{ alignSelf: "center" }}>
              {toTitle(drillStrategies[i])}
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
              given strategy and then click submit to check your work. Can't
              figure it out? No worries, just click the hint ? button to get the
              solution.
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
