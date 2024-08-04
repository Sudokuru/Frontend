import React from "react";
import { ScrollView } from "react-native-gesture-handler";

import json from "../../Changelog.json";
import {
  ReleaseNoteInterface,
  ReleaseNote,
} from "../Components/ReleaseNotes/ReleaseNote";
import { useTheme, Text } from "react-native-paper";
import { useWindowDimensions } from "react-native";

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
    <ScrollView contentContainerStyle={{ alignSelf: "center" }}>
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
      {content}
    </ScrollView>
  );
};

export default ReleaseNotesPage;
