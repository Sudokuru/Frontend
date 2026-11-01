import React, { useState } from "react";
import { View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Searchbar,
  Text,
} from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";
import { DateFilterPanel } from "./DateFilterPanel";
import { FilterToggleButton } from "./FilterToggleButton";
import { MultiSelectFilterPanel } from "./MultiSelectFilterPanel";
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

type ExpandedFilter =
  | "targets"
  | "categories"
  | "contributors"
  | "start"
  | "end";

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
  // Filters expand inline under the button row instead of opening popup
  // menus; only one section is expanded at a time.
  const [expandedFilter, setExpandedFilter] = useState<ExpandedFilter | null>(
    null,
  );

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

  const toggleExpanded = (filter: ExpandedFilter) =>
    setExpandedFilter((currentlyExpanded) =>
      currentlyExpanded === filter ? null : filter,
    );

  const collapseExpanded = () => setExpandedFilter(null);

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
        <FilterToggleButton
          expanded={expandedFilter === "targets"}
          hasSelection={selectedTargets.size > 0}
          label={
            selectedTargets.size > 0
              ? `Targets (${selectedTargets.size})`
              : "Targets"
          }
          onPress={() => toggleExpanded("targets")}
          testID="ReleaseNotesTargetsFilterButton"
        />
        <FilterToggleButton
          expanded={expandedFilter === "categories"}
          hasSelection={selectedCategories.size > 0}
          label={
            selectedCategories.size > 0
              ? `Categories (${selectedCategories.size})`
              : "Categories"
          }
          onPress={() => toggleExpanded("categories")}
          testID="ReleaseNotesCategoriesFilterButton"
        />
        <FilterToggleButton
          expanded={expandedFilter === "contributors"}
          hasSelection={selectedContributors.size > 0}
          label={
            selectedContributors.size > 0
              ? `Contributors (${selectedContributors.size})`
              : "Contributors"
          }
          onPress={() => toggleExpanded("contributors")}
          testID="ReleaseNotesContributorsFilterButton"
        />
        <FilterToggleButton
          expanded={expandedFilter === "start"}
          hasSelection={selectedStartMonth != null}
          label={
            selectedStartMonth
              ? `Start Date: ${selectedStartMonth}`
              : "Start Date"
          }
          onPress={() => toggleExpanded("start")}
          testID="ReleaseNotesStartDateFilterButton"
        />
        <FilterToggleButton
          expanded={expandedFilter === "end"}
          hasSelection={selectedEndMonth != null}
          label={
            selectedEndMonth ? `End Date: ${selectedEndMonth}` : "End Date"
          }
          onPress={() => toggleExpanded("end")}
          testID="ReleaseNotesEndDateFilterButton"
        />
      </View>

      {expandedFilter === "targets" && (
        <MultiSelectFilterPanel
          label="Targets"
          onChange={setSelectedTargets}
          onCollapse={collapseExpanded}
          optionLabel={(target) => target}
          optionTestIDPrefix="Target"
          options={ALL_TARGETS}
          selected={selectedTargets}
          testIDPrefix="Targets"
        />
      )}
      {expandedFilter === "categories" && (
        <MultiSelectFilterPanel
          label="Categories"
          onChange={setSelectedCategories}
          onCollapse={collapseExpanded}
          optionLabel={(category) => CATEGORY_LABELS[category]}
          optionTestIDPrefix="Category"
          options={ALL_CATEGORIES}
          selected={selectedCategories}
          testIDPrefix="Categories"
        />
      )}
      {expandedFilter === "contributors" && (
        <MultiSelectFilterPanel
          label="Contributors"
          onChange={setSelectedContributors}
          onCollapse={collapseExpanded}
          optionLabel={(contributor) => contributor}
          optionTestIDPrefix="Contributor"
          options={allContributors}
          selected={selectedContributors}
          testIDPrefix="Contributors"
        />
      )}
      {expandedFilter === "start" && (
        <DateFilterPanel
          key={selectedStartMonth ?? "unselected"}
          isMonthDisabled={isStartMonthDisabled}
          label="Start Date"
          monthsForYear={monthsForYear}
          onChange={setSelectedStartMonth}
          onCollapse={collapseExpanded}
          selectedMonth={selectedStartMonth}
          testIDPrefix="Start"
          years={availableYears}
        />
      )}
      {expandedFilter === "end" && (
        <DateFilterPanel
          key={selectedEndMonth ?? "unselected"}
          isMonthDisabled={isEndMonthDisabled}
          label="End Date"
          monthsForYear={monthsForYear}
          onChange={setSelectedEndMonth}
          onCollapse={collapseExpanded}
          selectedMonth={selectedEndMonth}
          testIDPrefix="End"
          years={availableYears}
        />
      )}

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
