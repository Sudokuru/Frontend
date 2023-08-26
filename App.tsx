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

export default function App() {
  const [isThemeDark, setIsThemeDark] = React.useState(true);
  const [isCurrentPage, setCurrentPage] = React.useState("Landing");
  const [learnedLessons, setLearnedLessons] = React.useState(["NONE"]);
  const [isHighlightIdenticalValues, setHighlightIdenticalValues] =
    React.useState(true);
  const [isHighlightBox, setHighlightBox] = React.useState(true);
  const [isHighlightRow, setHighlightRow] = React.useState(true);
  const [isHighlightColumn, setHighlightColumn] = React.useState(true);

  // set initial values of theme
  React.useEffect(() => {
    Profile.getProfile().then((data) => {
      setIsThemeDark(data.theme);
      setHighlightIdenticalValues(data.highlightIdenticalValues);
      setHighlightBox(data.highlightBox);
      setHighlightRow(data.highlightRow);
      setHighlightColumn(data.highlightColumn);
    });
  }, []);

  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = React.useCallback(() => {
    Profile.setProfileValue("theme");
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const updateCurrentPage = React.useCallback(
    (props: any) => {
      return setCurrentPage(props);
    },
    [isCurrentPage]
  );

  const updateLearnedLessons = React.useCallback(
    (props: any) => {
      return setLearnedLessons(props);
    },
    [learnedLessons]
  );

  const toggleHighlightIdenticalValues = React.useCallback(() => {
    Profile.setProfileValue("highlightIdenticalValues");
    return setHighlightIdenticalValues(!isHighlightIdenticalValues);
  }, [isHighlightIdenticalValues]);

  const toggleHighlightBox = React.useCallback(() => {
    Profile.setProfileValue("highlightBox");
    return setHighlightBox(!isHighlightBox);
  }, [isHighlightBox]);

  const toggleHighlightRow = React.useCallback(() => {
    Profile.setProfileValue("highlightRow");
    return setHighlightRow(!isHighlightRow);
  }, [isHighlightRow]);

  const toggleHighlightColumn = React.useCallback(() => {
    Profile.setProfileValue("highlightColumn");
    return setHighlightColumn(!isHighlightColumn);
  }, [isHighlightColumn]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
      updateCurrentPage,
      isCurrentPage,
      updateLearnedLessons,
      learnedLessons,
      toggleHighlightIdenticalValues,
      isHighlightIdenticalValues,
      toggleHighlightBox,
      isHighlightBox,
      toggleHighlightRow,
      isHighlightRow,
      toggleHighlightColumn,
      isHighlightColumn,
    }),
    [
      toggleTheme,
      isThemeDark,
      updateCurrentPage,
      isCurrentPage,
      updateLearnedLessons,
      learnedLessons,
      toggleHighlightIdenticalValues,
      isHighlightIdenticalValues,
      toggleHighlightBox,
      isHighlightBox,
      toggleHighlightRow,
      isHighlightRow,
      toggleHighlightColumn,
      isHighlightColumn,
    ]
  );

  const Stack = createStackNavigator();

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
