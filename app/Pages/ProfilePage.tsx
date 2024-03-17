import React from "react";
import { useWindowDimensions, View, ScrollView } from "react-native";
import { Switch, Text, useTheme } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { PreferencesContext } from "../Contexts/PreferencesContext";
import { formatLessonNameArray } from "../Functions/learnedLessons";

const ProfilePage = () => {
  const theme = useTheme();

  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const {
    learnedLessons,
    toggleTheme,
    isThemeDark,
    toggleHighlightIdenticalValues,
    isHighlightIdenticalValues,
    isHighlightBox,
    toggleHighlightBox,
    toggleHighlightColumn,
    isHighlightColumn,
    toggleHighlightRow,
    isHighlightRow,
  } = React.useContext(PreferencesContext);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 30,
            }}
          >
            <Text
              style={{
                fontSize: reSize / 20,
                color: theme.colors.primary,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Profile
            </Text>
            <View
              style={{ backgroundColor: "#fff", borderRadius: 10, padding: 20 }}
            >
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: reSize / 22, color: "#025E73" }}>
                  Strategies Learned:
                </Text>
                <Text
                  style={{
                    fontSize: reSize / 40,
                    fontWeight: "bold",
                    color: "#D9A05B",
                  }}
                >
                  {formatLessonNameArray(learnedLessons)}
                </Text>
              </View>
              <View style={{ marginBottom: 10, flexDirection: "row" }}>
                <Text style={{ fontSize: reSize / 22, color: "#025E73" }}>
                  Theme:{" "}
                </Text>
                <View
                  style={{
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <Switch
                    color="#025E73"
                    value={isThemeDark}
                    onValueChange={toggleTheme}
                    testID={
                      isThemeDark ? "DarkThemeEnabled" : "DarkThemeDisabled"
                    }
                    style={{ alignSelf: "center", flexDirection: "column" }}
                  />
                </View>
              </View>
              <View style={{ marginBottom: 10, flexDirection: "row" }}>
                <Text style={{ fontSize: reSize / 22, color: "#025E73" }}>
                  Highlight Identical Values:{" "}
                </Text>
                <View
                  style={{
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <Switch
                    color="#025E73"
                    value={isHighlightIdenticalValues}
                    onValueChange={toggleHighlightIdenticalValues}
                    testID={
                      isHighlightIdenticalValues
                        ? "HighlightIdenticalValuesEnabled"
                        : "HighlightIdenticalValuesDisabled"
                    }
                    style={{ alignSelf: "center", flexDirection: "column" }}
                  />
                </View>
              </View>
              <View style={{ marginBottom: 10, flexDirection: "row" }}>
                <Text style={{ fontSize: reSize / 22, color: "#025E73" }}>
                  Highlight Box:{" "}
                </Text>
                <View
                  style={{
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <Switch
                    color="#025E73"
                    value={isHighlightBox}
                    onValueChange={toggleHighlightBox}
                    testID={
                      isHighlightBox
                        ? "HighlightBoxEnabled"
                        : "HighlightBoxDisabled"
                    }
                    style={{ alignSelf: "center", flexDirection: "column" }}
                  />
                </View>
              </View>
              <View style={{ marginBottom: 10, flexDirection: "row" }}>
                <Text style={{ fontSize: reSize / 22, color: "#025E73" }}>
                  Highlight Row:{" "}
                </Text>
                <View
                  style={{
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <Switch
                    color="#025E73"
                    value={isHighlightRow}
                    onValueChange={toggleHighlightRow}
                    testID={
                      isHighlightRow
                        ? "HighlightRowEnabled"
                        : "HighlightRowDisabled"
                    }
                    style={{ alignSelf: "center", flexDirection: "column" }}
                  />
                </View>
              </View>
              <View style={{ marginBottom: 10, flexDirection: "row" }}>
                <Text style={{ fontSize: reSize / 22, color: "#025E73" }}>
                  Highlight Column:{" "}
                </Text>
                <View
                  style={{
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <Switch
                    color="#025E73"
                    value={isHighlightColumn}
                    onValueChange={toggleHighlightColumn}
                    testID={
                      isHighlightColumn
                        ? "HighlightColumnEnabled"
                        : "HighlightColumnDisabled"
                    }
                    style={{ alignSelf: "center", flexDirection: "column" }}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ProfilePage;
