import 'react-native-gesture-handler';
import * as React from 'react'
import { PreferencesContext } from './app/Contexts/PreferencesContext';
import {adaptNavigationTheme, Provider as PaperProvider} from 'react-native-paper';
import {createStackNavigator} from "@react-navigation/stack";
import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
    MD3DarkTheme,
    MD3LightTheme,
} from 'react-native-paper';
import merge from 'deepmerge';
import ProfilePage from "./app/Pages/ProfilePage";
import HomePage from "./app/Pages/HomePage";
import StatisticsPage from "./app/Pages/StatisticsPage";
import LearnPage from "./app/Pages/LearnPage";
import DrillPage from "./app/Pages/DrillPage";

export default function App() {

    const { LightTheme, DarkTheme } = adaptNavigationTheme({
        reactNavigationLight: NavigationDefaultTheme,
        reactNavigationDark: NavigationDarkTheme,
    });

    const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
    const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

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
                  <Stack.Navigator initialRouteName="Home" screenOptions={{
                      headerShown: false
                  }}>
                      <Stack.Screen name="Home" component={HomePage} />
                      <Stack.Screen name="Profile" component={ProfilePage} />
                      <Stack.Screen name="Statistics" component={StatisticsPage}/>

                      <Stack.Screen name="Learn" component={LearnPage}/>
                      <Stack.Screen name="Drill" component={DrillPage}/>
                  </Stack.Navigator>
              </NavigationContainer>
          </PaperProvider>
      </PreferencesContext.Provider>
  );
}
