import React from "react";
import { Text, TouchableRipple } from "react-native-paper";
import { View } from "react-native";
import { useTheme } from "../../Contexts/ThemeContext";
import { useStatisticFontSize } from "./useStatisticFontSize";

interface StatisticProps {
  statisticName: string;
  statisticValue: string | number;
  testID: string;
  rowTestID?: string;
  onPress?: () => void;
  disabled?: boolean;
  accessory?: React.ReactNode;
}

const Statistic = (props: StatisticProps) => {
  const { theme } = useTheme();
  const { fontSize, lineHeight } = useStatisticFontSize();
  const rowTestID = props.rowTestID ?? `${props.testID}Row`;

  const rowContent = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "baseline",
        flexWrap: "wrap",
        // Prevent macOS WebKit from rounding the row's right edge inward.
        marginRight: 0.5,
      }}
    >
      <Text
        testID={`${props.testID}Label`}
        style={{
          fontSize,
          lineHeight,
          color: theme.semantic.text.quaternary,
          marginRight: 2,
        }}
      >
        {props.statisticName}
      </Text>
      {props.accessory ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize,
              lineHeight,
              fontWeight: "bold",
              color: theme.semantic.text.primary,
              flexShrink: 1,
            }}
            testID={props.testID}
          >
            {props.statisticValue}
          </Text>
          {props.accessory}
        </View>
      ) : (
        <Text
          style={{
            fontSize,
            lineHeight,
            fontWeight: "bold",
            color: theme.semantic.text.primary,
            flexShrink: 1,
          }}
          testID={props.testID}
        >
          {props.statisticValue}
        </Text>
      )}
    </View>
  );

  if (props.onPress) {
    return (
      <TouchableRipple
        onPress={props.onPress}
        disabled={props.disabled}
        testID={rowTestID}
        style={{ marginBottom: 8 }}
        rippleColor={theme.colors.border}
      >
        {rowContent}
      </TouchableRipple>
    );
  }

  return (
    <View testID={rowTestID} style={{ marginBottom: 8 }}>
      {rowContent}
    </View>
  );
};

export default Statistic;
