import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import DrillGame from "../../Pages/DrillGame";
import DrillPage from "../../Pages/DrillPage";

const Stack = createStackNavigator();

const DrillStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        title: "Sudokuru",
        headerShown: false,
      }}
    >
      <Stack.Screen name="DrillPage" component={DrillPage} />
      <Stack.Screen name="DrillGame" component={DrillGame} />
    </Stack.Navigator>
  );
};

export default DrillStackNavigator;
