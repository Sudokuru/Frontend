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
  // https://stackoverflow.com/questions/40441877/react-native-bulleted-lists-using-flex-wrap
  /**
   * Takes in a string and creates a bullet component
   * @param point a string for the bullet component
   * @returns A JSX element of a bullet
   */
  const BulletComponent = (point: string) => {
    // note the reason why the Text elements are wrapped in view components is to
    // keep spacing even. Text components have different spacing based on character length otherwise,
    // leading to variance in the spacing between bullet and first character.
    return (
      <View style={{ flexDirection: "row", paddingLeft: 20, maxWidth: 800 }}>
        <View>
          <Text style={{ width: 10, fontSize: 14 }}>•</Text>
        </View>
        <View style={{ flex: 1, flexWrap: "wrap" }}>
          <Text style={{ fontSize: 14 }}>{point}</Text>
        </View>
      </View>
    );
  };

  /**
   * Takes in a list of strings and creates a bullet list component
   * @param points A list of strings for the bulleted list component
   * @returns A JSX element of a bullet list component
   */
  const BulletedListComponent = (points: string[]) => {
    const list = [];
    for (const point of points) {
      list.push(BulletComponent(point));
    }
    return list;
  };

  let featureList = ["None"];
  if (props.features) {
    featureList = props.features;
  }

  const featureListComponent = BulletedListComponent(featureList);

  let bugList = ["None"];
  if (props["bug fixes"]) {
    bugList = props["bug fixes"];
  }

  const bugListComponent = BulletedListComponent(bugList);
  const targetPlatformsString = BulletedListComponent(props.targets);
  const contributorsString = BulletedListComponent(props.contributors);

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
      <Text style={{ fontSize: 20 }}>Version: {props.version}</Text>
      <Text style={{ fontSize: 20 }}>Release Date: {props.date}</Text>
      <Divider style={{ marginBottom: 10 }} />
      <>
        <Text style={{ fontSize: 20 }}>Summary: </Text>
        <Text style={{ paddingLeft: 20, maxWidth: 800, fontSize: 14 }}>
          {props.summary}
        </Text>
        <Text style={{ fontSize: 20 }}>Features: </Text>
        {featureListComponent}
        <Text style={{ fontSize: 20 }}>Bug Fixes: </Text>
        {bugListComponent}
        <Text style={{ fontSize: 20 }}>Target Platforms: </Text>
        {targetPlatformsString}
        <Text style={{ fontSize: 20 }}>Contributors: </Text>
        {contributorsString}
      </>
    </View>
  );
};
