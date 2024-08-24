import React from "react";
import { View } from "react-native";
import { Switch, Text } from "react-native-paper";

const ProfileToggle = (props: {
  name: string;
  fontSize: number;
  value: boolean;
  valueToggle: () => void;
  testIdPrefix: string;
}) => {
  return (
    <View style={{ marginBottom: 10, flexDirection: "row" }}>
      <Text style={{ fontSize: props.fontSize, color: "#025E73" }}>
        {props.name}:{" "}
      </Text>
      <View
        style={{
          justifyContent: "flex-end",
          flexDirection: "row",
          flex: 1,
        }}
      >
        <Switch
          color={"#025E73"}
          value={props.value}
          onValueChange={props.valueToggle}
          testID={
            props.value
              ? props.testIdPrefix + "Enabled"
              : props.testIdPrefix + "Disabled"
          }
          style={{ alignSelf: "center", flexDirection: "column" }}
        />
      </View>
    </View>
  );
};

export default ProfileToggle;
