import React from "react";
import { View } from "react-native";
import { Switch, Text } from "react-native-paper";

const ProfileToggle = (props: {
  name: string;
  fontSize?: number;
  value: boolean;
  valueToggle: (() => void) | ((mode: boolean) => void);
  testIdPrefix: string;
}) => {
  const { fontSize = 25 } = props;

  return (
    <View
      style={{
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontSize: fontSize, color: "#025E73" }}>
        {props.name}:{" "}
      </Text>
      <Switch
        color={"#025E73"}
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
