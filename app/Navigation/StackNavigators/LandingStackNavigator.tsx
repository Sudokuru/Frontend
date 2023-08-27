import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LandingPage from "../../Pages/LandingPage";
import StatisticsPage from "../../Pages/StatisticsPage";
import ProfilePage from "../../Pages/ProfilePage";

const Stack = createStackNavigator();

const LandingStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LandingPage" component={LandingPage} />
    </Stack.Navigator>
  );
};

export default LandingStackNavigator;
