import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import React from "react";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import NavigationButton from "../Components/Home/NavigationButton";
import {
  useMinWindowDimensions,
  useNewWindowDimensions,
} from "../Functions/WindowDimensions";

// Example of how to use PressableStates
// https://github.com/necolas/react-native-web/issues/1708

const LandingPage = () => {
  const windowSize = useNewWindowDimensions();
  const minWindowSize = useMinWindowDimensions();

  const PLAY_SUDOKU_LOGO = require("../../.assets/playSudokuLogo.png");
  const START_LESSONS_LOGO = require("../../.assets/startLessonsLogo.png");
  const START_DRILLS_LOGO = require("../../.assets/startDrillsLogo.png");

  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
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
            image={START_LESSONS_LOGO}
            navigationPage="Learn"
            testID="HomeLearnButton"
          />
          <NavigationButton
            image={START_DRILLS_LOGO}
            navigationPage="Drill"
            testID="HomeDrillButton"
          />
          <NavigationButton
            image={PLAY_SUDOKU_LOGO}
            navigationPage="Play"
            testID="HomePlayButton"
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LandingPage;
