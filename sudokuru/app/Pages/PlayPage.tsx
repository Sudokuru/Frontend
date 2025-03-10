import React from "react";
import { View, ScrollView } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

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
    </ScrollView>
  );
};

export default PlayPage;
