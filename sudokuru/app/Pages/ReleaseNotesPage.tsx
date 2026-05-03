import React, { useState, useMemo } from "react";
import json from "../../Changelog.json";
import {
  ReleaseNoteInterface,
  ReleaseNote,
} from "../Components/ReleaseNotes/ReleaseNote";
import {
  ReleaseNotesFilter,
  Category,
} from "../Components/ReleaseNotes/ReleaseNotesFilter";
import { Text } from "react-native-paper";
import { useWindowDimensions, FlatList } from "react-native";
import { useTheme } from "../Contexts/ThemeContext";
import { useIsFocused } from "@react-navigation/native";

/** Parse dates like "March 12th, 2026" → JS Date */
const parseChangelogDate = (dateStr: string): Date => {
  const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
  return new Date(cleaned);
};

const ALL_CONTRIBUTORS = Array.from(
  new Set((json as ReleaseNoteInterface[]).flatMap((r) => r.contributors)),
);

const ReleaseNotesPage = () => {
  const releaseNotes: ReleaseNoteInterface[] = json;
  const { theme } = useTheme();
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);
  const width = size.width;

  const componentWidth = (w: number) => (w > 800 ? 800 : w);

  // Filter state
  const [keyword, setKeyword] = useState("");
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(
    new Set(),
  );
  const [selectedContributors, setSelectedContributors] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(
    new Set(),
  );

  const clearFilters = () => {
    setKeyword("");
    setSelectedTargets(new Set());
    setSelectedContributors(new Set());
    setSelectedCategories(new Set());
  };

  const filteredNotes = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase();
    return releaseNotes.filter((note) => {
      if (lowerKeyword.length > 0) {
        const searchable = [
          note.version,
          note.date,
          note.summary,
          ...note.targets,
          ...note.contributors,
          ...(note.features ?? []),
          ...(note["preview features"] ?? []),
          ...(note["bug fixes"] ?? []),
        ]
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(lowerKeyword)) return false;
      }
      if (
        selectedTargets.size > 0 &&
        !note.targets.some((t) => selectedTargets.has(t))
      )
        return false;

      if (
        selectedContributors.size > 0 &&
        !note.contributors.some((c) => selectedContributors.has(c))
      )
        return false;

      if (selectedCategories.size > 0) {
        const hasCategory = [...selectedCategories].some((cat) => {
          if (cat === "features") return (note.features?.length ?? 0) > 0;
          if (cat === "preview features")
            return (note["preview features"]?.length ?? 0) > 0;
          if (cat === "bug fixes") return (note["bug fixes"]?.length ?? 0) > 0;
          return false;
        });
        if (!hasCategory) return false;
      }

      return true;
    });
  }, [
    releaseNotes,
    keyword,
    selectedTargets,
    selectedContributors,
    selectedCategories,
  ]);

  const isFocused = useIsFocused();
  if (!isFocused) return <Text>Error Loading Page</Text>;

  return (
    <FlatList
      ListHeaderComponent={
        <>
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
          <ReleaseNotesFilter
            allContributors={ALL_CONTRIBUTORS}
            keyword={keyword}
            setKeyword={setKeyword}
            selectedTargets={selectedTargets}
            setSelectedTargets={setSelectedTargets}
            selectedContributors={selectedContributors}
            setSelectedContributors={setSelectedContributors}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            resultCount={filteredNotes.length}
            onClearAll={clearFilters}
            componentWidth={componentWidth(width)}
          />
        </>
      }
      data={filteredNotes}
      keyExtractor={(item) => item.version}
      renderItem={({ item }) => (
        <ReleaseNote item={item} width={componentWidth(width)} />
      )}
    />
  );
};

export default ReleaseNotesPage;
