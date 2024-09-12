import React from "react";
import SudokuBoard from "../Components/SudokuBoard/SudokuBoard";
import { StatusBar } from "expo-status-bar";

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
