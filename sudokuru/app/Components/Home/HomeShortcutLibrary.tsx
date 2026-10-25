import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { IconButton, Modal, Portal, Searchbar, Text } from "react-native-paper";
import type { HomeShortcutId } from "../../Api/HomeShortcuts";
import type {
  HomeDashboardCardDescriptor,
  HomeShortcutCategory,
} from "./HomeDashboard";
import { useTheme } from "../../Contexts/ThemeContext";

const SHORTCUT_LIBRARY_CATEGORIES: {
  id: HomeShortcutCategory;
  title: string;
}[] = [
  { id: "activities", title: "Activities" },
  { id: "difficulties", title: "Classic Difficulties" },
  { id: "strategies", title: "Strategy Practice" },
  { id: "account", title: "Account" },
];

interface HomeShortcutLibraryProps {
  isLibraryOpen: boolean;
  isMobile: boolean;
  windowSize: { width: number; height: number };
  catalogue: HomeDashboardCardDescriptor[];
  shortcutIds: HomeShortcutId[];
  addShortcut: (shortcutId: HomeShortcutId) => void;
  onClose: () => void;
}

const HomeShortcutLibrary = ({
  isLibraryOpen,
  isMobile,
  windowSize,
  catalogue,
  shortcutIds,
  addShortcut,
  onClose,
}: HomeShortcutLibraryProps) => {
  const { theme } = useTheme();
  const [query, setQuery] = React.useState("");
  const [expandedLibraryCategories, setExpandedLibraryCategories] =
    React.useState<Set<HomeShortcutCategory>>(
      () => new Set(["activities", "account"]),
    );
  const cardSurfaceColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const cardTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.quaternary;
  const deferredQuery = React.useDeferredValue(query.trim().toLowerCase());
  const availableShortcuts = catalogue.filter(
    (shortcut) =>
      !shortcutIds.includes(shortcut.id) &&
      `${shortcut.title} ${shortcut.description} ${shortcut.badge ?? ""}`
        .toLowerCase()
        .includes(deferredQuery),
  );
  const availableShortcutGroups = SHORTCUT_LIBRARY_CATEGORIES.flatMap(
    (category) => {
      const items = availableShortcuts.filter(
        (shortcut) => shortcut.shortcutCategory === category.id,
      );
      return items.length > 0 ? [{ ...category, items }] : [];
    },
  );

  const toggleLibraryCategory = (category: HomeShortcutCategory) => {
    setExpandedLibraryCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const closeLibrary = () => {
    setQuery("");
    onClose();
  };

  return (
    <Portal>
      <Modal
        visible={isLibraryOpen}
        onDismiss={closeLibrary}
        contentContainerStyle={{
          width: isMobile ? "100%" : Math.min(640, windowSize.width - 48),
          maxHeight: windowSize.height * 0.78,
          alignSelf: "center",
          marginTop: "auto",
          marginBottom: isMobile ? 0 : "auto",
          padding: isMobile ? 18 : 24,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          borderBottomLeftRadius: isMobile ? 0 : 22,
          borderBottomRightRadius: isMobile ? 0 : 22,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.bg,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              accessibilityRole="header"
              variant="headlineSmall"
              style={{
                color: theme.semantic.text.tertiary,
                fontWeight: "800",
              }}
            >
              Shortcut library
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.semantic.text.tertiary, opacity: 0.7 }}
            >
              Tap a shortcut to add it to Home.
            </Text>
          </View>
          <IconButton
            testID="CloseHomeShortcutLibrary"
            accessibilityLabel="Close shortcut library"
            icon="close"
            iconColor={theme.colors.primary}
            onPress={closeLibrary}
          />
        </View>
        <Searchbar
          testID="HomeShortcutSearchInput"
          placeholder="Search shortcuts"
          value={query}
          onChangeText={setQuery}
          style={{
            marginTop: 14,
            backgroundColor: cardSurfaceColor,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
          inputStyle={{ color: cardTextColor }}
          iconColor={theme.colors.primary}
          placeholderTextColor={cardTextColor}
        />
        <ScrollView style={{ marginTop: 12 }}>
          {availableShortcutGroups.length > 0 ? (
            availableShortcutGroups.map((category) => {
              const isExpanded =
                deferredQuery.length > 0 ||
                expandedLibraryCategories.has(category.id);
              return (
                <View key={category.id}>
                  <Pressable
                    testID={`HomeShortcutCategory-${category.id}`}
                    accessibilityRole="button"
                    accessibilityState={{
                      disabled: deferredQuery.length > 0,
                      expanded: isExpanded,
                    }}
                    disabled={deferredQuery.length > 0}
                    onPress={() => toggleLibraryCategory(category.id)}
                  >
                    {({ hovered, pressed }: any) => (
                      <View
                        style={{
                          minHeight: 50,
                          paddingHorizontal: 12,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          borderBottomWidth: isExpanded ? 1 : 0,
                          borderColor: theme.colors.border,
                          backgroundColor: hovered
                            ? cardSurfaceColor
                            : theme.colors.bg,
                          opacity: pressed ? 0.75 : 1,
                        }}
                      >
                        <Text
                          variant="titleSmall"
                          style={{
                            flex: 1,
                            color: theme.semantic.text.tertiary,
                            fontWeight: "800",
                          }}
                        >
                          {category.title}
                        </Text>
                        <Text
                          variant="labelMedium"
                          style={{
                            color: theme.semantic.text.tertiary,
                            opacity: 0.6,
                          }}
                        >
                          {category.items.length}
                        </Text>
                        <MaterialCommunityIcons
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={22}
                          color={theme.colors.primary}
                        />
                      </View>
                    )}
                  </Pressable>
                  {isExpanded
                    ? category.items.map((shortcut, index) => (
                        <Pressable
                          key={shortcut.id}
                          testID={`Add${shortcut.testID}`}
                          accessibilityRole="button"
                          accessibilityLabel={`Add ${shortcut.title}`}
                          onPress={() => addShortcut(shortcut.id)}
                        >
                          {({ hovered, pressed }: any) => (
                            <View
                              style={{
                                minHeight: 72,
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                                borderBottomWidth:
                                  index === category.items.length - 1 ? 0 : 1,
                                borderColor: theme.colors.border,
                                backgroundColor: hovered
                                  ? cardSurfaceColor
                                  : theme.colors.bg,
                                opacity: pressed ? 0.75 : 1,
                              }}
                            >
                              <View
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 10,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: cardSurfaceColor,
                                }}
                              >
                                <MaterialCommunityIcons
                                  name={shortcut.icon}
                                  size={24}
                                  color={theme.colors.primary}
                                />
                              </View>
                              <View style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                  variant="titleSmall"
                                  style={{
                                    color: theme.semantic.text.tertiary,
                                    fontWeight: "800",
                                  }}
                                >
                                  {shortcut.title}
                                </Text>
                                <Text
                                  numberOfLines={1}
                                  variant="bodySmall"
                                  style={{
                                    color: theme.semantic.text.tertiary,
                                    opacity: 0.68,
                                  }}
                                >
                                  {shortcut.description}
                                </Text>
                              </View>
                              <MaterialCommunityIcons
                                name="plus-circle-outline"
                                size={26}
                                color={theme.colors.primary}
                              />
                            </View>
                          )}
                        </Pressable>
                      ))
                    : null}
                </View>
              );
            })
          ) : (
            <View style={{ paddingVertical: 28, alignItems: "center" }}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.semantic.text.tertiary }}
              >
                {query
                  ? `No shortcuts match “${query}”.`
                  : "All available shortcuts are already on Home."}
              </Text>
            </View>
          )}
        </ScrollView>
      </Modal>
    </Portal>
  );
};

export default HomeShortcutLibrary;
