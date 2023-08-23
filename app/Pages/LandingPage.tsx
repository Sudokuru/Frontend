import React, { useState } from "react";
import { Platform, Pressable, useWindowDimensions, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import { Image } from "react-native";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import NavigationBar from "../Components/NavigationBar";
import { Surface, Text, useTheme } from "react-native-paper";
import { sudokuStrategyArray } from "sudokuru";
import { getMinWindowDimensions } from "../Functions/global/WindowDimensions";
import Header from "../Components/Header";
import NavigationButton from "../Components/Home/NavigationButton";

// Example of how to use PressableStates
// https://github.com/necolas/react-native-web/issues/1708

const LandingPage = () => {
  const isWeb = Platform.OS === "web";

  const navigation: any = useNavigation();
  const size = useWindowDimensions();
  const minWindowSize = getMinWindowDimensions();

  const theme = useTheme();

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
      <SafeAreaView style={{ width: size.width, height: size.height }}>
        <Header></Header>
        <View style={{ flexDirection: "row" }}>
          <NavigationBar />
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <SudokuBoard gameType={"Demo"} strategies={strategies} />
          </View>
          <View
            style={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: minWindowSize / 20,
            }}
          >
            <NavigationButton image={START_LESSONS_LOGO} />
            <NavigationButton image={START_DRILLS_LOGO} />
            <NavigationButton image={PLAY_SUDOKU_LOGO} />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LandingPage;
