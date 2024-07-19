import React from "react";
import SudokuBoard from "../Components/SudokuBoard/SudokuBoard";
import { StatusBar } from "expo-status-bar";
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

const SudokuPage = ({ route }: any) => {
  const { action } = route.params;
  const { difficulty } = route.params;

  return (
    <>
      <SudokuBoard action={action} difficulty={difficulty} />
      <StatusBar style="auto" />
    </>
  );
};

export default SudokuPage;
