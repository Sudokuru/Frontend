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
  const fontSize = Math.max(18, Math.min(reSize / 21, 22));

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 4,
      }}
    >
      <Text
        style={{
          fontSize,
          color: theme.semantic.text.quaternary,
          flex: 1,
          marginRight: 10,
        }}
      >
        {props.statisticName}
      </Text>
      <Text
        style={{
          fontSize,
          fontWeight: "bold",
          color: theme.semantic.text.primary,
          flexShrink: 0,
        }}
        testID={props.testID}
      >
        {props.statisticValue}
      </Text>
    </View>
  );
};

export default Statistic;
