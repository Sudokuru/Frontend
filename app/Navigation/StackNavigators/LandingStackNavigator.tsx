import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LandingPage from "../../Pages/LandingPage";

const Stack = createStackNavigator();

const LandingStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={LandingPage} />
    </Stack.Navigator>
  );
};

export default LandingStackNavigator;
