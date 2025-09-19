import React from "react";
import { View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { Theme } from "../../Styling/theme";

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

// https://stackoverflow.com/questions/40441877/react-native-bulleted-lists-using-flex-wrap
// https://stackoverflow.com/questions/39110460/react-native-unordered-style-list
/**
 * Takes in a string and creates a bullet component
 * @param point a string for the bullet component
 * @param key a key for the view element
 * @returns A JSX element of a bullet
 */
const BulletComponent = (point: string, key: number, theme: Theme) => {
  return (
    <View
      style={{ flexDirection: "row", paddingLeft: 20, maxWidth: 800 }}
      key={key}
    >
      <Text style={{ fontSize: 14, color: theme.semantic.text.inverse }}>
        •
      </Text>
      <Text
        style={{
          fontSize: 14,
          paddingLeft: 5,
          color: theme.semantic.text.inverse,
        }}
      >
        {point}
      </Text>
    </View>
  );
};

/**
 * Takes in a list of strings and creates a bullet list component
 * @param points A list of strings for the bulleted list component
 * @returns A JSX element of a bullet list component
 */
const BulletedListComponent = (points: string[], theme: Theme) => {
  const list = [];
  for (const [index, point] of points.entries()) {
    list.push(BulletComponent(point, index, theme));
  }
  return list;
};

export const ReleaseNote = (
  props: ReleaseNoteInterface,
  key: string,
  width: number,
  theme: Theme,
) => {
  let featureList = ["None"];
  if (props.features) {
    featureList = props.features;
  }

  const featureListComponent = BulletedListComponent(featureList, theme);

  let previewFeatureList = ["None"];
  if (props["preview features"]) {
    previewFeatureList = props["preview features"];
  }

  const previewFeatureListComponent = BulletedListComponent(
    previewFeatureList,
    theme,
  );

  let bugList = ["None"];
  if (props["bug fixes"]) {
    bugList = props["bug fixes"];
  }

  const bugListComponent = BulletedListComponent(bugList, theme);
  const targetPlatformsString = BulletedListComponent(props.targets, theme);
  const contributorsString = BulletedListComponent(props.contributors, theme);

  return (
    <View
      style={{
        backgroundColor: theme.colors.surfaceAlt,
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        width: width,
        alignSelf: "center",
      }}
      key={key}
      testID={key}
    >
      <Text style={{ fontSize: 20, color: theme.semantic.text.inverse }}>
        Version: {props.version}
      </Text>
      <Text style={{ fontSize: 20, color: theme.semantic.text.inverse }}>
        Release Date: {props.date}
      </Text>
      <Divider style={{ marginBottom: 10 }} />
      <>
        <Text style={{ fontSize: 20, color: theme.semantic.text.inverse }}>
          Summary:{" "}
        </Text>
        <Text
          style={{
            paddingLeft: 20,
            fontSize: 14,
            color: theme.semantic.text.inverse,
          }}
        >
          {props.summary}
        </Text>
        <Text style={{ fontSize: 20, color: theme.semantic.text.inverse }}>
          Features:{" "}
        </Text>
        {featureListComponent}
        <Text style={{ fontSize: 20, color: theme.semantic.text.inverse }}>
          Preview Features:{" "}
        </Text>
        {previewFeatureListComponent}
        <Text style={{ fontSize: 20, color: theme.semantic.text.inverse }}>
          Bug Fixes:{" "}
        </Text>
        {bugListComponent}
        <Text style={{ fontSize: 20, color: theme.semantic.text.inverse }}>
          Target Platforms:{" "}
        </Text>
        {targetPlatformsString}
        <Text style={{ fontSize: 20, color: theme.semantic.text.inverse }}>
          Contributors:{" "}
        </Text>
        {contributorsString}
      </>
    </View>
  );
};
