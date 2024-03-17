import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import ContactPage from "../../Pages/ContactPage";

const Stack = createStackNavigator();

const ContactStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        title: "Sudokuru",
        headerShown: false,
      }}
    >
      <Stack.Screen name="ContactPage" component={ContactPage} />
    </Stack.Navigator>
  );
};

export default ContactStackNavigator;
