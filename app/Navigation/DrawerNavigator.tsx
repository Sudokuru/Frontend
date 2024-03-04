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
import ContactStackNavigator from "./StackNavigators/ContactStackNavigator";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const size = useWindowDimensions();
  const theme = useTheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
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
          <Drawer.Screen
            name="Statistics"
            component={StatisticsStackNavigator}
          />
          <Drawer.Screen name="Profile" component={ProfileStackNavigator} />
          <Drawer.Screen name="Contact" component={ContactStackNavigator} />
        </Drawer.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default DrawerNavigator;
