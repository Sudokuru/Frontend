import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";

import { Text } from "react-native-paper";
import SudokuBoard from "../Components/SudokuBoard/SudokuBoard";

const Drill = (props: any) => {
  const strategy = props.route.params
    ? props.route.params.params
    : "no props.route.params in DrillPage";

  const action = props.route.params
    ? props.route.params.action
    : "no props.route.action in DrillPage";

  const isFocused = useIsFocused();
  if (!isFocused) return <Text>Error Loading Page</Text>;

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
        <SudokuBoard type="drill" action={action} strategy={strategy} />
        <StatusBar style="auto" />
      </View>
    </View>
  );
};

export default Drill;
