import "react-native-gesture-handler"; // This needs to be at top to work
import "@expo/metro-runtime"; // web fast refresh for development
import * as React from "react";
import { PreferencesContext } from "./app/Contexts/PreferencesContext";
import { Provider as PaperProvider } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
// pages
import ProfilePage from "./app/Pages/ProfilePage";
import LandingPage from "./app/Pages/LandingPage";
import LearnPage from "./app/Pages/LearnPage";
import StatisticsPage from "./app/Pages/StatisticsPage";
import SudokuPage from "./app/Pages/SudokuPage";
import { NavigationContainer } from "@react-navigation/native";
// theme imports
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
} from "./app/Styling/ThemeColors";
import Lesson from "./app/Pages/Lesson";
import Drill from "./app/Pages/DrillGame";
import { Profile } from "./app/Functions/Api/Profile";
import DrillPage from "./app/Pages/DrillPage";
import PlayPage from "./app/Pages/PlayPage";
import InitializeContext from "./app/Contexts/InitializeContext";
import DrawerNavigator from "./app/Navigation/DrawerNavigator";

export default function App() {
  const Stack = createStackNavigator();

  const { theme, preferences } = InitializeContext();

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <DrawerNavigator />
        </NavigationContainer>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}
