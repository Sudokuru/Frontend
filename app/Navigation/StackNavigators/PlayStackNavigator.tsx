import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import PlayPage from "../../Pages/PlayPage";
import SudokuPage from "../../Pages/SudokuPage";

const Stack = createStackNavigator();

const PlayStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        title: "Sudokuru",
        headerShown: false,
      }}
    >
      <Stack.Screen name="PlayPage" component={PlayPage} />
      <Stack.Screen name="SudokuPage" component={SudokuPage} />
    </Stack.Navigator>
  );
};

export default PlayStackNavigator;
