import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import DrillPanel from "../Components/Home/DrillPanel";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";
import { useTheme } from "../Contexts/ThemeContext";
import { PreferencesContext } from "../Contexts/PreferencesContext";

const DrillPage = ({ route }: any) => {
  const focus = route.params?.focus === "true";
  const { featurePreviewSetting, drillModeSetting } =
    React.useContext(PreferencesContext);
  const { theme } = useTheme();

  const windowSize = useNewWindowDimensions();
  const reSize = Math.min(windowSize.width, windowSize.height) / 25;

  const isFocused = useIsFocused();
  if (!isFocused) return <Text>Error Loading Page</Text>;
  if (!featurePreviewSetting || !drillModeSetting)
    return <Text>Enable Feature Preview and Drill Mode to play drills.</Text>;

  return (
    <ScrollView style={{ width: windowSize.width, height: windowSize.height }}>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: theme.semantic.text.primary,
                fontSize: 50,
                lineHeight: 50,
                fontWeight: "bold",
              }}
            >
              Drill{" "}
              <Text
                style={{
                  color: theme.useDarkTheme
                    ? theme.semantic.text.inverse
                    : theme.semantic.text.info,
                }}
              >
                Sudoku
              </Text>
            </Text>
          </View>
          <View style={{ alignItems: "center", alignSelf: "center" }}>
            <Text
              testID="drillPageVariant"
              accessibilityRole="header"
              style={{
                color: theme.semantic.text.tertiary,
                fontSize: 24,
                fontWeight: "800",
                marginTop: 8,
              }}
            >
              {focus ? "Focus Mode Drill" : "Classic Drill"}
            </Text>
            <View style={{ padding: reSize / 4 }}>
              <DrillPanel
                key={String(focus)}
                focus={focus}
                width={windowSize.width}
                height={windowSize.height}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DrillPage;
