import React, { useState, useMemo } from "react";
import json from "../../Changelog.json";
import { ReleaseNote } from "../Components/ReleaseNotes/ReleaseNote";
import { parseReleaseNotes } from "../Components/ReleaseNotes/ReleaseNoteValidation";
import type { ReleaseNoteInterface } from "../Components/ReleaseNotes/ReleaseNoteValidation";
import {
  ReleaseNotesFilter,
  Category,
} from "../Components/ReleaseNotes/ReleaseNotesFilter";
import { Text } from "react-native-paper";
import { useWindowDimensions, FlatList } from "react-native";
import { useTheme } from "../Contexts/ThemeContext";
import { useIsFocused } from "@react-navigation/native";
import {
  matchesDateRange,
  matchesKeyword,
  matchesSelection,
  PENDING_CHANGELOG_DATE,
  parseChangelogDate,
  parseMonthYear,
} from "../Components/ReleaseNotes/ReleaseNoteFunctions";

const formatMonthYear = (date: Date): string =>
  date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const RELEASE_NOTES = parseReleaseNotes(json);

const ALL_CONTRIBUTORS = Array.from(
  new Set(RELEASE_NOTES.flatMap((release) => release.contributors)),
);

const ALL_RELEASE_MONTHS = Array.from(
  new Set(
    RELEASE_NOTES.filter((release) => release.date !== PENDING_CHANGELOG_DATE)
      .map((release) => parseChangelogDate(release.date))
      .map((date) => formatMonthYear(date)),
  ),
).sort((a, b) => parseMonthYear(b).getTime() - parseMonthYear(a).getTime());

const matchesCategories = (
  note: ReleaseNoteInterface,
  categories: Set<Category>,
): boolean =>
  categories.size === 0 ||
  [...categories].some((category) => (note[category]?.length ?? 0) > 0);

const getEndDate = (month: Date | null): Date | null =>
  month
    ? new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999)
    : null;

const ReleaseNotesPage = () => {
  const { theme } = useTheme();
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);
  const width = size.width;

  const componentWidth = (w: number) => Math.min(w, 800);

  // Filter state
  const [keyword, setKeyword] = useState("");
  const [selectedStartMonth, setSelectedStartMonth] = useState<string | null>(
    null,
  );
  const [selectedEndMonth, setSelectedEndMonth] = useState<string | null>(null);
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
    setSelectedStartMonth(null);
    setSelectedEndMonth(null);
    setSelectedTargets(new Set());
    setSelectedContributors(new Set());
    setSelectedCategories(new Set());
  };

  const filteredNotes = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase();
    const startDate = selectedStartMonth
      ? parseMonthYear(selectedStartMonth)
      : null;
    const endMonth = selectedEndMonth ? parseMonthYear(selectedEndMonth) : null;
    const endDate = getEndDate(endMonth);

    return RELEASE_NOTES.filter(
      (note) =>
        matchesKeyword(note, lowerKeyword) &&
        matchesSelection(note.targets, selectedTargets) &&
        matchesSelection(note.contributors, selectedContributors) &&
        matchesCategories(note, selectedCategories) &&
        matchesDateRange(note, startDate, endDate),
    );
  }, [
    keyword,
    selectedStartMonth,
    selectedEndMonth,
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
            allReleaseMonths={ALL_RELEASE_MONTHS}
            keyword={keyword}
            setKeyword={setKeyword}
            selectedStartMonth={selectedStartMonth}
            setSelectedStartMonth={setSelectedStartMonth}
            selectedEndMonth={selectedEndMonth}
            setSelectedEndMonth={setSelectedEndMonth}
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
