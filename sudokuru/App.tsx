import 'react-native-gesture-handler';
import * as React from 'react'
import { PreferencesContext } from './app/Contexts/PreferencesContext';
import {adaptNavigationTheme, Provider as PaperProvider} from 'react-native-paper';
import {createStackNavigator} from "@react-navigation/stack";
const Stack = createStackNavigator();
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
import PuzzlePage from './app/Pages/Puzzle';

const dTheme = {
    ...MD3DarkTheme, // or MD3DarkTheme
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#F2F2F2',
    onPrimary: '#F2F2F2',
    primaryContainer: '#F2F2F2',
    onPrimaryContainer: '#F2F2F2',
    background: '#025E73',
    onBackground: '#F2F2F2',
    secondary: '#F2F2F2',
    secondaryContainer: '#F2F2F2',
    tertiary: '#F2F2F2',
    tertiaryContainer: '#F2F2F2',
    backdrop: '#025E73',
    onSecondaryContainer: '#F2F2F2',
    onTertiary: '#F2F2F2',
    onTertiaryContainer: '#F2F2F2',
    onSurface: '#F2F2F2',
    onSurfaceVariant: '#F2F2F2',
  },
};

const d2Theme = {
    ...NavigationDarkTheme,
 colors: {
   ...NavigationDarkTheme.colors,
   primary: '#D9A05B',
    onPrimary: '#F2F2F2',
    primaryContainer: 'rgb(217, 160, 91)',
    onPrimaryContainer: '#F2F2F2',
    background: '#025E73',
    onBackground: '#F2F2F2',
    secondary: '#F2F2F2',
    secondaryContainer: '#F2F2F2',
    tertiary: '#F2F2F2',
    tertiaryContainer: '#F2F2F2',
    backdrop: '#025E73',
    onSecondaryContainer: '#F2F2F2',
    onTertiary: '#F2F2F2',
    onTertiaryContainer: '#F2F2F2',
    onSurface: '#F2F2F2',
    onSurfaceVariant: '#F2F2F2',
},};

const l2Theme = {
    ...NavigationDefaultTheme,
 colors: {
   ...NavigationDefaultTheme.colors,
   primary: '#D9A05B',
    onPrimary: '#F2F2F2',
    primaryContainer: 'rgb(217, 160, 91)',
    onPrimaryContainer: '#F2F2F2',
    background: '#025E73',
    onBackground: '#F2F2F2',
    secondary: '#F2F2F2',
    secondaryContainer: '#F2F2F2',
    tertiary: '#F2F2F2',
    tertiaryContainer: '#F2F2F2',
    backdrop: '#025E73',
    onSecondaryContainer: '#F2F2F2',
    onTertiary: '#F2F2F2',
    onTertiaryContainer: '#F2F2F2',
    onSurface: '#F2F2F2',
    onSurfaceVariant: '#F2F2F2',
},};


const lTheme = {
    ...MD3LightTheme, // or MD3DarkTheme
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#D9A05B',
    onPrimary: '#F2F2F2',
    primaryContainer: 'rgb(217, 160, 91)',
    onPrimaryContainer: '#F2F2F2',
    background: '#025E73',
    onBackground: '#F2F2F2',
    secondary: '#F2F2F2',
    secondaryContainer: '#F2F2F2',
    tertiary: '#F2F2F2',
    tertiaryContainer: '#F2F2F2',
    backdrop: '#025E73',
    onSecondaryContainer: '#F2F2F2',
    onTertiary: '#F2F2F2',
    onTertiaryContainer: '#F2F2F2',
    onSurface: '#F2F2F2',
    onSurfaceVariant: '#F2F2F2',
  },
};

export default function App() {

    const { LightTheme, DarkTheme } = adaptNavigationTheme({
        reactNavigationLight: NavigationDefaultTheme,
        reactNavigationDark: NavigationDarkTheme,
    });

    const CombinedDefaultTheme = merge(lTheme, l2Theme)
    const CombinedDarkTheme = merge(dTheme, d2Theme)
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
                      <Stack.Screen name="Puzzle" component={PuzzlePage}/>
                      <Stack.Screen name="Learn" component={LearnPage}/>
                      <Stack.Screen name="Drill" component={DrillPage}/>
                  </Stack.Navigator>
              </NavigationContainer>
          </PaperProvider>
      </PreferencesContext.Provider>
  );
}
