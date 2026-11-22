import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";

import { Text } from "react-native-paper";
import SudokuBoard from "../Components/SudokuBoard/SudokuBoard";
import DrillTutorialGate from "../Components/Home/DrillTutorialGate";
import { getDrillVariant } from "../Components/SudokuBoard/SudokuBoardSharedFunctionsController";
import { PreferencesContext } from "../Contexts/PreferencesContext";

const Drill = (props: any) => {
  const { featurePreviewSetting, drillModeSetting } =
    React.useContext(PreferencesContext);
  const variant = getDrillVariant(props.route.params?.focus === "true");
  const strategy = props.route.params
    ? props.route.params.params
    : "no props.route.params in DrillPage";

  const action = props.route.params
    ? props.route.params.action
    : "no props.route.action in DrillPage";

  const isFocused = useIsFocused();
  if (!isFocused) return <Text>Error Loading Page</Text>;
  if (!featurePreviewSetting || !drillModeSetting)
    return <Text>Enable Feature Preview and Drill Mode to play drills.</Text>;

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* The game now required the info about it to be rendered, which is given in generateGame() */}
        {action === "StartGame" ? (
          <DrillTutorialGate>
            <SudokuBoard type={variant} action={action} strategy={strategy} />
          </DrillTutorialGate>
        ) : (
          <SudokuBoard type={variant} action={action} strategy={strategy} />
        )}
        <StatusBar style="auto" />
      </View>
    </View>
  );
};

export default Drill;
