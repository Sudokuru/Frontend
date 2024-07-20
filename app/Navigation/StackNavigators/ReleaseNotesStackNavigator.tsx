import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ReleaseNotesPage from "../../Pages/ReleaseNotesPage";

const Stack = createStackNavigator();

const ReleaseNotesNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        title: "Sudokuru",
        headerShown: false,
      }}
    >
      <Stack.Screen name="ReleaseNotesPage" component={ReleaseNotesPage} />
    </Stack.Navigator>
  );
};

export default ReleaseNotesNavigator;
