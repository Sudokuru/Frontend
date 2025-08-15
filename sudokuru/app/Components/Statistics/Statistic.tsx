import React from "react";
import { Text } from "react-native-paper";
import { View, useWindowDimensions } from "react-native";
import { useTheme } from "../../Contexts/ThemeContext";

interface StatisticProps {
  statisticName: string;
  statisticValue: string | number;
  testID: string;
}

const Statistic = (props: StatisticProps) => {
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: "row" }}>
      <Text
        style={{
          fontSize: reSize ? reSize / 20 : 20,
          color: theme.colors.text,
        }}
      >
        {props.statisticName}
      </Text>
      <Text
        style={{
          fontSize: reSize ? reSize / 20 : 20,
          fontWeight: "bold",
          color: theme.colors.accent,
        }}
        testID={props.testID}
      >
        {props.statisticValue}
      </Text>
    </View>
  );
};

export default Statistic;
