import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import LearnPage from "../../Pages/LearnPage";
import Lesson from "../../Pages/Lesson";

const Stack = createStackNavigator();

const LearnStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        title: "Sudokuru",
        headerShown: false,
      }}
    >
      <Stack.Screen name="LearnPage" component={LearnPage} />
      <Stack.Screen name="Lesson" component={Lesson} />
    </Stack.Navigator>
  );
};

export default LearnStackNavigator;
