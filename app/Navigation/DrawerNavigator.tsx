import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LandingStackNavigator from "./StackNavigators/LandingStackNavigator";
import LearnStackNavigator from "./StackNavigators/LearnStackNavigator";
import DrillStackNavigator from "./StackNavigators/DrillStackNavigator";
import PlayStackNavigator from "./StackNavigators/PlayStackNavigator";
import Header from "../Components/Header";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        header: ({ navigation, route, options }) => {
          return <Header />;
        },
      }}
    >
      <Drawer.Screen name="Landing" component={LandingStackNavigator} />
      <Drawer.Screen name="Learn" component={LearnStackNavigator} />
      <Drawer.Screen name="Drill" component={DrillStackNavigator} />
      <Drawer.Screen name="Play" component={PlayStackNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
