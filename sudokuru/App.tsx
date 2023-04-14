import 'react-native-gesture-handler'; // This needs to be at top to work
import '@expo/metro-runtime'; // web fast refresh for development
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
import { createDrawerNavigator } from '@react-navigation/drawer';
// theme imports
import {CombinedDarkTheme, CombinedDefaultTheme} from './app/Styling/ThemeColors';
import Lesson from "./app/Pages/Lesson";
import DrillPage from './app/Pages/DrillPage';
import CustomDrawerContent from './app/Components/Home/CustomDrawerContent';

const drawerItemsMain = [
  {
    key: 'Naked Sets',
    title: 'Naked Sets',
    routes: [
      {nav: 'Home', routeName: 'Naked Single', title: 'Naked Single'},
      {nav: 'Home', routeName: 'Naked Pair', title: 'Naked Pair'},
      {nav: 'Home', routeName: 'Naked Triplet', title: 'Naked Triplet'},
      {nav: 'Home', routeName: 'Naked Quadruplet', title: 'Naked Quadruplet'},
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
      ],
  },
  {
        key: 'Pointing Sets',
        title: 'Pointing Sets',
        routes: [
            {nav: 'Home', routeName: 'Pointing Pair', title: 'Pointing Pair'},
            {nav: 'Home', routeName: 'Pointing Triplet', title: 'Pointing Triplet'},
        ],
  },
];

function HomeDrawer(){
    const Drawer = createDrawerNavigator();

    return(
     <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => (<CustomDrawerContent
         drawerItems={drawerItemsMain} {...props} />)}
      screenOptions={{headerShown:false, headerTransparent:true, swipeEdgeWidth: 0, drawerPosition: "left", unmountOnBlur:true, title: "Sudokuru"}}>
          <Drawer.Screen name="Main Page" component={HomePage} />
          <Drawer.Screen name="Naked Single" initialParams={{ params: ["NAKED_SINGLE"] }} component={DrillPage} />
          <Drawer.Screen name="Naked Pair" initialParams={{ params: ["NAKED_PAIR"] }} component={DrillPage} />
          <Drawer.Screen name="Naked Triplet" initialParams={{ params: ["NAKED_TRIPLET"] }} component={DrillPage} />
          <Drawer.Screen name="Naked Quadruplet" initialParams={{ params: ["NAKED_QUADRUPLET"] }} component={DrillPage} />
          <Drawer.Screen name="Hidden Single" initialParams={{ params: ["HIDDEN_SINGLE"] }} component={DrillPage} />
          <Drawer.Screen name="Hidden Pair" initialParams={{ params: ["HIDDEN_PAIR"] }} component={DrillPage} />
          <Drawer.Screen name="Hidden Triplet" initialParams={{ params: ["HIDDEN_TRIPLET"] }} component={DrillPage} />
          <Drawer.Screen name="Hidden Quadruplet" initialParams={{ params: ["HIDDEN_QUADRUPLET"] }} component={DrillPage} />
          <Drawer.Screen name="Pointing Pair" initialParams={{ params: ["POINTING_PAIR"] }} component={DrillPage} />
          <Drawer.Screen name="Pointing Triplet" initialParams={{ params: ["POINTING_TRIPLET"] }} component={DrillPage} />
     </Drawer.Navigator>)
}

export default function App() {

    const [isThemeDark, setIsThemeDark] = React.useState(true);
    const [learnedLessons, setLearnedLessons] = React.useState<string[]>([]);
    const [isHighlightSet, setHighlightSet] = React.useState(true);
    const [isHighlightBox, setHighlightBox] = React.useState(true);
    const [isHighlightRow, setHighlightRow] = React.useState(true);
    const [isHighlightColumn, setHighlightColumn] = React.useState(true);

    let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

    const toggleTheme = React.useCallback(() => {
        return setIsThemeDark(!isThemeDark);
    }, [isThemeDark]);

    const updateLearnedLessons = React.useCallback((props: any) => {
        return setLearnedLessons(props);
    }, [learnedLessons]);

    const toggleHighlightSet = React.useCallback(() => {
        return setHighlightSet(!isHighlightSet);
    }, [isHighlightSet]);

    const toggleHighlightBox = React.useCallback(() => {
        return setHighlightBox(!isHighlightBox);
    }, [isHighlightBox]);

    const toggleHighlightRow = React.useCallback(() => {
        return setHighlightRow(!isHighlightRow);
    }, [isHighlightRow]);

    const toggleHighlightColumn = React.useCallback(() => {
        return setHighlightColumn(!isHighlightColumn);
    }, [isHighlightColumn]);


    const preferences = React.useMemo(
        () => ({
            toggleTheme,
            isThemeDark,
            updateLearnedLessons,
            learnedLessons,
            toggleHighlightSet,
            isHighlightSet,
            toggleHighlightBox,
            isHighlightBox,
            toggleHighlightRow,
            isHighlightRow,
            toggleHighlightColumn,
            isHighlightColumn,
        }),
        [toggleTheme, isThemeDark, updateLearnedLessons, learnedLessons, toggleHighlightSet, isHighlightSet,
            toggleHighlightBox, isHighlightBox, toggleHighlightRow, isHighlightRow, toggleHighlightColumn, isHighlightColumn]
    );

    //https://stackoverflow.com/questions/63137014/how-to-set-browser-tab-title-and-add-icon
   // Setting the browser tab icon
   try {
         // Select the <head> tag under <body>
             const headTag = document.querySelector("head");
         // Create the <link/> tag.
             const icon = document.createElement("link");
         // Create the rel="" attribute
             const attributeRel = document.createAttribute("rel");
         // Assign the value "icon" to the rel attribute so that attributeRel becomes rel="icon"
            attributeRel.value = "icon";
        // Create the href="" attribute
            const attributeHref = document.createAttribute("href");
        // Assign your application icon path to the href attribute so that attributeHref becomes href="path/to/my/icon"
            attributeHref.value = "/assets/app/Pages/goldLogoNoText.png";
        // Set the rel attibute to <link> so that the icon JS object becomes <link rel="icon"/>
            icon.setAttributeNode(attributeRel);
        // Set the href attibute to <link> so that the icon JS object becomes <link rel="icon" href="path/to/my/icon"/>
            icon.setAttributeNode(attributeHref);
        // Insert the <link [...] /> tag into the <head>
            if (headTag != null) headTag.appendChild(icon);
      } catch (e) {
        //Browser tabs do not exist on android and iOS, so let's just do nothing here.
   }


    const Stack = createStackNavigator();

  return (
      <PreferencesContext.Provider value={preferences}>
          <PaperProvider theme={theme}>
              <NavigationContainer theme={theme}>
                  <Stack.Navigator initialRouteName="LandingPage"  screenOptions={{
                      headerShown: false, title: "Sudokuru",
                  }}>
                      <Stack.Screen name="Landing" component={LandingPage} />
                      <Stack.Screen name="Home" component={HomeDrawer} />
                      <Stack.Screen name="Profile" component={ProfilePage} />
                      <Stack.Screen name="Statistics" component={StatisticsPage}/>
                      <Stack.Screen name="Sudoku" component={SudokuPage}/>
                      <Stack.Screen name="Lesson" component={Lesson}/>
                  </Stack.Navigator>
              </NavigationContainer>
          </PaperProvider>
      </PreferencesContext.Provider>
  );
}
