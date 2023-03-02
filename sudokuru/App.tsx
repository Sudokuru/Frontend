import 'react-native-gesture-handler';
import * as React from 'react'
import { PreferencesContext } from './app/Contexts/PreferencesContext';
import {Provider as PaperProvider} from 'react-native-paper';
import {createStackNavigator} from "@react-navigation/stack";
// pages
import ProfilePage from "./app/Pages/ProfilePage";
import LandingPage from "./app/Pages/LandingPage";
import StatisticsPage from "./app/Pages/StatisticsPage";
import LearnPage from "./app/Pages/LearnPage";
import DrillPage from "./app/Pages/DrillPage";
import PuzzlePage from './app/Pages/PuzzlePage';
import HomePage from "./app/Pages/HomePage";
import { NavigationContainer } from '@react-navigation/native';
// theme imports
import {CombinedDarkTheme, CombinedDefaultTheme} from './app/Styling/ThemeColors';

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
                      <Stack.Screen name="Puzzle" component={PuzzlePage}/>
                      <Stack.Screen name="Learn" component={LearnPage}/>
                      <Stack.Screen name="Drill" component={DrillPage}/>
                  </Stack.Navigator>
              </NavigationContainer>
          </PaperProvider>
      </PreferencesContext.Provider>
  );
}
