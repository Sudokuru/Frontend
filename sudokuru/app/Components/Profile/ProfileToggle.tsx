import React from "react";
import { View } from "react-native";
import { Switch, Text } from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";

const ProfileToggle = (props: {
  name: string;
  fontSize?: number;
  value: boolean;
  valueToggle: (() => void) | ((mode: boolean) => void);
  testIdPrefix: string;
}) => {
  const { fontSize = 25 } = props;
  const { theme } = useTheme();

  return (
    <View
      style={{
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{ fontSize: fontSize, color: theme.semantic.text.quaternary }}
      >
        {props.name}:{" "}
      </Text>
      <Switch
        color={theme.semantic.text.primary}
        value={props.value}
        onValueChange={props.valueToggle}
        testID={
          props.value
            ? props.testIdPrefix + "Enabled"
            : props.testIdPrefix + "Disabled"
        }
        style={{ alignSelf: "center" }}
      />
    </View>
  );
};

export default ProfileToggle;
