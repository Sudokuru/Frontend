import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, ImageURISource } from "react-native";
import { Button, Checkbox, Dialog, Portal, Text } from "react-native-paper";
import { SudokuStrategy } from "sudokuru";
import { difficulty, getDifficultyColor } from "./Cards";
import { toTitle } from "../../Functions/Utils";
import {
  getKeyJSON,
  removeData,
  storeData,
} from "../../Functions/AsyncStorage";
import { BoardObjectProps } from "../../Functions/LocalDatabase";
import { getGame } from "../../Api/Puzzles";
import { useMinWindowDimensions } from "../../Functions/WindowDimensions";
import ListPanel from "./ListPanel";

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

const drillImages: ImageURISource[] = [
  require("../../../.assets/DifficultyStars/3points.png"),
  require("../../../.assets/DifficultyStars/4points.png"),
  require("../../../.assets/DifficultyStars/5points.png"),
  require("../../../.assets/DifficultyStars/9points.png"),
  require("../../../.assets/DifficultyStars/24points.png"),
];

function getDrillDifficulty(strategy: DrillStrategy): difficulty {
  switch (strategy) {
    case "OBVIOUS_SINGLE":
      return "Very Easy";
    case "OBVIOUS_PAIR":
      return "Easy";
    case "OBVIOUS_TRIPLET":
    case "OBVIOUS_QUADRUPLET":
      return "Intermediate";
    case "HIDDEN_SINGLE":
      return "Hard";
    default:
      return "Very Hard";
  }
}

function getDrillDifficultyImage(strategy: DrillStrategy): ImageURISource {
  switch (getDrillDifficulty(strategy)) {
    case "Very Easy":
      return drillImages[0];
    case "Easy":
      return drillImages[1];
    case "Intermediate":
      return drillImages[2];
    case "Hard":
      return drillImages[3];
    default:
      return drillImages[4];
  }
}

interface DrillPanelProps {
  width: number;
  height: number;
}

const DrillPanel = ({ width, height }: DrillPanelProps) => {
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

  const dialogWidth = width > 800 ? width * 0.4 : Math.min(600, width);
  const checkboxWidth = width > 800 ? width * 0.2 : Math.min(300, width);

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
      <ListPanel
        width={width}
        height={height}
        items={[...DRILL_STRATEGIES]}
        getKey={(strategy) => strategy}
        getTestID={(strategy) => strategy}
        getTitle={(strategy) => toTitle(strategy)}
        getSubtitle={(strategy) => getDrillDifficulty(strategy)}
        getSubtitleColor={(strategy) =>
          getDifficultyColor(getDrillDifficulty(strategy))
        }
        getCardImage={(strategy) => getDrillDifficultyImage(strategy)}
        onPress={(strategy) => {
          showTutorialIfNotDismissed().then(() => {
            navigation.navigate("DrillGame", {
              params: strategy,
              action: "StartGame",
            });
          });
        }}
      />
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{
            alignSelf: "center",
            alignItems: "center",
            width: dialogWidth,
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
                width: checkboxWidth,
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
