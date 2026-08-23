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
  const { theme } = useTheme();
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);
  return (
    <View
      testID={`${props.testID}Row`}
      style={{
        flexDirection: "row",
        // Prevent macOS WebKit from rounding the row's right edge inward.
        marginRight: 0.5,
      }}
    >
      <Text
        testID={`${props.testID}Label`}
        style={{
          fontSize: reSize ? reSize / 20 : 20,
          color: theme.semantic.text.quaternary,
        }}
      >
        {props.statisticName}
      </Text>
      <Text
        style={{
          fontSize: reSize ? reSize / 20 : 20,
          fontWeight: "bold",
          color: theme.semantic.text.primary,
        }}
        testID={props.testID}
      >
        {props.statisticValue}
      </Text>
    </View>
  );
};

export default Statistic;
