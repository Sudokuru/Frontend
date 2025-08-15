import "@expo/metro-runtime"; // web fast refresh for development
import "react-native-gesture-handler"; // This needs to be at top to work
import * as React from "react";
import { PreferencesContext } from "./Contexts/PreferencesContext";
import InitializeContext from "./Contexts/InitializeContext";
import DrawerNavigator from "./Navigation/DrawerNavigator";
import { ThemeProvider } from "./Contexts/ThemeContext";
import { registerRootComponent } from "expo";

function App() {
  const { preferences } = InitializeContext();

  return (
    <PreferencesContext.Provider value={preferences}>
      <ThemeProvider>
        <DrawerNavigator />
      </ThemeProvider>
    </PreferencesContext.Provider>
  );
}

export default registerRootComponent(App);
