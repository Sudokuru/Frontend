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
import { DateFilterMenu, MONTH_NAMES } from "./DateFilterMenu";
import { MultiSelectFilterMenu } from "./MultiSelectFilterMenu";

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

  const releaseMonthYearPairs = allReleaseMonths
    .map((value) => {
      const separatorIndex = value.lastIndexOf(" ");
      return {
        month: value.slice(0, separatorIndex),
        year: Number(value.slice(separatorIndex + 1)),
      };
    })
    .filter(
      ({ month, year }) =>
        !Number.isNaN(year) &&
        MONTH_NAMES.includes(month as (typeof MONTH_NAMES)[number]),
    );

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
    ).sort(
      (a, b) =>
        MONTH_NAMES.indexOf(a as (typeof MONTH_NAMES)[number]) -
        MONTH_NAMES.indexOf(b as (typeof MONTH_NAMES)[number]),
    );

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
      <Searchbar
        testID="ReleaseNotesSearch"
        placeholder="Search release notes…"
        value={keyword}
        onChangeText={setKeyword}
        right={({ color, style }) =>
          keyword.length > 0 ? (
            <IconButton
              testID="ReleaseNotesSearchClearButton"
              accessibilityLabel="Clear search"
              icon="close"
              iconColor={color}
              onPress={() => setKeyword("")}
              style={style}
            />
          ) : null
        }
        style={{ marginBottom: 8 }}
        inputStyle={{
          color: theme.useDarkTheme
            ? theme.semantic.text.inverse
            : theme.semantic.text.info,
        }}
        placeholderTextColor={theme.colors.onSurface}
      />

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
          label="Start Date"
          monthsForYear={monthsForYear}
          onChange={setSelectedStartMonth}
          selectedMonth={selectedStartMonth}
          testIDPrefix="Start"
          years={availableYears}
        />
        <DateFilterMenu
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
