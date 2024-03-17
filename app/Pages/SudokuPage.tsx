import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { sudokuStrategyArray } from "sudokuru";

import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";

// startGame - https://www.npmjs.com/package/sudokuru#:~:text=sudokuru.Puzzles%3B-,Puzzles.startGame(),-Description%3A%20Returns%20puzzle

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
//   "POINTING_PAIR",
//   "POINTING_TRIPLET",
// ];

const SudokuPage = ({ route }: any) => {
  const { action } = route.params;

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <SudokuBoard action={action} />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SudokuPage;
