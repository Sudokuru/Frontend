import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Header from "../Components/Header";
import NavigationSideBar from "../Components/NavigationSideBar";
import { useTheme } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import StatisticsPage from "../Pages/StatisticsPage";
import ProfilePage from "../Pages/ProfilePage";
import SudokuPage from "../Pages/SudokuPage";
import PlayPage from "../Pages/PlayPage";
import LearnPage from "../Pages/LearnPage";
import Lesson from "../Pages/Lesson";
import HomePage from "../Pages/HomePage";
import DrillPage from "../Pages/DrillPage";
import DrillGame from "../Pages/DrillGame";
import ContactPage from "../Pages/ContactPage";
import ReleaseNotesPage from "../Pages/ReleaseNotesPage";
import AboutUsPage from "../Pages/AboutUsPage";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const theme = useTheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <Drawer.Navigator
          drawerContent={({ navigation }) => {
            return <NavigationSideBar navigation={navigation} />;
          }}
          screenOptions={{
            drawerStyle: {
              width: 230,
              backgroundColor: theme.colors.background,
              overflow: "hidden", //white space was being caused during some resizes
            },
            headerShown: true,
            header: ({ navigation, route, options }) => {
              return <Header />;
            },
            unmountOnBlur: true,
            title: "Sudokuru",
            // turning unmountOnBlur means useHeaderHeight is never zero anymore... no idea why.
            // also I believe it may have sped up the playwright test execution, which makes sense as less html to parse through.
          }}
        >
          <Drawer.Screen name="HomePage" component={HomePage} />
          <Drawer.Screen name="PlayPage" component={PlayPage} />
          <Drawer.Screen name="SudokuPage" component={SudokuPage} />
          <Drawer.Screen name="ContactPage" component={ContactPage} />
          <Drawer.Screen name="DrillPage" component={DrillPage} />
          <Drawer.Screen name="DrillGame" component={DrillGame} />
          <Drawer.Screen name="LearnPage" component={LearnPage} />
          {/* @ts-ignore */}
          <Drawer.Screen name="Lesson" component={Lesson} />
          <Drawer.Screen name="ProfilePage" component={ProfilePage} />
          <Drawer.Screen name="StatisticsPage" component={StatisticsPage} />
          <Drawer.Screen name="ReleaseNotesPage" component={ReleaseNotesPage} />
          <Drawer.Screen name="AboutUsPage" component={AboutUsPage} />
        </Drawer.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default DrawerNavigator;
