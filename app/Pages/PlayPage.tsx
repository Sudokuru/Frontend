import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { rgba } from "polished";
import React from "react";
import { View, Pressable } from "react-native";
import Alert from "react-native-awesome-alerts";
import { Text, useTheme, Button } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { sudokuStrategyArray } from "sudokuru";

import { Puzzles } from "../Api/Puzzles";
import { SudokuObjectProps } from "../Functions/LocalDatabase";
import {
  useMinWindowDimensions,
  useNewWindowDimensions,
} from "../Functions/WindowDimensions";

// const strategies: sudokuStrategyArray = [
//   "AMEND_NOTES",
//   "SIMPLIFY_NOTES",
//   "NAKED_SINGLE",
//   "NAKED_PAIR",
//   "NAKED_TRIPLET",
//   "NAKED_QUADRUPLET",
//   "HIDDEN_SINGLE",
//   "HIDDEN_PAIR",
//   "HIDDEN_TRIPLET",
//   "HIDDEN_QUADRUPLET",
// ];

const PlayPage = () => {
  const navigation: any = useNavigation();

  const windowSize = useNewWindowDimensions();
  const minWindowSize = useMinWindowDimensions();
  const newSize = minWindowSize / 25;

  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      // This determines if user has active game and displays resume button conditionally.
      async function grabCurrentGame() {
        await Puzzles.getGame().then((game: SudokuObjectProps[]) => {
          if (game != null) {
            showResumeButton();
          } else {
            hideResumeButton();
          }
        });
      }
      grabCurrentGame();
    }, []),
  );

  const [playHelpVisible, setPlayHelpVisible] = React.useState(false);
  const showPlayHelp = () => setPlayHelpVisible(true);
  const hidePlayHelp = () => setPlayHelpVisible(false);

  const [resumeVisible, setResumeVisible] = React.useState(false);
  const showResumeButton = () => setResumeVisible(true);
  const hideResumeButton = () => setResumeVisible(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ width: windowSize.width, height: windowSize.height }}
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 50,
                  lineHeight: 50,
                  fontWeight: "bold",
                }}
              >
                Play{" "}
                <Text style={{ color: theme.colors.onBackground }}>
                  a Sudoku game
                </Text>
              </Text>
              <Pressable
                onPress={() => showPlayHelp()}
                style={{ alignSelf: "flex-start" }}
              >
                <Text
                  style={{
                    color: theme.colors.onBackground,
                    lineHeight: 16,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  ?
                </Text>
              </Pressable>
            </View>
            <View style={{ alignItems: "center", alignSelf: "center" }}>
              {resumeVisible ? (
                <Button
                  style={{ margin: newSize / 4 }}
                  mode="outlined"
                  onPress={() =>
                    navigation.navigate("SudokuPage", {
                      action: "ResumeGame",
                    })
                  }
                >
                  Resume Puzzle
                </Button>
              ) : (
                <></>
              )}
              <Button
                style={{ margin: newSize / 4 }}
                mode="contained"
                onPress={() => {
                  navigation.navigate("SudokuPage", {
                    action: "StartGame",
                  });
                }}
              >
                Start Puzzle
              </Button>
            </View>
          </View>
        </View>
        <Alert
          show={playHelpVisible}
          title="Play Help"
          message={
            `To play a puzzle, select a difficulty using the difficulty slider and press the "Play Puzzle" button.\n\n` +
            `You will only be served puzzles with strategies that you have already learned! This will ensure that you will not encounter a puzzle that you don't have the skills and knowledge to solve.` +
            `If you have a game currently in progress, you can resume the game by clicking the "Resume Puzzle" button`
          }
          messageStyle={{ maxWidth: 500 }}
          alertContainerStyle={{
            backgroundColor: rgba(theme.colors.background, 0.3),
          }}
          showConfirmButton
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          confirmText="OK"
          confirmButtonColor={theme.colors.primary}
          onConfirmPressed={() => {
            hidePlayHelp();
          }}
          overlayStyle={{ backgroundColor: "transparent" }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default PlayPage;
