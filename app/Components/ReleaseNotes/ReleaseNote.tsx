import React from "react";
import { View } from "react-native";
import { Divider, Text } from "react-native-paper";

export interface ReleaseNoteInterface {
  version: string;
  date: string;
  summary: string;
  features?: string[];
  "bug fixes"?: string[];
  targets: string[];
  contributors: string[];
}

export const ReleaseNote = (props: ReleaseNoteInterface, key: number) => {
  const createArrayString = (items: string[]) => {
    let itemString = "";
    for (const item of items) {
      itemString = itemString + "• " + item + "\n";
    }
    return itemString;
  };

  let featureString = "None\n";
  if (props.features) {
    featureString = createArrayString(props.features);
  }

  let bugFixString = "None\n";
  if (props["bug fixes"]) {
    bugFixString = createArrayString(props["bug fixes"]);
  }

  const targetPlatformsString = createArrayString(props.targets);
  const contributorsString = createArrayString(props.contributors);

  return (
    <View
      style={{
        backgroundColor: "#000000",
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        alignItems: "stretch",
      }}
      key={key}
    >
      <Text style={{ fontSize: 20 }}>
        Version: {props.version}
        {"\n"}
      </Text>
      <Text style={{ fontSize: 20 }}>
        Release Date: {props.date}
        {"\n"}
      </Text>
      <Divider style={{ marginBottom: 10 }} />
      <>
        <Text style={{ fontSize: 20 }}>Summary: </Text>{" "}
        <Text style={{ paddingLeft: 20, maxWidth: 800 }}>
          {props.summary}
          {"\n"}
        </Text>
        <Text style={{ fontSize: 20 }}>Features: </Text>{" "}
        <Text style={{ paddingLeft: 20, maxWidth: 800 }}>{featureString}</Text>
        <Text style={{ fontSize: 20 }}>Bug Fixes: </Text>{" "}
        <Text style={{ paddingLeft: 20, maxWidth: 800 }}>{bugFixString}</Text>
        <Text style={{ fontSize: 20 }}>Target Platforms:</Text>{" "}
        <Text style={{ paddingLeft: 20 }}>{targetPlatformsString}</Text>
        <Text style={{ fontSize: 20 }}>Contributors:</Text>{" "}
        <Text style={{ paddingLeft: 20 }}>{contributorsString}</Text>
      </>
    </View>
  );
};
