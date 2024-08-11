import React from "react";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import json from "../../Changelog.json";
import {
  ReleaseNoteInterface,
  ReleaseNote,
} from "../Components/ReleaseNotes/ReleaseNote";
import { useTheme, Text } from "react-native-paper";
import { useWindowDimensions, View } from "react-native";

const ReleaseNotesPage = () => {
  const releaseNotes: ReleaseNoteInterface[] = json;
  const theme = useTheme();
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const content = [];
  for (const releaseNote of releaseNotes) {
    content.push(ReleaseNote(releaseNote, releaseNotes.indexOf(releaseNote)));
  }

  return (
    <FlatList
      contentContainerStyle={{ alignSelf: "center" }}
      directionalLockEnabled={true}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      ListHeaderComponent={
        <Text
          style={{
            fontSize: reSize / 20,
            color: theme.colors.primary,
            fontWeight: "bold",
            marginBottom: 10,
            alignSelf: "center",
          }}
        >
          Release Notes
        </Text>
      }
      data={releaseNotes}
      renderItem={({ item }) => ReleaseNote(item, releaseNotes.indexOf(item))}
    />
  );
};

export default ReleaseNotesPage;
