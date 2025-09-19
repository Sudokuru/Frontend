import React from "react";
import json from "../../Changelog.json";
import {
  ReleaseNoteInterface,
  ReleaseNote,
} from "../Components/ReleaseNotes/ReleaseNote";
import { useTheme, Text } from "react-native-paper";
import { useWindowDimensions, FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/native";

const ReleaseNotesPage = () => {
  const releaseNotes: ReleaseNoteInterface[] = json;
  const theme = useTheme();
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);
  const width = size.width;

  const componentWidth = (width: number) => {
    if (width > 800) {
      return 800;
    } else {
      return width;
    }
  };

  const isFocused = useIsFocused();
  if (!isFocused) return <Text>Error Loading Page</Text>;

  return (
    <FlatList
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
      renderItem={({ item }) =>
        ReleaseNote(item, item.version, componentWidth(width))
      }
    />
  );
};

export default ReleaseNotesPage;
