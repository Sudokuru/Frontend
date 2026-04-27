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
const BulletComponent = (point: string, key: number, textColor: string) => {
  return (
    <View
      style={{ flexDirection: "row", paddingLeft: 20, maxWidth: 800 }}
      key={key}
    >
      <Text style={{ fontSize: 14, color: textColor }}>•</Text>
      <Text style={{ fontSize: 14, paddingLeft: 5, color: textColor }}>
        {point}
      </Text>
    </View>
  );
};

const BulletedListComponent = (points: string[], textColor: string) => {
  const list = [];
  for (const [index, point] of points.entries()) {
    list.push(BulletComponent(point, index, textColor));
  }
  return list;
};

export const ReleaseNote = ({ item, width }: ReleaseNoteProps) => {
  const { theme } = useTheme();
  const textColor = theme.semantic.text.inverse;

  const featureList = item.features ?? ["None"];
  const previewFeatureList = item["preview features"] ?? ["None"];
  const bugList = item["bug fixes"] ?? ["None"];

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
      testID={item.version}
    >
      <Text style={{ fontSize: 20, color: textColor }}>
        Version: {item.version}
      </Text>
      <Text style={{ fontSize: 20, color: textColor }}>
        Release Date: {item.date}
      </Text>
      <Divider style={{ marginBottom: 10 }} />
      <>
        <Text style={{ fontSize: 20, color: textColor }}>Summary: </Text>
        <Text style={{ paddingLeft: 20, fontSize: 14, color: textColor }}>
          {item.summary}
        </Text>
        <Text style={{ fontSize: 20, color: textColor }}>Features: </Text>
        {BulletedListComponent(featureList, textColor)}
        <Text style={{ fontSize: 20, color: textColor }}>
          Preview Features:{" "}
        </Text>
        {BulletedListComponent(previewFeatureList, textColor)}
        <Text style={{ fontSize: 20, color: textColor }}>Bug Fixes: </Text>
        {BulletedListComponent(bugList, textColor)}
        <Text style={{ fontSize: 20, color: textColor }}>
          Target Platforms:{" "}
        </Text>
        {BulletedListComponent(item.targets, textColor)}
        <Text style={{ fontSize: 20, color: textColor }}>Contributors: </Text>
        {BulletedListComponent(item.contributors, textColor)}
      </>
    </View>
  );
};
