import React from "react";
import { View } from "react-native";
import { Switch, Text } from "react-native-paper";
import { PreferencesContext } from "../../Contexts/PreferencesContext";

const PreferencesToggles = () => {
  const {
    toggleTheme,
    darkThemeSetting,
    toggleHighlightIdenticalValues,
    highlightIdenticalValuesSetting,
    highlightBoxSetting,
    toggleHighlightBox,
    toggleHighlightColumn,
    highlightColumnSetting,
    toggleHighlightRow,
    highlightRowSetting,
  } = React.useContext(PreferencesContext);

  return (
    <View>
      <Text>Theme</Text>
      <Switch
        color={"#025E73"}
        value={darkThemeSetting}
        onValueChange={toggleTheme}
        testID={darkThemeSetting ? "DarkThemeEnabled" : "DarkThemeDisabled"}
      />
      <Text>Highlight Peers</Text>
      <Switch
        color={"#025E73"}
        value={highlightIdenticalValuesSetting}
        onValueChange={toggleHighlightIdenticalValues}
        testID={
          highlightIdenticalValuesSetting
            ? "HighlightPeersEnabled"
            : "HighlightPeersDisabled"
        }
      />
      <Text>Highlight Box</Text>
      <Switch
        color={"#025E73"}
        value={highlightBoxSetting}
        onValueChange={toggleHighlightBox}
        testID={
          highlightBoxSetting ? "HighlightBoxEnabled" : "HighlightBoxDisabled"
        }
      />
      <Text>Highlight Row</Text>
      <Switch
        color={"#025E73"}
        value={highlightRowSetting}
        onValueChange={toggleHighlightRow}
        testID={
          highlightRowSetting ? "HighlightRowEnabled" : "HighlightRowDisabled"
        }
      />
      <Text>Highlight Column</Text>
      <Switch
        color={"#025E73"}
        value={highlightColumnSetting}
        onValueChange={toggleHighlightColumn}
        testID={
          highlightColumnSetting
            ? "HighlightColumnEnabled"
            : "HighlightColumnDisabled"
        }
      />
    </View>
  );
};

export default PreferencesToggles;
