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
import { getGame } from "../Api/Puzzles";
import { SudokuObjectProps } from "../Functions/LocalDatabase";
import DifficultyPanel from "../Components/Home/DifficultyPanel";

const PlayPage = () => {
  const navigation: any = useNavigation();

  const windowSize = useNewWindowDimensions();
  const minWindowSize = useMinWindowDimensions();
  const newSize = minWindowSize / 25;
  const reSize = Math.min(windowSize.width, windowSize.height) / 25;

  const titleText = windowSize.width > 500 ? "a Sudoku game" : "Sudoku";

  const theme = useTheme();

  // This determines if user has active game and displays resume button conditionally.
  async function showOrHideResumeButton() {
    const game: SudokuObjectProps[] = await getGame();
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
              testID="playPageTitle"
              style={{
                color: theme.colors.primary,
                fontSize: 50,
                lineHeight: 50,
                fontWeight: "bold",
              }}
            >
              Play{" "}
              <Text style={{ color: theme.colors.onBackground }}>
                {titleText}
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
                onPress={async function handlePress() {
                  const game = await showOrHideResumeButton();
                  if (game) {
                    navigation.navigate("SudokuPage", {
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
            <View
              style={{
                alignItems: "center",
                alignSelf: "center",
                padding: reSize / 4,
              }}
            >
              <DifficultyPanel
                width={windowSize.width}
                height={windowSize.height}
                navigation={navigation}
              />
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
