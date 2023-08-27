import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StatisticsPage from "../../Pages/StatisticsPage";

const Stack = createStackNavigator();

const StatisticsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="StatisticsPage" component={StatisticsPage} />
    </Stack.Navigator>
  );
};

export default StatisticsStackNavigator;
