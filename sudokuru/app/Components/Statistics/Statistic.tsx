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
  const isLargeScreen = size.width >= 800;
  const fontSize = Math.max(
    16,
    Math.min(reSize / (isLargeScreen ? 19 : 23), isLargeScreen ? 30 : 24),
  );

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
          lineHeight: fontSize * 1.2,
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
          lineHeight: fontSize * 1.2,
          fontWeight: "bold",
          color: theme.semantic.text.primary,
          flexShrink: 1,
          textAlign: "right",
        }}
        testID={props.testID}
      >
        {props.statisticValue}
      </Text>
    </View>
  );
};

export default Statistic;
