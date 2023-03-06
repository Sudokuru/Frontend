import 'react-native-gesture-handler';
import * as React from 'react'
import { PreferencesContext } from './app/Contexts/PreferencesContext';
import {Provider as PaperProvider} from 'react-native-paper';
import {createStackNavigator} from "@react-navigation/stack";
// pages
import ProfilePage from "./app/Pages/ProfilePage";
import LandingPage from "./app/Pages/LandingPage";
import StatisticsPage from "./app/Pages/StatisticsPage";
import SudokuPage from "./app/Pages/SudokuPage";
import DrillPage from "./app/Pages/DrillPage";
import PuzzlePage from './app/Pages/PuzzlePage';
import HomePage from "./app/Pages/HomePage";
import { NavigationContainer } from '@react-navigation/native';
// theme imports
import {CombinedDarkTheme, CombinedDefaultTheme} from './app/Styling/ThemeColors';
import AdjustNotesLesson from "./app/Pages/Lessons/AdjustNotesLesson";
import BoxLineReductionLesson from "./app/Pages/Lessons/BoxLineReductionLesson";
import HiddenSetLesson from "./app/Pages/Lessons/HiddenSetLesson";
import HiddenSingleLesson from "./app/Pages/Lessons/HiddenSingleLesson";
import NakedSetLesson from "./app/Pages/Lessons/NakedSetLesson";
import NakedSingleLesson from "./app/Pages/Lessons/NakedSingleLesson";
import PointingPairLesson from "./app/Pages/Lessons/PointingPairLesson";
import PointingTripletLesson from "./app/Pages/Lessons/PointingTripletLesson";
import SimplifyNotesLesson from "./app/Pages/Lessons/SimplifyNotesLesson";
import SinglesChainingLesson from "./app/Pages/Lessons/SinglesChainingLesson";
import SwordfishLesson from "./app/Pages/Lessons/SwordfishLesson";
import XWingLesson from "./app/Pages/Lessons/XWingLesson";

export default function App() {

    const [isThemeDark, setIsThemeDark] = React.useState(false);

    let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

    const toggleTheme = React.useCallback(() => {
        return setIsThemeDark(!isThemeDark);
    }, [isThemeDark]);

    const preferences = React.useMemo(
        () => ({
            toggleTheme,
            isThemeDark,
        }),
        [toggleTheme, isThemeDark]
    );

    const Stack = createStackNavigator();

  return (
      <PreferencesContext.Provider value={preferences}>
          <PaperProvider theme={theme}>
              <NavigationContainer theme={theme}>
                  <Stack.Navigator initialRouteName="LandingPage" screenOptions={{
                      headerShown: false
                  }}>
                      <Stack.Screen name="Landing" component={LandingPage}/>
                      <Stack.Screen name="Home" component={HomePage} />
                      <Stack.Screen name="Profile" component={ProfilePage} />
                      <Stack.Screen name="Statistics" component={StatisticsPage}/>
                      <Stack.Screen name="Sudoku" component={SudokuPage}/>

                      <Stack.Screen name="AdjustNotesLesson" component={AdjustNotesLesson}/>
                      <Stack.Screen name="BoxLineReductionLesson" component={BoxLineReductionLesson}/>
                      <Stack.Screen name="HiddenSetLesson" component={HiddenSetLesson}/>
                      <Stack.Screen name="HiddenSingleLesson" component={HiddenSingleLesson}/>
                      <Stack.Screen name="NakedSetLesson" component={NakedSetLesson}/>
                      <Stack.Screen name="NakedSingleLesson" component={NakedSingleLesson}/>
                      <Stack.Screen name="PointingPairLesson" component={PointingPairLesson}/>
                      <Stack.Screen name="PointingTripletLesson" component={PointingTripletLesson}/>
                      <Stack.Screen name="SimplifyNotesLesson" component={SimplifyNotesLesson}/>
                      <Stack.Screen name="SinglesChainingLesson" component={SinglesChainingLesson}/>
                      <Stack.Screen name="SwordfishLesson" component={SwordfishLesson}/>
                      <Stack.Screen name="XWingLesson" component={XWingLesson}/>
                  </Stack.Navigator>
              </NavigationContainer>
          </PaperProvider>
      </PreferencesContext.Provider>
  );
}
