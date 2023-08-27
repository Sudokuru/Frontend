import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LandingStackNavigator from "./StackNavigators/LandingStackNavigator";
import LearnStackNavigator from "./StackNavigators/LearnStackNavigator";
import DrillStackNavigator from "./StackNavigators/DrillStackNavigator";
import PlayStackNavigator from "./StackNavigators/PlayStackNavigator";
import Header from "../Components/Header";
import { useWindowDimensions } from "react-native";
import NavigationSideBar from "../Components/NavigationSideBar";
import StatisticsStackNavigator from "./StackNavigators/StatisticsStackNavigator";
import ProfileStackNavigator from "./StackNavigators/ProfileStackNavigator";
import { useTheme } from "react-native-paper";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const size = useWindowDimensions();
  const theme = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={({ navigation }) => {
        return <NavigationSideBar navigation={navigation} />;
      }}
      screenOptions={{
        drawerStyle: {
          backgroundColor: theme.colors.background,
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
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
