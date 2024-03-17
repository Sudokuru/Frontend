import "@expo/metro-runtime"; // web fast refresh for development
import "react-native-gesture-handler"; // This needs to be at top to work
import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import * as React from "react";
import { Provider as PaperProvider } from "react-native-paper";

import InitializeContext from "./Contexts/InitializeContext";
import { PreferencesContext } from "./Contexts/PreferencesContext";
import DrawerNavigator from "./Navigation/DrawerNavigator";

function App() {
  const { theme, preferences } = InitializeContext();

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <DrawerNavigator />
        </NavigationContainer>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}

export default registerRootComponent(App);
