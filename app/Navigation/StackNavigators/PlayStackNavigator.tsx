import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PlayHomePage from "../../Pages/PlayHomePage";

const Stack = createStackNavigator();

const PlayStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PlayPage" component={PlayHomePage} />
    </Stack.Navigator>
  );
};

export default PlayStackNavigator;
