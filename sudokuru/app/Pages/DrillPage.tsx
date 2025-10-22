/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import DrillPanel from "../Components/Home/DrillPanel";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";
import { useTheme } from "../Contexts/ThemeContext";

const DrillPage = () => {
  const navigation: any = useNavigation();

  const { theme } = useTheme();

  const windowSize = useNewWindowDimensions();
  const reSize = Math.min(windowSize.width, windowSize.height) / 25;

  const isFocused = useIsFocused();
  if (!isFocused) return <Text>Error Loading Page</Text>;

  return (
    <ScrollView>
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
              Train{" "}
              <Text
                style={{
                  color: theme.useDarkTheme
                    ? theme.semantic.text.inverse
                    : theme.semantic.text.info,
                }}
              >
                with a strategy
              </Text>
            </Text>
          </View>
          <View style={{ alignItems: "center", alignSelf: "center" }}>
            <View style={{ padding: reSize / 4 }}>
              <DrillPanel width={windowSize.width} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DrillPage;
