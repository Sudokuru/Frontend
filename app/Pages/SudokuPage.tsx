import React from "react";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { sudokuStrategyArray } from "sudokuru";

// startGame - https://www.npmjs.com/package/sudokuru#:~:text=sudokuru.Puzzles%3B-,Puzzles.startGame(),-Description%3A%20Returns%20puzzle

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
  "POINTING_PAIR",
  "POINTING_TRIPLET",
];

const SudokuPage = ({ route, navigation }: any) => {
  const { gameType } = route.params;
  const { difficulty } = route.params;

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {/* The game now required the info about it to be rendered, which is given in generateGame() */}
        <SudokuBoard
          gameType={gameType}
          difficulty={difficulty}
          strategies={strategies}
          navigation={navigation}
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SudokuPage;
