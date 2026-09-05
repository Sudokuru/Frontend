import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, ImageURISource } from "react-native";
import { Button, Checkbox, Dialog, Portal, Text } from "react-native-paper";
import { difficulty, getDifficultyColor } from "./Cards";
import { toTitle } from "../../Functions/Utils";
import {
  getKeyJSON,
  removeData,
  storeData,
} from "../../Functions/AsyncStorage";
import { getActiveDrillGame } from "../../Api/Puzzles";
import { useMinWindowDimensions } from "../../Functions/WindowDimensions";
import { useTheme } from "../../Contexts/ThemeContext";
import ListPanel from "./ListPanel";
import {
  DRILL_STRATEGIES,
  DrillStrategy,
} from "../../Functions/DrillStrategies";

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

function getDrillDifficultyImage(level: difficulty): ImageURISource {
  switch (level) {
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

interface DrillCardItem {
  strategy: DrillStrategy;
  difficulty: difficulty;
}

const DrillPanel = ({ width, height }: DrillPanelProps) => {
  const navigation: any = useNavigation();
  const { theme } = useTheme();

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [checked, setChecked] = React.useState(false);
  const [resumeVisible, setResumeVisible] = React.useState(false);

  const minWindowSize = useMinWindowDimensions();
  const newSize = minWindowSize / 25;

  // This determines if user has active game and displays resume button conditionally.
  async function showOrHideResumeButton() {
    const game = await getActiveDrillGame();
    if (game != null) {
      setResumeVisible(true);
      return true;
    } else {
      setResumeVisible(false);
      return false;
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      showOrHideResumeButton();
    }, []),
  );

  async function showTutorialIfNotDismissed() {
    await getKeyJSON("dismissDrillTutorial").then((dismiss: any) => {
      if (!dismiss) {
        showDialog();
      }
    });
  }

  const dialogWidth = width > 800 ? width * 0.4 : Math.min(600, width);
  const checkboxWidth = width > 800 ? width * 0.2 : Math.min(300, width);
  const drillItems: DrillCardItem[] = DRILL_STRATEGIES.map((strategy) => ({
    strategy,
    difficulty: getDrillDifficulty(strategy),
  }));

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
        items={drillItems}
        getKey={(item) => item.strategy}
        getTestID={(item) => item.strategy}
        getTitle={(item) => toTitle(item.strategy)}
        getSubtitle={(item) => item.difficulty}
        getSubtitleColor={(item) =>
          getDifficultyColor(item.difficulty, theme.useDarkTheme)
        }
        getCardImage={(item) => getDrillDifficultyImage(item.difficulty)}
        onPress={(item) => {
          showTutorialIfNotDismissed().then(() => {
            navigation.navigate("DrillGame", {
              params: item.strategy,
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
