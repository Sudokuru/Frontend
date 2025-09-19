import "@expo/metro-runtime"; // web fast refresh for development
import "react-native-gesture-handler"; // This needs to be at top to work
import * as React from "react";
import { PreferencesContext } from "./Contexts/PreferencesContext";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import InitializeContext from "./Contexts/InitializeContext";
import DrawerNavigator from "./Navigation/DrawerNavigator";
import { registerRootComponent } from "expo";
import { navigationRef } from "./Navigation/navigationRef";
import { enableScreens } from "react-native-screens";

function App() {
  const { theme, preferences } = InitializeContext();
  enableScreens();

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme} ref={navigationRef}>
          <DrawerNavigator />
        </NavigationContainer>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}

export default registerRootComponent(App);
