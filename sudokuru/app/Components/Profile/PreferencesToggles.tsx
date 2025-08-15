import React from "react";
import { View } from "react-native";
import { Switch, Text } from "react-native-paper";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import { useTheme } from "../../Contexts/ThemeContext";

const PreferencesToggles = () => {
  const {
    toggleHighlightIdenticalValues,
    highlightIdenticalValuesSetting,
    highlightBoxSetting,
    toggleHighlightBox,
    toggleHighlightColumn,
    highlightColumnSetting,
    toggleHighlightRow,
    highlightRowSetting,
  } = React.useContext(PreferencesContext);
  const { theme } = useTheme();

  return (
    <View>
      <Text>Highlight Peers</Text>
      <Switch
        color={theme.colors.accent}
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
        color={theme.colors.accent}
        value={highlightBoxSetting}
        onValueChange={toggleHighlightBox}
        testID={
          highlightBoxSetting ? "HighlightBoxEnabled" : "HighlightBoxDisabled"
        }
      />
      <Text>Highlight Row</Text>
      <Switch
        color={theme.colors.accent}
        value={highlightRowSetting}
        onValueChange={toggleHighlightRow}
        testID={
          highlightRowSetting ? "HighlightRowEnabled" : "HighlightRowDisabled"
        }
      />
      <Text>Highlight Column</Text>
      <Switch
        color={theme.colors.accent}
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
