import React from "react";
import SudokuBoard from "../Components/SudokuBoard/SudokuBoard";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";
import { Text } from "react-native-paper";

const SudokuPage = ({ route }: any) => {
  const { action } = route.params;
  const { difficulty } = route.params;

  const isFocused = useIsFocused();
  if (!isFocused) return <Text>Loading...</Text>;

  return (
    <>
      <SudokuBoard action={action} difficulty={difficulty} />
      <StatusBar style="auto" />
    </>
  );
};

export default SudokuPage;
