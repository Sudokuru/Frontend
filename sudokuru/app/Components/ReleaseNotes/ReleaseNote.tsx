import React from "react";
import { View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";

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

export interface ReleaseNoteProps {
  item: ReleaseNoteInterface;
  width: number;
}

// https://stackoverflow.com/questions/40441877/react-native-bulleted-lists-using-flex-wrap
// https://stackoverflow.com/questions/39110460/react-native-unordered-style-list
/**
 * Takes in a string and creates a bullet component
 * @param point a string for the bullet component
 * @param key a key for the view element
 * @returns A JSX element of a bullet
 */
const BulletComponent = (point: string, key: number, textColor: string) => {
  return (
    <View
      style={{ flexDirection: "row", paddingLeft: 20, maxWidth: 800 }}
      key={key}
    >
      <Text style={{ fontSize: 14, color: textColor }}>•</Text>
      <Text
        style={{
          fontSize: 14,
          paddingLeft: 5,
          color: textColor,
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
const BulletedListComponent = (points: string[], textColor: string) => {
  const list = [];
  for (const [index, point] of points.entries()) {
    list.push(BulletComponent(point, index, textColor));
  }
  return list;
};

export const ReleaseNote = ({ item, width }: ReleaseNoteProps) => {
  const { theme } = useTheme();

  const releaseCardSurfaceColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const releaseCardTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.quaternary;

  let featureList = ["None"];
  if (item.features) {
    featureList = item.features;
  }

  const featureListComponent = BulletedListComponent(
    featureList,
    releaseCardTextColor,
  );

  let previewFeatureList = ["None"];
  if (item["preview features"]) {
    previewFeatureList = item["preview features"];
  }

  const previewFeatureListComponent = BulletedListComponent(
    previewFeatureList,
    releaseCardTextColor,
  );

  let bugList = ["None"];
  if (item["bug fixes"]) {
    bugList = item["bug fixes"];
  }

  const bugListComponent = BulletedListComponent(bugList, releaseCardTextColor);
  const targetPlatformsString = BulletedListComponent(
    item.targets,
    releaseCardTextColor,
  );
  const contributorsString = BulletedListComponent(
    item.contributors,
    releaseCardTextColor,
  );

  return (
    <View
      style={{
        backgroundColor: releaseCardSurfaceColor,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        width: width,
        alignSelf: "center",
      }}
      testID={item.version}
    >
      <Text style={{ fontSize: 20, color: releaseCardTextColor }}>
        Version: {item.version}
      </Text>
      <Text style={{ fontSize: 20, color: releaseCardTextColor }}>
        Release Date: {item.date}
      </Text>
      <Divider style={{ marginBottom: 10 }} />
      <>
        <Text style={{ fontSize: 20, color: releaseCardTextColor }}>
          Summary:{" "}
        </Text>
        <Text
          style={{
            paddingLeft: 20,
            fontSize: 14,
            color: releaseCardTextColor,
          }}
        >
          {item.summary}
        </Text>
        <Text style={{ fontSize: 20, color: releaseCardTextColor }}>
          Features:{" "}
        </Text>
        {featureListComponent}
        <Text style={{ fontSize: 20, color: releaseCardTextColor }}>
          Preview Features:{" "}
        </Text>
        {previewFeatureListComponent}
        <Text style={{ fontSize: 20, color: releaseCardTextColor }}>
          Bug Fixes:{" "}
        </Text>
        {bugListComponent}
        <Text style={{ fontSize: 20, color: releaseCardTextColor }}>
          Target Platforms:{" "}
        </Text>
        {targetPlatformsString}
        <Text style={{ fontSize: 20, color: releaseCardTextColor }}>
          Contributors:{" "}
        </Text>
        {contributorsString}
      </>
    </View>
  );
};
