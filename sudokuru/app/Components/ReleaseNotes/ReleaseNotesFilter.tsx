import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import {
  Searchbar,
  Button,
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
  keyword: string;
  setKeyword: (v: string) => void;
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

type OpenMenu = "targets" | "categories" | "contributors" | null;

export const ReleaseNotesFilter = ({
  allContributors,
  keyword,
  setKeyword,
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

  const hasActiveFilters =
    keyword.trim().length > 0 ||
    selectedTargets.size > 0 ||
    selectedContributors.size > 0 ||
    selectedCategories.size > 0;

  const filterButtonLabel = (label: string, count: number) =>
    count > 0 ? `${label} (${count})` : label;

  const chipProps = (selected: boolean) => ({
    selectedColor: theme.semantic.text.inverse,
    style: {
      backgroundColor: selected
        ? theme.colors.primary
        : theme.colors.surfaceAlt,
    },
    textStyle: { color: theme.semantic.text.inverse },
  });

  const menuAnchorStyle = { marginRight: 6 };

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

      {/* Horizontal filter bar + fixed right side */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center", paddingVertical: 2 }}
          style={{ flex: 1 }}
        >
          {/* Targets */}
          <Menu
            visible={openMenu === "targets"}
            onDismiss={() => setOpenMenu(null)}
            contentStyle={{ backgroundColor: theme.colors.surface }}
            anchor={
              <Button
                mode={selectedTargets.size > 0 ? "contained" : "outlined"}
                compact
                onPress={() => setOpenMenu("targets")}
                style={menuAnchorStyle}
                buttonColor={
                  selectedTargets.size > 0 ? theme.colors.primary : undefined
                }
                textColor={
                  selectedTargets.size > 0
                    ? theme.semantic.text.secondary
                    : theme.colors.primary
                }
              >
                {filterButtonLabel("Targets", selectedTargets.size)}
              </Button>
            }
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                padding: 10,
                maxWidth: 260,
              }}
            >
              {ALL_TARGETS.map((target) => (
                <Chip
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
            contentStyle={{ backgroundColor: theme.colors.surface }}
            anchor={
              <Button
                mode={selectedCategories.size > 0 ? "contained" : "outlined"}
                compact
                onPress={() => setOpenMenu("categories")}
                style={menuAnchorStyle}
                buttonColor={
                  selectedCategories.size > 0 ? theme.colors.primary : undefined
                }
                textColor={
                  selectedCategories.size > 0
                    ? theme.semantic.text.secondary
                    : theme.colors.primary
                }
              >
                {filterButtonLabel("Categories", selectedCategories.size)}
              </Button>
            }
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                padding: 10,
                maxWidth: 320,
              }}
            >
              {ALL_CATEGORIES.map((cat) => (
                <Chip
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
            contentStyle={{ backgroundColor: theme.colors.surface }}
            anchor={
              <Button
                mode={selectedContributors.size > 0 ? "contained" : "outlined"}
                compact
                onPress={() => setOpenMenu("contributors")}
                style={menuAnchorStyle}
                buttonColor={
                  selectedContributors.size > 0
                    ? theme.colors.primary
                    : undefined
                }
                textColor={
                  selectedContributors.size > 0
                    ? theme.semantic.text.secondary
                    : theme.colors.primary
                }
              >
                {filterButtonLabel("Contributors", selectedContributors.size)}
              </Button>
            }
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                padding: 10,
                maxWidth: 340,
              }}
            >
              {allContributors.map((contributor) => (
                <Chip
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
        </ScrollView>

        {/* Fixed right: result count + clear */}
        <View
          style={{ flexDirection: "row", alignItems: "center", paddingLeft: 6 }}
        >
          {hasActiveFilters && (
            <Button mode="text" compact onPress={onClearAll}>
              Clear
            </Button>
          )}
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: 13,
              marginRight: 2,
            }}
          >
            {resultCount} releases
          </Text>
        </View>
      </View>

      <Divider style={{ marginTop: 8 }} />
    </View>
  );
};
