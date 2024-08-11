import React from "react";
import { FlatList } from "react-native-gesture-handler";

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

  return (
    <FlatList
      contentContainerStyle={{ alignSelf: "center" }}
      directionalLockEnabled={true}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      ListHeaderComponent={
        <Text
          testID="ReleaseNotesTitle"
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
      renderItem={({ item }) => ReleaseNote(item, item.version)}
    />
  );
};

export default ReleaseNotesPage;
