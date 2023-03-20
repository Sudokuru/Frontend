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
import HomePage from "./app/Pages/HomePage";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerItem, DrawerItemList, DrawerContentScrollView,  DrawerContentComponentProps} from '@react-navigation/drawer';
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
import DrillPage from './app/Pages/DrillPage';
import CustomDrawerContent from './app/Pages/CustomDrawerContent';

const drawerItemsMain = [
  {
    key: 'Naked Sets',
    title: 'Naked Sets',
    routes: [
      {nav: 'Home', routeName: 'Naked Single', title: 'Naked Single'},
      {nav: 'Home', routeName: 'Naked Pair', title: 'Naked Pair'},
      {nav: 'Home', routeName: 'Naked Triplet', title: 'Naked Triplet'},
      {nav: 'Home', routeName: 'Naked Quadruplet', title: 'Naked Quadruplet'},
      {nav: 'Home', routeName: 'Naked Quintuplet', title: 'Naked Quintuplet'},
      {nav: 'Home', routeName: 'Naked Sextuplet', title: 'Naked Sextuplet'},
      {nav: 'Home', routeName: 'Naked Septuplet', title: 'Naked Septuplet'},
      {nav: 'Home', routeName: 'Naked Octuplet', title: 'Naked Octuplet'},
    ],
  },
  {
      key: 'Hidden Sets',
      title: 'Hidden Sets',
      routes: [
        {nav: 'Home', routeName: 'Hidden Single', title: 'Hidden Single'},
        {nav: 'Home', routeName: 'Hidden Pair', title: 'Hidden Pair'},
        {nav: 'Home', routeName: 'Hidden Triplet', title: 'Hidden Triplet'},
        {nav: 'Home', routeName: 'Hidden Quadruplet', title: 'Hidden Quadruplet'},
        {nav: 'Home', routeName: 'Hidden Quintuplet', title: 'Hidden Quintuplet'},
        {nav: 'Home', routeName: 'Hidden Sextuplet', title: 'Hidden Sextuplet'},
        {nav: 'Home', routeName: 'Hidden Septuplet', title: 'Hidden Septuplet'},
        {nav: 'Home', routeName: 'Hidden Octuplet', title: 'Hidden Octuplet'},

      ],
  },
  {
      key: 'Box Line Reduction',
      title: 'Box Line Reduction',
      routes: [{nav: 'Home', routeName: 'Box Line Reduction', title: 'Box Line Reduction'}],
  },
  {
      key: 'Swordfish',
      title: 'Swordfish',
      routes: [{nav: 'Home', routeName: 'Swordfish', title: 'Swordfish'}],
  },
  {
      key: 'X-Wing Strategy',
      title: 'X-Wing Strategy',
      routes: [{nav: 'Home', routeName: 'X-Wing Strategy', title: 'X-Wing Strategy'}],
  },
  {
      key: 'Singles Chaining',
      title: 'Singles Chaining',
      routes: [{nav: 'Home', routeName: 'Singles Chaining', title: 'Singles Chaining'}],
  },
];

function HomeDrawer(){
    const Drawer = createDrawerNavigator();

    return(
     <Drawer.Navigator initialRouteName="Main Page" initialRouteName="Home" drawerContent={(props) => (<CustomDrawerContent drawerItems={drawerItemsMain} {...props} />)}
      screenOptions={{headerShown:false, headerTransparent:true, swipeEdgeWidth: 0, drawerPosition: "left", }}>
                              <Drawer.Screen name="Main Page" component={HomePage} />
                              <Drawer.Screen name="Naked Single" initialParams={{ params: ["NAKED_SINGLE"] }} component={DrillPage} />
                              <Drawer.Screen name="Naked Pair" initialParams={{ params: ["NAKED_PAIR"] }} component={DrillPage} />
                              <Drawer.Screen name="Naked Triplet" initialParams={{ params: ["NAKED_TRIPLET"] }} component={DrillPage} />
                              <Drawer.Screen name="Naked Quadruplet" initialParams={{ params: ["NAKED_QUADRUPLET"] }} component={DrillPage} />
                              <Drawer.Screen name="Naked Quintuplet" initialParams={{ params: ["NAKED_QUINTUPLET"] }} component={DrillPage} />
                              <Drawer.Screen name="Naked Sextuplet" initialParams={{ params: ["NAKED_SEXTUPLET"] }} component={DrillPage} />
                              <Drawer.Screen name="Naked Septuplet" initialParams={{ params: ["NAKED_SEPTUPLET"] }} component={DrillPage} />
                              <Drawer.Screen name="Naked Octuplet" initialParams={{ params: ["NAKED_OCTUPLET"] }} component={DrillPage} />
                              <Drawer.Screen name="Hidden Single" initialParams={{ params: ["HIDDEN_SINGLE"] }} component={DrillPage} />
                              <Drawer.Screen name="Hidden Pair" initialParams={{ params: ["HIDDEN_PAIR"] }} component={DrillPage} />
                              <Drawer.Screen name="Hidden Triplet" initialParams={{ params: ["HIDDEN_TRIPLET"] }} component={DrillPage} />
                              <Drawer.Screen name="Hidden Quadruplet" initialParams={{ params: ["HIDDEN_QUADRUPLET"] }} component={DrillPage} />
                              <Drawer.Screen name="Hidden Quintuplet" initialParams={{ params: ["HIDDEN_QUINTUPLET"] }} component={DrillPage} />
                              <Drawer.Screen name="Hidden Sextuplet" initialParams={{ params: ["HIDDEN_SEXTUPLET"] }} component={DrillPage} />
                              <Drawer.Screen name="Hidden Septuplet" initialParams={{ params: ["HIDDEN_SEPTUPLET"] }} component={DrillPage} />
                              <Drawer.Screen name="Hidden Octuplet" initialParams={{ params: ["HIDDEN_OCTUPLET"] }} component={DrillPage} />
                              <Drawer.Screen name="Pointing Pairs" initialParams={{ params: ["POINTING_PAIR"] }} component={DrillPage} />
                              <Drawer.Screen name="Box Line Reduction" initialParams={{ params: ["BOX_LINE_REDUCTION"] }} component={DrillPage} />
                              <Drawer.Screen name="Swordfish" initialParams={{ params: ["SWORDFISH"] }} component={DrillPage} />
                              <Drawer.Screen name="X-Wing Strategy" initialParams={{ params: ["X_WING"] }} component={DrillPage} />
                              <Drawer.Screen name="Singles Chaining" initialParams={{ params: ["SINGLES_CHAINING"] }} component={DrillPage} />
     </Drawer.Navigator>)
}

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
                      <Stack.Screen name="Home" component={HomeDrawer} />
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
