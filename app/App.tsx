import "react-native-gesture-handler"; // This needs to be at top to work
import "@expo/metro-runtime"; // web fast refresh for development
import * as React from "react";
import { PreferencesContext } from "./Contexts/PreferencesContext";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import InitializeContext from "./Contexts/InitializeContext";
import DrawerNavigator from "./Navigation/DrawerNavigator";
import { registerRootComponent } from "expo";

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
