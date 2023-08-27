import React from "react";
import { Platform, ScaledSize, View, useWindowDimensions } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { useTheme } from "react-native-paper";
import { sudokuStrategyArray } from "sudokuru";
import {
  useMinWindowDimensions,
  useNewWindowDimensions,
} from "../Functions/global/WindowDimensions";
import NavigationButton from "../Components/Home/NavigationButton";
import { useHeaderHeight } from "@react-navigation/elements";
import { getBoardSize } from "../Components/Sudoku Board/Functions/BoardFunctions";

// Example of how to use PressableStates
// https://github.com/necolas/react-native-web/issues/1708

const LandingPage = () => {
  const isWeb = Platform.OS === "web";

  const navigation: any = useNavigation();

  const windowSize = useNewWindowDimensions();

  const minWindowSize = useMinWindowDimensions();
  const theme = useTheme();

  const boardSize = getBoardSize();

  const PLAY_SUDOKU_LOGO = require("./playSudokuLogo.png");
  const START_LESSONS_LOGO = require("./startLessonsLogo.png");
  const START_DRILLS_LOGO = require("./startDrillsLogo.png");

  let strategies: sudokuStrategyArray = [
    "AMEND_NOTES",
    "SIMPLIFY_NOTES",
    "NAKED_SINGLE",
    "NAKED_PAIR",
    "NAKED_TRIPLET",
    "NAKED_QUADRUPLET",
    "HIDDEN_SINGLE",
    "HIDDEN_PAIR",
    "HIDDEN_TRIPLET",
    "HIDDEN_QUADRUPLET",
  ];

  let [fontsLoaded] = useFonts({
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
          // backgroundColor: 'orange'
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: minWindowSize / 25,
            // backgroundColor: 'green'
          }}
        >
          <SudokuBoard gameType={"Demo"} strategies={strategies} />
          {windowSize.width >= 430 ? (
            <View
              style={{
                flexDirection: "column",
                gap: minWindowSize / 25,
                justifyContent: "center",
                // backgroundColor: 'blue'
              }}
            >
              <NavigationButton
                image={PLAY_SUDOKU_LOGO}
                navigationPage="Play"
              />
              <NavigationButton
                image={START_DRILLS_LOGO}
                navigationPage="Drill"
              />
              <NavigationButton
                image={PLAY_SUDOKU_LOGO}
                navigationPage="Play"
              />
              <NavigationButton
                image={PLAY_SUDOKU_LOGO}
                navigationPage="Play"
              />
            </View>
          ) : (
            <></>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: minWindowSize / 25,
            // backgroundColor: 'blue'
          }}
        >
          <NavigationButton image={START_LESSONS_LOGO} navigationPage="Learn" />
          <NavigationButton image={START_DRILLS_LOGO} navigationPage="Drill" />
          <NavigationButton image={PLAY_SUDOKU_LOGO} navigationPage="Play" />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LandingPage;
