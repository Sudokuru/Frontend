import "@expo/metro-runtime"; // web fast refresh for development
import "react-native-gesture-handler"; // This needs to be at top to work
import * as React from "react";
import { Platform } from "react-native";
import { PreferencesContext } from "./Contexts/PreferencesContext";
import InitializeContext from "./Contexts/InitializeContext";
import DrawerNavigator from "./Navigation/DrawerNavigator";
import { registerRootComponent } from "expo";
import { ThemeProvider, useTheme } from "./Contexts/ThemeContext";

function AppContent() {
  const { theme } = useTheme();

  React.useEffect(() => {
    if (Platform.OS === "web") {
      document.body.style.backgroundColor = theme.colors.bg;
    }
  }, [theme.colors.bg]);

  return <DrawerNavigator />;
}

function App() {
  const { preferences } = InitializeContext();

  return (
    <PreferencesContext.Provider value={preferences}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </PreferencesContext.Provider>
  );
}

export default registerRootComponent(App);
