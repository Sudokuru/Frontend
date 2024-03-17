import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import ProfilePage from "../../Pages/ProfilePage";

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        title: "Sudokuru",
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfilePage" component={ProfilePage} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
