import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfilePage from "../../Pages/ProfilePage";

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfilePage" component={ProfilePage} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
