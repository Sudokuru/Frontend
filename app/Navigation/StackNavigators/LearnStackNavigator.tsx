import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LearnPage from "../../Pages/LearnPage";
import Lesson from "../../Pages/Lesson";

const Stack = createStackNavigator();

const LearnStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LearnPage" component={LearnPage} />
      <Stack.Screen name="Lesson" component={Lesson} />
    </Stack.Navigator>
  );
};

export default LearnStackNavigator;
