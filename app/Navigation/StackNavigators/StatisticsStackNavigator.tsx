import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import StatisticsPage from "../../Pages/StatisticsPage";

const Stack = createStackNavigator();

const StatisticsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        title: "Sudokuru",
        headerShown: false,
      }}
    >
      <Stack.Screen name="StatisticsPage" component={StatisticsPage} />
    </Stack.Navigator>
  );
};

export default StatisticsStackNavigator;
