import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DrillHomePage from "../../Pages/DrillHome";

const Stack = createStackNavigator();

const DrillStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={DrillHomePage} />
    </Stack.Navigator>
  );
};

export default DrillStackNavigator;
