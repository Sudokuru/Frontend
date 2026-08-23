import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import {
  Searchbar,
  Button,
  IconButton,
  Menu,
  Chip,
  Divider,
  Text,
} from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";

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
  setKeyword: (v: string) => void;
  selectedStartMonth: string | null;
  setSelectedStartMonth: (v: string | null) => void;
  selectedEndMonth: string | null;
  setSelectedEndMonth: (v: string | null) => void;
  selectedTargets: Set<string>;
  setSelectedTargets: (v: Set<string>) => void;
  selectedContributors: Set<string>;
  setSelectedContributors: (v: Set<string>) => void;
  selectedCategories: Set<Category>;
  setSelectedCategories: (v: Set<Category>) => void;
  resultCount: number;
  onClearAll: () => void;
  componentWidth: number;
}

function toggleItem<T extends string>(set: Set<T>, item: T): Set<T> {
  const next = new Set(set);
  if (next.has(item)) {
    next.delete(item);
  } else {
    next.add(item);
  }
  return next;
}

const CATEGORY_LABELS: Record<Category, string> = {
  features: "Features",
  "preview features": "Preview Features",
  "bug fixes": "Bug Fixes",
};

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

type OpenMenu = "targets" | "categories" | "contributors" | null;
type DateMenuType = "startDate" | "endDate" | null;

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
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [openDateMenu, setOpenDateMenu] = useState<DateMenuType>(null);
  const [startDraftYear, setStartDraftYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [startDraftMonth, setStartDraftMonth] = useState<string>(
    MONTH_NAMES[0],
  );
  const [endDraftYear, setEndDraftYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [endDraftMonth, setEndDraftMonth] = useState<string>(MONTH_NAMES[0]);
  const [startYearMenuOpen, setStartYearMenuOpen] = useState(false);
  const [startMonthMenuOpen, setStartMonthMenuOpen] = useState(false);
  const [endYearMenuOpen, setEndYearMenuOpen] = useState(false);
  const [endMonthMenuOpen, setEndMonthMenuOpen] = useState(false);

  const hasActiveFilters =
    keyword.trim().length > 0 ||
    selectedStartMonth != null ||
    selectedEndMonth != null ||
    selectedTargets.size > 0 ||
    selectedContributors.size > 0 ||
    selectedCategories.size > 0;

  const filterButtonLabel = (label: string, count: number) =>
    count > 0 ? `${label} (${count})` : label;

  const filterButtonProps = (selected: boolean) => ({
    mode: selected ? ("contained" as const) : ("outlined" as const),
    buttonColor: selected ? theme.colors.primary : undefined,
    textColor: selected ? theme.semantic.text.inverse : theme.colors.primary,
  });

  const filterButtonContainerStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  };

  const menuContentStyle = {
    backgroundColor: theme.useDarkTheme
      ? theme.colors.surfaceAlt
      : theme.colors.surface,
  };

  const selectionMenuMaxWidth = Math.max(
    200,
    Math.min(280, componentWidth - 120),
  );

  const dateSelectorButtonProps = {
    mode: "outlined" as const,
    buttonColor: theme.colors.surfaceAlt,
    textColor: theme.semantic.text.inverse,
    style: {
      alignSelf: "flex-start" as const,
      marginBottom: 8,
    },
  };

  const chipProps = (selected: boolean) => ({
    mode: selected ? ("flat" as const) : ("outlined" as const),
    selectedColor: theme.semantic.text.inverse,
    style: {
      backgroundColor: selected
        ? theme.colors.primary
        : theme.colors.surfaceAlt,
      borderColor: theme.colors.border,
    },
    textStyle: { color: theme.semantic.text.inverse },
  });

  const releaseMonthYearPairs = allReleaseMonths
    .map((value) => {
      const parts = value.split(" ");
      const year = Number(parts[parts.length - 1]);
      const month = parts.slice(0, -1).join(" ");
      return { month, year };
    })
    .filter(
      (pair) =>
        !Number.isNaN(pair.year) &&
        MONTH_NAMES.includes(pair.month as (typeof MONTH_NAMES)[number]),
    );

  const availableYears = Array.from(
    new Set(releaseMonthYearPairs.map((pair) => pair.year)),
  ).sort((a, b) => b - a);

  const monthsForYear = (year: number) =>
    Array.from(
      new Set(
        releaseMonthYearPairs
          .filter((pair) => pair.year === year)
          .map((pair) => pair.month),
      ),
    ).sort(
      (a, b) =>
        MONTH_NAMES.indexOf(a as (typeof MONTH_NAMES)[number]) -
        MONTH_NAMES.indexOf(b as (typeof MONTH_NAMES)[number]),
    );

  const parseSelectedMonthYear = (value: string | null) => {
    if (!value) return null;
    const parts = value.split(" ");
    const year = Number(parts[parts.length - 1]);
    const month = parts.slice(0, -1).join(" ");
    if (Number.isNaN(year)) return null;
    if (!MONTH_NAMES.includes(month as (typeof MONTH_NAMES)[number]))
      return null;
    return { year, month };
  };

  const openStartDateMenu = () => {
    const parsed = parseSelectedMonthYear(selectedStartMonth);
    const fallbackYear = availableYears[0] ?? new Date().getFullYear();
    const year = parsed?.year ?? fallbackYear;
    const months = monthsForYear(year);
    setStartDraftYear(year);
    setStartDraftMonth(
      parsed?.month && months.includes(parsed.month)
        ? parsed.month
        : (months[0] ?? MONTH_NAMES[0]),
    );
    setOpenDateMenu("startDate");
  };

  const openEndDateMenu = () => {
    const parsed = parseSelectedMonthYear(selectedEndMonth);
    const fallbackYear = availableYears[0] ?? new Date().getFullYear();
    const year = parsed?.year ?? fallbackYear;
    const months = monthsForYear(year);
    setEndDraftYear(year);
    setEndDraftMonth(
      parsed?.month && months.includes(parsed.month)
        ? parsed.month
        : (months[0] ?? MONTH_NAMES[0]),
    );
    setOpenDateMenu("endDate");
  };

  return (
    <View
      style={{
        width: componentWidth,
        alignSelf: "center",
        paddingHorizontal: 10,
        marginBottom: 10,
      }}
    >
      {/* Keyword search */}
      <Searchbar
        testID="ReleaseNotesSearch"
        placeholder="Search release notes…"
        value={keyword}
        onChangeText={setKeyword}
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
        {/* Targets */}
        <Menu
          visible={openMenu === "targets"}
          onDismiss={() => setOpenMenu(null)}
          contentStyle={menuContentStyle}
          anchor={
            <View style={filterButtonContainerStyle}>
              <Button
                testID="ReleaseNotesTargetsFilterButton"
                {...filterButtonProps(selectedTargets.size > 0)}
                compact
                onPress={() => setOpenMenu("targets")}
              >
                {filterButtonLabel("Targets", selectedTargets.size)}
              </Button>
            </View>
          }
        >
          <View
            testID="ReleaseNotesTargetsFilterMenu"
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              padding: 10,
              maxWidth: 260,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
                Targets
              </Text>
              <IconButton
                testID="ReleaseNotesTargetsFilterCloseButton"
                icon="close"
                size={16}
                onPress={() => setOpenMenu(null)}
                style={{ margin: 0 }}
                iconColor={theme.colors.primary}
              />
            </View>
            {ALL_TARGETS.map((target) => (
              <Chip
                testID={`ReleaseNotesTargetOption-${target}`}
                key={target}
                selected={selectedTargets.has(target)}
                onPress={() =>
                  setSelectedTargets(toggleItem(selectedTargets, target))
                }
                {...chipProps(selectedTargets.has(target))}
              >
                {target}
              </Chip>
            ))}
          </View>
        </Menu>

        {/* Categories */}
        <Menu
          visible={openMenu === "categories"}
          onDismiss={() => setOpenMenu(null)}
          contentStyle={menuContentStyle}
          anchor={
            <View style={filterButtonContainerStyle}>
              <Button
                testID="ReleaseNotesCategoriesFilterButton"
                {...filterButtonProps(selectedCategories.size > 0)}
                compact
                onPress={() => setOpenMenu("categories")}
              >
                {filterButtonLabel("Categories", selectedCategories.size)}
              </Button>
            </View>
          }
        >
          <View
            testID="ReleaseNotesCategoriesFilterMenu"
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              padding: 10,
              maxWidth: selectionMenuMaxWidth,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
                Categories
              </Text>
              <IconButton
                testID="ReleaseNotesCategoriesFilterCloseButton"
                icon="close"
                size={16}
                onPress={() => setOpenMenu(null)}
                style={{ margin: 0 }}
                iconColor={theme.colors.primary}
              />
            </View>
            {ALL_CATEGORIES.map((cat) => (
              <Chip
                testID={`ReleaseNotesCategoryOption-${cat}`}
                key={cat}
                selected={selectedCategories.has(cat)}
                onPress={() =>
                  setSelectedCategories(toggleItem(selectedCategories, cat))
                }
                {...chipProps(selectedCategories.has(cat))}
              >
                {CATEGORY_LABELS[cat]}
              </Chip>
            ))}
          </View>
        </Menu>

        {/* Contributors */}
        <Menu
          visible={openMenu === "contributors"}
          onDismiss={() => setOpenMenu(null)}
          contentStyle={menuContentStyle}
          anchor={
            <View style={filterButtonContainerStyle}>
              <Button
                testID="ReleaseNotesContributorsFilterButton"
                {...filterButtonProps(selectedContributors.size > 0)}
                compact
                onPress={() => setOpenMenu("contributors")}
              >
                {filterButtonLabel("Contributors", selectedContributors.size)}
              </Button>
            </View>
          }
        >
          <View
            testID="ReleaseNotesContributorsFilterMenu"
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              padding: 10,
              maxWidth: selectionMenuMaxWidth,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
                Contributors
              </Text>
              <IconButton
                testID="ReleaseNotesContributorsFilterCloseButton"
                icon="close"
                size={16}
                onPress={() => setOpenMenu(null)}
                style={{ margin: 0 }}
                iconColor={theme.colors.primary}
              />
            </View>
            {allContributors.map((contributor) => (
              <Chip
                testID={`ReleaseNotesContributorOption-${contributor}`}
                key={contributor}
                selected={selectedContributors.has(contributor)}
                onPress={() =>
                  setSelectedContributors(
                    toggleItem(selectedContributors, contributor),
                  )
                }
                {...chipProps(selectedContributors.has(contributor))}
              >
                {contributor}
              </Chip>
            ))}
          </View>
        </Menu>

        {/* Start Date */}
        <Menu
          visible={openDateMenu === "startDate"}
          onDismiss={() => setOpenDateMenu(null)}
          contentStyle={menuContentStyle}
          anchor={
            <View style={filterButtonContainerStyle}>
              <Button
                testID="ReleaseNotesStartDateFilterButton"
                {...filterButtonProps(selectedStartMonth != null)}
                compact
                onPress={openStartDateMenu}
              >
                {selectedStartMonth
                  ? `Start Date: ${selectedStartMonth}`
                  : "Start Date"}
              </Button>
            </View>
          }
        >
          <View testID="ReleaseNotesStartDateFilterMenu" style={{ width: 260 }}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 8,
                paddingTop: 6,
              }}
            >
              <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
                Start Date
              </Text>
              <IconButton
                testID="ReleaseNotesStartDateFilterCloseButton"
                icon="close"
                size={16}
                onPress={() => setOpenDateMenu(null)}
                style={{ margin: 0 }}
                iconColor={theme.colors.primary}
              />
            </View>
            <View
              style={{
                paddingHorizontal: 8,
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: 8,
              }}
            >
              <View>
                <Text style={{ color: theme.colors.primary, marginBottom: 4 }}>
                  Year
                </Text>
                <Menu
                  visible={startYearMenuOpen}
                  onDismiss={() => setStartYearMenuOpen(false)}
                  contentStyle={menuContentStyle}
                  anchor={
                    <Button
                      testID="ReleaseNotesStartYearButton"
                      {...dateSelectorButtonProps}
                      compact
                      onPress={() => setStartYearMenuOpen(true)}
                    >
                      {String(startDraftYear)}
                    </Button>
                  }
                >
                  <ScrollView style={{ maxHeight: 180 }}>
                    {availableYears.map((year) => (
                      <Menu.Item
                        testID={`ReleaseNotesStartYearOption-${year}`}
                        key={`start-year-${year}`}
                        title={String(year)}
                        dense
                        titleStyle={{ color: theme.colors.primary }}
                        onPress={() => {
                          const months = monthsForYear(year);
                          setStartDraftYear(year);
                          if (!months.includes(startDraftMonth)) {
                            setStartDraftMonth(months[0] ?? MONTH_NAMES[0]);
                          }
                          setStartYearMenuOpen(false);
                        }}
                      />
                    ))}
                  </ScrollView>
                </Menu>
              </View>

              <View>
                <Text style={{ color: theme.colors.primary, marginBottom: 4 }}>
                  Month
                </Text>
                <Menu
                  visible={startMonthMenuOpen}
                  onDismiss={() => setStartMonthMenuOpen(false)}
                  contentStyle={menuContentStyle}
                  anchor={
                    <Button
                      testID="ReleaseNotesStartMonthButton"
                      {...dateSelectorButtonProps}
                      compact
                      onPress={() => setStartMonthMenuOpen(true)}
                    >
                      {startDraftMonth}
                    </Button>
                  }
                >
                  <ScrollView style={{ maxHeight: 180 }}>
                    {monthsForYear(startDraftYear).map((month) => (
                      <Menu.Item
                        testID={`ReleaseNotesStartMonthOption-${month}`}
                        key={`start-month-${month}`}
                        title={month}
                        dense
                        titleStyle={{ color: theme.colors.primary }}
                        onPress={() => {
                          setStartDraftMonth(month);
                          setSelectedStartMonth(`${month} ${startDraftYear}`);
                          setStartYearMenuOpen(false);
                          setStartMonthMenuOpen(false);
                          setOpenDateMenu(null);
                        }}
                      />
                    ))}
                  </ScrollView>
                </Menu>
              </View>
            </View>
          </View>
        </Menu>

        {/* End Date */}
        <Menu
          visible={openDateMenu === "endDate"}
          onDismiss={() => setOpenDateMenu(null)}
          contentStyle={menuContentStyle}
          anchor={
            <View style={filterButtonContainerStyle}>
              <Button
                testID="ReleaseNotesEndDateFilterButton"
                {...filterButtonProps(selectedEndMonth != null)}
                compact
                onPress={openEndDateMenu}
              >
                {selectedEndMonth
                  ? `End Date: ${selectedEndMonth}`
                  : "End Date"}
              </Button>
            </View>
          }
        >
          <View testID="ReleaseNotesEndDateFilterMenu" style={{ width: 260 }}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 8,
                paddingTop: 6,
              }}
            >
              <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
                End Date
              </Text>
              <IconButton
                testID="ReleaseNotesEndDateFilterCloseButton"
                icon="close"
                size={16}
                onPress={() => setOpenDateMenu(null)}
                style={{ margin: 0 }}
                iconColor={theme.colors.primary}
              />
            </View>
            <View
              style={{
                paddingHorizontal: 8,
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: 8,
              }}
            >
              <View>
                <Text style={{ color: theme.colors.primary, marginBottom: 4 }}>
                  Year
                </Text>
                <Menu
                  visible={endYearMenuOpen}
                  onDismiss={() => setEndYearMenuOpen(false)}
                  contentStyle={menuContentStyle}
                  anchor={
                    <Button
                      testID="ReleaseNotesEndYearButton"
                      {...dateSelectorButtonProps}
                      compact
                      onPress={() => setEndYearMenuOpen(true)}
                    >
                      {String(endDraftYear)}
                    </Button>
                  }
                >
                  <ScrollView style={{ maxHeight: 180 }}>
                    {availableYears.map((year) => (
                      <Menu.Item
                        testID={`ReleaseNotesEndYearOption-${year}`}
                        key={`end-year-${year}`}
                        title={String(year)}
                        dense
                        titleStyle={{ color: theme.colors.primary }}
                        onPress={() => {
                          const months = monthsForYear(year);
                          setEndDraftYear(year);
                          if (!months.includes(endDraftMonth)) {
                            setEndDraftMonth(months[0] ?? MONTH_NAMES[0]);
                          }
                          setEndYearMenuOpen(false);
                        }}
                      />
                    ))}
                  </ScrollView>
                </Menu>
              </View>

              <View>
                <Text style={{ color: theme.colors.primary, marginBottom: 4 }}>
                  Month
                </Text>
                <Menu
                  visible={endMonthMenuOpen}
                  onDismiss={() => setEndMonthMenuOpen(false)}
                  contentStyle={menuContentStyle}
                  anchor={
                    <Button
                      testID="ReleaseNotesEndMonthButton"
                      {...dateSelectorButtonProps}
                      compact
                      onPress={() => setEndMonthMenuOpen(true)}
                    >
                      {endDraftMonth}
                    </Button>
                  }
                >
                  <ScrollView style={{ maxHeight: 180 }}>
                    {monthsForYear(endDraftYear).map((month) => (
                      <Menu.Item
                        testID={`ReleaseNotesEndMonthOption-${month}`}
                        key={`end-month-${month}`}
                        title={month}
                        dense
                        titleStyle={{ color: theme.colors.primary }}
                        onPress={() => {
                          setEndDraftMonth(month);
                          setSelectedEndMonth(`${month} ${endDraftYear}`);
                          setEndYearMenuOpen(false);
                          setEndMonthMenuOpen(false);
                          setOpenDateMenu(null);
                        }}
                      />
                    ))}
                  </ScrollView>
                </Menu>
              </View>
            </View>
          </View>
        </Menu>
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
            fontSize: 13,
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
