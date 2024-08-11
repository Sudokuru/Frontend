import React from "react";
// import { FlatList } from "react-native-gesture-handler";

import json from "../../Changelog.json";
import {
  ReleaseNoteInterface,
  ReleaseNote,
} from "../Components/ReleaseNotes/ReleaseNote";
import { useTheme, Text } from "react-native-paper";
import { useWindowDimensions, FlatList, Platform } from "react-native";

const ReleaseNotesPage = () => {
  const releaseNotes: ReleaseNoteInterface[] = json;
  const theme = useTheme();
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  // react-native-web has weird behavior for scroll bar disabling
  // https://github.com/necolas/react-native-web/blob/54c14d64dabd175e8055e1dc92e9196c821f9b7d/packages/react-native-web/src/exports/ScrollView/ScrollViewBase.js#L149-L151
  const horizontalScrollIndicator = () => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      return false;
    } else {
      return true;
    }
  };

  return (
    <FlatList
      contentContainerStyle={{ alignSelf: "center" }}
      directionalLockEnabled={true}
      horizontal={false}
      showsHorizontalScrollIndicator={horizontalScrollIndicator()}
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
