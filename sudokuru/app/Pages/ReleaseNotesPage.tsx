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

const parseChangelogDate = (dateStr: string): Date => {
  const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
  return new Date(cleaned);
};

const formatMonthYear = (date: Date): string =>
  date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const parseMonthYear = (value: string): Date => {
  const separatorIndex = value.lastIndexOf(" ");
  const month = value.slice(0, separatorIndex);
  const monthIndex = MONTH_NAMES.indexOf(month as (typeof MONTH_NAMES)[number]);
  const year = Number(value.slice(separatorIndex + 1));

  if (separatorIndex < 0 || monthIndex < 0 || Number.isNaN(year)) {
    return new Date(Number.NaN);
  }

  return new Date(year, monthIndex, 1);
};

const ALL_CONTRIBUTORS = Array.from(
  new Set((json as ReleaseNoteInterface[]).flatMap((r) => r.contributors)),
);

const ALL_RELEASE_MONTHS = Array.from(
  new Set(
    (json as ReleaseNoteInterface[])
      .map((r) => parseChangelogDate(r.date))
      .filter((d) => !Number.isNaN(d.getTime()))
      .map((d) => formatMonthYear(d)),
  ),
).sort((a, b) => parseMonthYear(b).getTime() - parseMonthYear(a).getTime());

const ReleaseNotesPage = () => {
  const releaseNotes: ReleaseNoteInterface[] = json;
  const { theme } = useTheme();
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);
  const width = size.width;

  const componentWidth = (w: number) => (w > 800 ? 800 : w);

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
    const startMonth = selectedStartMonth
      ? parseMonthYear(selectedStartMonth)
      : null;
    const endMonth = selectedEndMonth ? parseMonthYear(selectedEndMonth) : null;

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

      if (startMonth || endMonth) {
        const releaseDate = parseChangelogDate(note.date);
        if (Number.isNaN(releaseDate.getTime())) return false;

        if (startMonth) {
          const normalizedStart = new Date(startMonth);
          normalizedStart.setHours(0, 0, 0, 0);
          if (releaseDate < normalizedStart) return false;
        }

        if (endMonth) {
          const normalizedEnd = new Date(
            endMonth.getFullYear(),
            endMonth.getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
          );
          if (releaseDate > normalizedEnd) return false;
        }
      }

      return true;
    });
  }, [
    releaseNotes,
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
