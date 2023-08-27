import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LearnHomePage from "../../Pages/LearnHomePage";

const Stack = createStackNavigator();

const LearnStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LearnPage" component={LearnHomePage} />
    </Stack.Navigator>
  );
};

export default LearnStackNavigator;
