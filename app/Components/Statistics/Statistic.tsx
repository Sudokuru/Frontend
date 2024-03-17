import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Text } from "react-native-paper";

export interface StatisticProps {
  statisticName: string;
  statisticValue: string | number;
  testID: string;
}

const Statistic = (props: StatisticProps) => {
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={{ fontSize: reSize ? reSize / 20 : 20, color: "#025E73" }}>
        {props.statisticName}
      </Text>
      <Text
        style={{
          fontSize: reSize ? reSize / 20 : 20,
          fontWeight: "bold",
          color: "#D9A05B",
        }}
        testID={props.testID}
      >
        {props.statisticValue}
      </Text>
    </View>
  );
};

export default Statistic;
