import React from "react";
import { View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Searchbar,
  Text,
} from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";
import { DateFilterMenu } from "./DateFilterMenu";
import { MultiSelectFilterMenu } from "./MultiSelectFilterMenu";
import { MONTH_NAMES, parseMonthYear } from "./ReleaseNoteFunctions";

export type Category = "features" | "preview features" | "bug fixes";

export const ALL_TARGETS = ["web", "mobile", "desktop"] as const;
export const ALL_CATEGORIES: Category[] = [
  "features",
  "preview features",
  "bug fixes",
];

export interface ReleaseNotesFilterProps {
  allContributors: string[];
  allReleaseMonths: string[];
  keyword: string;
  setKeyword: (value: string) => void;
  selectedStartMonth: string | null;
  setSelectedStartMonth: (value: string | null) => void;
  selectedEndMonth: string | null;
  setSelectedEndMonth: (value: string | null) => void;
  selectedTargets: Set<string>;
  setSelectedTargets: (value: Set<string>) => void;
  selectedContributors: Set<string>;
  setSelectedContributors: (value: Set<string>) => void;
  selectedCategories: Set<Category>;
  setSelectedCategories: (value: Set<Category>) => void;
  resultCount: number;
  onClearAll: () => void;
  componentWidth: number;
}

const CATEGORY_LABELS: Record<Category, string> = {
  features: "Features",
  "preview features": "Preview Features",
  "bug fixes": "Bug Fixes",
};

const hideSearchbarRight = () => null;

export const ReleaseNotesFilter = ({
  allContributors,
  allReleaseMonths,
  keyword,
  setKeyword,
  selectedStartMonth,
  setSelectedStartMonth,
  selectedEndMonth,
  setSelectedEndMonth,
  selectedTargets,
  setSelectedTargets,
  selectedContributors,
  setSelectedContributors,
  selectedCategories,
  setSelectedCategories,
  resultCount,
  onClearAll,
  componentWidth,
}: ReleaseNotesFilterProps) => {
  const { theme } = useTheme();
  const hasActiveFilters =
    keyword.trim().length > 0 ||
    selectedStartMonth != null ||
    selectedEndMonth != null ||
    selectedTargets.size > 0 ||
    selectedContributors.size > 0 ||
    selectedCategories.size > 0;

  const releaseMonthYearPairs = allReleaseMonths.map((value) => {
    const date = parseMonthYear(value);
    return {
      month: MONTH_NAMES[date.getMonth()],
      year: date.getFullYear(),
    };
  });

  const availableYears = Array.from(
    new Set(releaseMonthYearPairs.map(({ year }) => year)),
  ).sort((a, b) => b - a);

  const monthsForYear = (year: number) =>
    Array.from(
      new Set(
        releaseMonthYearPairs
          .filter((pair) => pair.year === year)
          .map(({ month }) => month),
      ),
    ).sort((a, b) => MONTH_NAMES.indexOf(a) - MONTH_NAMES.indexOf(b));

  const isEndMonthDisabled = (
    year: number,
    month: (typeof MONTH_NAMES)[number],
  ) =>
    selectedStartMonth != null &&
    parseMonthYear(`${month} ${year}`) < parseMonthYear(selectedStartMonth);

  const isStartMonthDisabled = (
    year: number,
    month: (typeof MONTH_NAMES)[number],
  ) =>
    selectedEndMonth != null &&
    parseMonthYear(`${month} ${year}`) > parseMonthYear(selectedEndMonth);

  const selectionMenuMaxWidth = Math.max(
    200,
    Math.min(280, componentWidth - 120),
  );

  return (
    <View
      style={{
        width: componentWidth,
        alignSelf: "center",
        paddingHorizontal: 10,
        marginBottom: 10,
      }}
    >
      <View style={{ marginBottom: 8 }}>
        <Searchbar
          testID="ReleaseNotesSearch"
          placeholder="Search release notes…"
          value={keyword}
          onChangeText={setKeyword}
          right={hideSearchbarRight}
          inputStyle={{
            color: theme.useDarkTheme
              ? theme.semantic.text.inverse
              : theme.semantic.text.info,
          }}
          placeholderTextColor={theme.colors.onSurface}
        />
        {keyword.length > 0 && (
          <IconButton
            testID="ReleaseNotesSearchClearButton"
            accessibilityLabel="Clear search"
            icon="close"
            iconColor={theme.colors.primary}
            onPress={() => setKeyword("")}
            style={{ position: "absolute", right: 4, top: 4, margin: 0 }}
          />
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 6,
          paddingVertical: 2,
        }}
      >
        <MultiSelectFilterMenu
          label="Targets"
          maxWidth={Math.min(260, selectionMenuMaxWidth)}
          onChange={setSelectedTargets}
          optionLabel={(target) => target}
          optionTestIDPrefix="Target"
          options={ALL_TARGETS}
          selected={selectedTargets}
          testIDPrefix="Targets"
        />
        <MultiSelectFilterMenu
          label="Categories"
          maxWidth={selectionMenuMaxWidth}
          onChange={setSelectedCategories}
          optionLabel={(category) => CATEGORY_LABELS[category]}
          optionTestIDPrefix="Category"
          options={ALL_CATEGORIES}
          selected={selectedCategories}
          testIDPrefix="Categories"
        />
        <MultiSelectFilterMenu
          label="Contributors"
          maxWidth={selectionMenuMaxWidth}
          onChange={setSelectedContributors}
          optionLabel={(contributor) => contributor}
          optionTestIDPrefix="Contributor"
          options={allContributors}
          selected={selectedContributors}
          testIDPrefix="Contributors"
        />
        <DateFilterMenu
          isMonthDisabled={isStartMonthDisabled}
          label="Start Date"
          monthsForYear={monthsForYear}
          onChange={setSelectedStartMonth}
          selectedMonth={selectedStartMonth}
          testIDPrefix="Start"
          years={availableYears}
        />
        <DateFilterMenu
          isMonthDisabled={isEndMonthDisabled}
          label="End Date"
          monthsForYear={monthsForYear}
          onChange={setSelectedEndMonth}
          selectedMonth={selectedEndMonth}
          testIDPrefix="End"
          years={availableYears}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-end",
        }}
      >
        {hasActiveFilters && (
          <Button
            testID="ReleaseNotesClearFiltersButton"
            mode="text"
            compact
            onPress={onClearAll}
            textColor={theme.colors.primary}
          >
            Clear
          </Button>
        )}
        <Text
          testID="ReleaseNotesResultCount"
          style={{
            color: theme.colors.primary,
            fontSize: 14,
            lineHeight: 20,
            marginRight: 2,
          }}
        >
          {resultCount} releases
        </Text>
      </View>

      <Divider style={{ marginTop: 8 }} />
    </View>
  );
};
