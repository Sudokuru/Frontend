import React from "react";
import { View } from "react-native";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  useMinWindowDimensions,
  useNewWindowDimensions,
} from "../Functions/WindowDimensions";
import NavigationButton from "../Components/Home/NavigationButton";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { useTheme } from "../Contexts/ThemeContext";
import { useIsFocused } from "@react-navigation/native";
import { Text } from "react-native-paper";

// Example of how to use PressableStates
// https://github.com/necolas/react-native-web/issues/1708

const HomePage = () => {
  const { theme } = useTheme();

  const windowSize = useNewWindowDimensions();
  const minWindowSize = useMinWindowDimensions();

  const { featurePreviewSetting } = React.useContext(PreferencesContext);

  const PLAY_SUDOKU_LOGO = require("../../.assets/playSudokuLogo.png");
  const START_LESSONS_LOGO = require("../../.assets/startLessonsLogo.png");
  const START_DRILLS_LOGO = require("../../.assets/startDrillsLogo.png");

  const DARK_BLUE_PLAY_SUDOKU_LOGO = require("../../.assets/darkBluePlaySudokuLogo.png");
  const DARK_BLUE_START_LESSONS_LOGO = require("../../.assets/darkBlueStartLessonsLogo.png");
  const DARK_BLUE_START_DRILLS_LOGO = require("../../.assets/darkBlueStartDrillsLogo.png");

  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  const isFocused = useIsFocused();
  if (!isFocused) return <Text>Error Loading Page</Text>;

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={{
        width: windowSize.width,
        height: windowSize.height,
        flexDirection: "column",
        alignItems: "center",
        gap: minWindowSize / 25,
      }}
    >
      {/* <SudokuBoard gameType={"Demo"} strategies={strategies} /> */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: minWindowSize / 25,
        }}
      >
        <NavigationButton
          image={
            theme.useDarkTheme
              ? START_LESSONS_LOGO
              : DARK_BLUE_START_LESSONS_LOGO
          }
          navigationPage="LearnPage"
          testID="HomeLearnButton"
        />
        {featurePreviewSetting && (
          <NavigationButton
            image={
              theme.useDarkTheme
                ? START_DRILLS_LOGO
                : DARK_BLUE_START_DRILLS_LOGO
            }
            navigationPage="DrillPage"
            testID="HomeDrillButton"
          />
        )}
        <NavigationButton
          image={
            theme.useDarkTheme ? PLAY_SUDOKU_LOGO : DARK_BLUE_PLAY_SUDOKU_LOGO
          }
          navigationPage="PlayPage"
          testID="HomePlayButton"
        />
      </View>
    </View>
  );
};

export default HomePage;
