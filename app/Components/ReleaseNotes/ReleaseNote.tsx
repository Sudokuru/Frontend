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
      itemString = itemString + "\t" + "• " + item + "\n";
    }
    return itemString;
  };

  let featureString = "\tNone\n";
  if (props.features) {
    featureString = createArrayString(props.features);
  }

  let bugFixString = "\tNone\n";
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
        <Text>
          {"\t"}
          {props.summary}
          {"\n"}
        </Text>
        <Text style={{ fontSize: 20 }}>Features: </Text>{" "}
        <Text>{featureString}</Text>
        <Text style={{ fontSize: 20 }}>Bug Fixes: </Text>{" "}
        <Text>{bugFixString}</Text>
        <Text style={{ fontSize: 20 }}>Target Platforms:</Text>{" "}
        <Text>{targetPlatformsString}</Text>
        <Text style={{ fontSize: 20 }}>Contributors:</Text>{" "}
        <Text>{contributorsString}</Text>
      </>
    </View>
  );
};
