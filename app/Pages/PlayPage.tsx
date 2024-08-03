import React from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Alert from "react-native-awesome-alerts";
import { rgba } from "polished";
import {
  useMinWindowDimensions,
  useNewWindowDimensions,
} from "../Functions/WindowDimensions";
import { Puzzles } from "../Api/Puzzles";
import { SudokuObjectProps } from "../Functions/LocalDatabase";
import DifficultyPanel from "../Components/Home/DifficultyPanel";

const PlayPage = () => {
  const navigation: any = useNavigation();

  const windowSize = useNewWindowDimensions();
  const minWindowSize = useMinWindowDimensions();
  const newSize = minWindowSize / 25;
  const reSize = Math.min(windowSize.width, windowSize.height) / 25;

  const theme = useTheme();

  const [value, setValue] = React.useState("novice");

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
    }, [])
  );

  const [playHelpVisible, setPlayHelpVisible] = React.useState(false);
  const showPlayHelp = () => setPlayHelpVisible(true);
  const hidePlayHelp = () => setPlayHelpVisible(false);

  const [resumeVisible, setResumeVisible] = React.useState(false);
  const showResumeButton = () => setResumeVisible(true);
  const hideResumeButton = () => setResumeVisible(false);

  return (
    <ScrollView style={{ width: windowSize.width, height: windowSize.height }}>
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
            <View style={{ alignItems: "center", alignSelf: "center" }}>
              <View style={{ padding: reSize / 4 }}>
                <DifficultyPanel
                  width={windowSize.width}
                  height={windowSize.height}
                />
              </View>
            </View>
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
        showConfirmButton={true}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        confirmText={"OK"}
        confirmButtonColor={theme.colors.primary}
        onConfirmPressed={() => {
          hidePlayHelp();
        }}
        overlayStyle={{ backgroundColor: "transparent" }}
      />
    </ScrollView>
  );
};

export default PlayPage;
