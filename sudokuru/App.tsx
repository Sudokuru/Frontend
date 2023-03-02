import 'react-native-gesture-handler';
import * as React from 'react'
import { PreferencesContext } from './app/Contexts/PreferencesContext';
import {adaptNavigationTheme, Provider as PaperProvider} from 'react-native-paper';
import {createStackNavigator} from "@react-navigation/stack";
import merge from 'deepmerge';
// pages
import ProfilePage from "./app/Pages/ProfilePage";
import LandingPage from "./app/Pages/LandingPage";
import StatisticsPage from "./app/Pages/StatisticsPage";
import LearnPage from "./app/Pages/LearnPage";
import DrillPage from "./app/Pages/DrillPage";
import PuzzlePage from './app/Pages/PuzzlePage';
import HomePage from "./app/Pages/HomePage";
import {
    MD3DarkTheme,
    MD3LightTheme,
} from 'react-native-paper';
import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
// theme imports
import dTheme from './app/Styling/ThemeColors';
import d2Theme from './app/Styling/ThemeColors';
import lTheme from './app/Styling/ThemeColors';
import l2Theme from './app/Styling/ThemeColors';


export default function App() {

    const CombinedDefaultTheme = merge(lTheme.dTheme, l2Theme.l2Theme);
    const CombinedDarkTheme = merge(dTheme.d2Theme, d2Theme.lTheme);
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
                      <Stack.Screen name="Puzzle" component={PuzzlePage}/>
                      <Stack.Screen name="Learn" component={LearnPage}/>
                      <Stack.Screen name="Drill" component={DrillPage}/>
                  </Stack.Navigator>
              </NavigationContainer>
          </PaperProvider>
      </PreferencesContext.Provider>
  );
}
