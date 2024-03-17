import { createDrawerNavigator } from "@react-navigation/drawer";
import * as React from "react";
import { useTheme } from "react-native-paper";

import ContactStackNavigator from "./StackNavigators/ContactStackNavigator";
import DrillStackNavigator from "./StackNavigators/DrillStackNavigator";
import LandingStackNavigator from "./StackNavigators/LandingStackNavigator";
import LearnStackNavigator from "./StackNavigators/LearnStackNavigator";
import PlayStackNavigator from "./StackNavigators/PlayStackNavigator";
import ProfileStackNavigator from "./StackNavigators/ProfileStackNavigator";
import StatisticsStackNavigator from "./StackNavigators/StatisticsStackNavigator";
import Header from "../Components/Header";
import NavigationSideBar from "../Components/NavigationSideBar";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={({ navigation }) => {
        return <NavigationSideBar navigation={navigation} />;
      }}
      screenOptions={{
        drawerStyle: {
          width: 210,
          backgroundColor: theme.colors.background,
          overflow: "hidden", //white space was being caused during some resizes
        },
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
      <Drawer.Screen name="Statistics" component={StatisticsStackNavigator} />
      <Drawer.Screen name="Profile" component={ProfileStackNavigator} />
      <Drawer.Screen name="Contact" component={ContactStackNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
