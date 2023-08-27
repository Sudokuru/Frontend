import "react-native-gesture-handler"; // This needs to be at top to work
import "@expo/metro-runtime"; // web fast refresh for development
import * as React from "react";
import { PreferencesContext } from "./app/Contexts/PreferencesContext";
import { Provider as PaperProvider } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
// pages
import ProfilePage from "./app/Pages/ProfilePage";
import LandingPage from "./app/Pages/LandingPage";
import LearnHomePage from "./app/Pages/LearnHomePage";
import StatisticsPage from "./app/Pages/StatisticsPage";
import SudokuPage from "./app/Pages/SudokuPage";
import { NavigationContainer } from "@react-navigation/native";
// theme imports
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
} from "./app/Styling/ThemeColors";
import Lesson from "./app/Pages/Lesson";
import DrillPage from "./app/Pages/DrillPage";
import { Profile } from "./app/Functions/Api/Profile";
import DrillHomePage from "./app/Pages/DrillHome";
import PlayHomePage from "./app/Pages/PlayHomePage";
import InitializeContext from "./app/Contexts/InitializeContext";

export default function App() {
  const Stack = createStackNavigator();

  const { theme, preferences } = InitializeContext();

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Stack.Navigator
            initialRouteName="LandingPage"
            screenOptions={{
              headerShown: false,
              title: "Sudokuru",
            }}
          >
            <Stack.Screen name="Landing" component={LandingPage} />
            <Stack.Screen name="Profile" component={ProfilePage} />
            <Stack.Screen name="Statistics" component={StatisticsPage} />
            <Stack.Screen name="Sudoku" component={SudokuPage} />
            <Stack.Screen name="Lesson" component={Lesson} />
            <Stack.Screen name="LearnHome" component={LearnHomePage} />
            <Stack.Screen name="PlayHome" component={PlayHomePage} />
            <Stack.Screen name="DrillHome" component={DrillHomePage} />
            <Stack.Screen name="Drill" component={DrillPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}
