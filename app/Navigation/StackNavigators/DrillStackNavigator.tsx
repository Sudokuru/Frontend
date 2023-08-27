import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DrillPage from "../../Pages/DrillPage";
import DrillGame from "../../Pages/DrillGame";

const Stack = createStackNavigator();

const DrillStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DrillPage" component={DrillPage} />
      <Stack.Screen name="DrillGame" component={DrillGame} />
    </Stack.Navigator>
  );
};

export default DrillStackNavigator;
