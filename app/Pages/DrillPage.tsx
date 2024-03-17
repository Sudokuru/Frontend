import { rgba } from "polished";
import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import Alert from "react-native-awesome-alerts";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import DrillPanel from "../Components/Home/DrillPanel";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";

const DrillPage = () => {
  const theme = useTheme();

  const windowSize = useNewWindowDimensions();
  const reSize = Math.min(windowSize.width, windowSize.height) / 25;

  const [drillHelpVisible, setDrillHelpVisible] = useState(false);
  const showDrillHelp = () => setDrillHelpVisible(true);
  const hideDrillHelp = () => setDrillHelpVisible(false);

  return (
    <ScrollView>
      <SafeAreaView>
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
                  color: theme.colors.primary,
                  fontSize: 50,
                  lineHeight: 50,
                  fontWeight: "bold",
                }}
              >
                Train{" "}
                <Text style={{ color: theme.colors.onBackground }}>
                  with a strategy
                </Text>
              </Text>
              <Pressable
                onPress={() => showDrillHelp()}
                style={{ alignSelf: "flex-start" }}
              >
                <Text
                  style={{
                    color: theme.colors.onBackground,
                    lineHeight: 16,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  ?
                </Text>
              </Pressable>
            </View>
            <View style={{ alignItems: "center", alignSelf: "center" }}>
              <View style={{ padding: reSize / 4 }}>
                <DrillPanel width={windowSize.width} />
              </View>
            </View>
          </View>
        </View>
        <Alert
          show={drillHelpVisible}
          title="Drill Help"
          message={
            `Drills are a place where you can practice a strategy.\n\n` +
            `When you click the "Start Drill" button, a menu will appear on the left side of your screen with a list of all strategies you can practice.\n\n` +
            `Selecting a strategy from the list will navigate you to the Drill page. This page has a puzzle where you must use the strategy to solve the next step in the puzzle.\n\n` +
            `Each drill is unlocked after completing the corresponding lesson!`
          }
          messageStyle={{ maxWidth: 500 }}
          alertContainerStyle={{
            backgroundColor: rgba(theme.colors.background, 0.3),
          }}
          showConfirmButton
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          confirmText="OK"
          confirmButtonColor={theme.colors.primary}
          onConfirmPressed={() => {
            hideDrillHelp();
          }}
          overlayStyle={{ backgroundColor: "transparent" }}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default DrillPage;
