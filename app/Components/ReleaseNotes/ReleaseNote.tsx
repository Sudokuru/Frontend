import React from "react";
import { View } from "react-native";
import { Divider, Text } from "react-native-paper";

export interface ReleaseNoteInterface {
  version: string;
  date: string;
  summary: string;
  features?: string[];
  "preview features"?: string[];
  "bug fixes"?: string[];
  targets: string[];
  contributors: string[];
}

export const ReleaseNote = (props: ReleaseNoteInterface, key: number) => {
  // https://stackoverflow.com/questions/40441877/react-native-bulleted-lists-using-flex-wrap
  // https://stackoverflow.com/questions/39110460/react-native-unordered-style-list
  /**
   * Takes in a string and creates a bullet component
   * @param point a string for the bullet component
   * @param key a key for the view element
   * @returns A JSX element of a bullet
   */
  const BulletComponent = (point: string, key: number) => {
    return (
      <View
        style={{ flexDirection: "row", paddingLeft: 20, maxWidth: 800 }}
        key={key}
      >
        <Text style={{ fontSize: 14 }}>•</Text>
        <Text style={{ fontSize: 14, paddingLeft: 5 }}>{point}</Text>
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
      list.push(BulletComponent(point, points.indexOf(point)));
    }
    return list;
  };

  let featureList = ["None"];
  if (props.features) {
    featureList = props.features;
  }

  const featureListComponent = BulletedListComponent(featureList);

  let previewFeatureList = ["None"];
  if (props["preview features"]) {
    previewFeatureList = props["preview features"];
  }

  const previewFeatureListComponent = BulletedListComponent(previewFeatureList);

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
        backgroundColor: "#012D39",
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
        <Text style={{ fontSize: 20 }}>Preview Features: </Text>
        {previewFeatureListComponent}
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
