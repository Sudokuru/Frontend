import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Modal,
  Portal,
  Searchbar,
  Text,
} from "react-native-paper";
import { DEFAULT_HOME_SHORTCUTS, HomeShortcutId } from "../Api/HomeShortcuts";
import HomeShortcutCard from "../Components/Home/HomeShortcutCard";
import HomeDashboardHeader from "../Components/Home/HomeDashboardHeader";
import { useHomeDashboardData } from "../Components/Home/useHomeDashboardData";
import { useHomeDifficulty } from "../Components/Home/useHomeDifficulty";
import { useHomeShortcuts } from "../Components/Home/useHomeShortcuts";
import { getHomeLayout } from "../Components/Home/HomeLayout";
import type {
  DashboardNavigationAction,
  HomeShortcutCategory,
  HomeDashboardCardDescriptor,
} from "../Components/Home/HomeDashboard";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { useTheme } from "../Contexts/ThemeContext";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";

const SHORTCUT_LIBRARY_CATEGORIES: {
  id: HomeShortcutCategory;
  title: string;
}[] = [
  { id: "activities", title: "Activities" },
  { id: "difficulties", title: "Classic Difficulties" },
  { id: "strategies", title: "Strategy Practice" },
  { id: "account", title: "Account" },
];

const HomePage = () => {
  const navigation: any = useNavigation();
  const { theme } = useTheme();
  const windowSize = useNewWindowDimensions();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [expandedLibraryCategories, setExpandedLibraryCategories] =
    React.useState<Set<HomeShortcutCategory>>(
      () => new Set(["activities", "account"]),
    );
  const [previewShortcutIds, setPreviewShortcutIds] = React.useState<
    HomeShortcutId[] | null
  >(null);
  const previewShortcutIdsRef = React.useRef<HomeShortcutId[] | null>(null);
  // A touch that starts on an editing card owns the gesture for its whole
  // lifetime: the ScrollView stays locked while a card is touched so native
  // scroll views cannot claim vertical pans mid-drag. On web this is
  // belt-and-braces — the editing cards already opt out of browser touch
  // scrolling through `touch-action` — and it also stops a second finger
  // from panning the page beneath an active drag.
  const [cardTouched, setCardTouched] = React.useState(false);

  const { featurePreviewSetting, drillModeSetting, updateCurrentPage } =
    React.useContext(PreferencesContext);
  const homeDifficulty = useHomeDifficulty();
  const selectedDifficulty = homeDifficulty.difficulty;
  const dashboard = useHomeDashboardData(
    {
      featurePreview: featurePreviewSetting,
      drillMode: drillModeSetting,
    },
    selectedDifficulty,
  );
  const shortcuts = useHomeShortcuts();
  const [fontsLoaded] = useFonts({ Inter_400Regular });
  const isFocused = useIsFocused();

  const navigateTo = (action: DashboardNavigationAction) => {
    updateCurrentPage(action.currentPage);
    navigation.navigate(action.screen, action.params);
  };

  if (!isFocused) return <Text>Error Loading Page</Text>;

  if (!fontsLoaded || shortcuts.isLoading || homeDifficulty.isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.bg,
        }}
      >
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  const shortcutById = new Map(
    dashboard.config.shortcutCatalogue.map((shortcut) => [
      shortcut.id,
      shortcut,
    ]),
  );
  const persistedVisibleShortcutIds = shortcuts.shortcutIds.filter(
    (shortcutId) => shortcutById.has(shortcutId),
  );
  const visibleShortcutIds =
    isEditing && previewShortcutIds
      ? previewShortcutIds
      : persistedVisibleShortcutIds;
  const selectedShortcuts = visibleShortcutIds.flatMap((shortcutId) => {
    const shortcut = shortcutById.get(shortcutId);
    return shortcut ? [shortcut] : [];
  });
  const renderedShortcuts = isEditing
    ? dashboard.config.shortcutCatalogue.filter((shortcut) =>
        visibleShortcutIds.includes(shortcut.id as HomeShortcutId),
      )
    : selectedShortcuts;

  const {
    isMobile,
    isShort,
    outerPadding,
    gap,
    contentWidth,
    columnCount,
    cardHeight,
    cardWidth,
    gridHeight,
    editingHeaderHeight,
  } = getHomeLayout(windowSize, selectedShortcuts.length);
  const headerHeight = isEditing ? editingHeaderHeight : undefined;
  const sectionHeadingHeight = 40;

  const setPreviewOrder = (shortcutIds: HomeShortcutId[]) => {
    previewShortcutIdsRef.current = shortcutIds;
    setPreviewShortcutIds(shortcutIds);
  };

  const previewShortcutOrder = (shortcutId: string, toIndex: number) => {
    const currentOrder =
      previewShortcutIdsRef.current ?? persistedVisibleShortcutIds;
    const fromIndex = currentOrder.indexOf(shortcutId as HomeShortcutId);
    if (fromIndex < 0 || fromIndex === toIndex) return;

    const nextShortcuts = [...currentOrder];
    const [movedShortcut] = nextShortcuts.splice(fromIndex, 1);
    nextShortcuts.splice(toIndex, 0, movedShortcut);
    setPreviewOrder(nextShortcuts);
  };

  const beginEditing = () => {
    setPreviewOrder([...persistedVisibleShortcutIds]);
    setIsEditing(true);
  };

  const finishEditing = () => {
    const previewOrder = previewShortcutIdsRef.current;
    if (previewOrder) shortcuts.reorderShortcuts(previewOrder);
    setQuery("");
    setIsLibraryOpen(false);
    setIsEditing(false);
    setCardTouched(false);
    previewShortcutIdsRef.current = null;
    setPreviewShortcutIds(null);
  };

  const resetShortcuts = () => {
    shortcuts.resetShortcuts();
    setPreviewOrder(
      DEFAULT_HOME_SHORTCUTS.filter((shortcutId) =>
        shortcutById.has(shortcutId),
      ),
    );
  };

  const removeShortcut = (shortcutId: HomeShortcutId) => {
    const nextPreview = (
      previewShortcutIdsRef.current ?? persistedVisibleShortcutIds
    ).filter((id) => id !== shortcutId);
    setPreviewOrder(nextPreview);
    shortcuts.removeShortcut(shortcutId);
  };

  const addShortcut = (shortcutId: HomeShortcutId) => {
    const currentPreview =
      previewShortcutIdsRef.current ?? persistedVisibleShortcutIds;
    if (!currentPreview.includes(shortcutId)) {
      setPreviewOrder([...currentPreview, shortcutId]);
    }
    shortcuts.addShortcut(shortcutId);
  };

  const toggleLibraryCategory = (category: HomeShortcutCategory) => {
    setExpandedLibraryCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  return (
    <View
      testID={isEditing ? "HomeCustomizeMode" : "HomeDashboard"}
      style={{
        width: windowSize.width,
        height: windowSize.height,
        backgroundColor: theme.colors.bg,
      }}
    >
      <ScrollView
        style={{ width: windowSize.width, height: windowSize.height }}
        scrollEnabled={!cardTouched}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: outerPadding,
          paddingVertical: outerPadding,
          minHeight: windowSize.height,
        }}
      >
        <View style={{ width: contentWidth }}>
          <HomeDashboardHeader
            isEditing={isEditing}
            isMobile={isMobile}
            height={headerHeight}
            heroAction={dashboard.heroAction}
            supportingResumes={dashboard.supportingResumes}
            difficulty={selectedDifficulty}
            onDifficultyChange={homeDifficulty.updateDifficulty}
            onNavigate={navigateTo}
            onReset={resetShortcuts}
            onDone={finishEditing}
          />

          <View style={{ height: gap }} />

          <View
            style={{
              height: sectionHeadingHeight,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              variant={isShort ? "titleSmall" : "titleMedium"}
              style={{
                color: theme.semantic.text.tertiary,
                fontWeight: "800",
              }}
            >
              {isEditing ? "Your layout" : "Your Home"}
            </Text>
            {!isEditing ? (
              <Button
                testID="HomeCustomizeButton"
                compact
                icon="pencil-outline"
                textColor={theme.colors.primary}
                onPress={beginEditing}
              >
                Customize home
              </Button>
            ) : (
              <Button
                testID="HomeAddShortcutButton"
                compact
                icon="plus"
                textColor={theme.colors.primary}
                onPress={() => setIsLibraryOpen(true)}
              >
                Add shortcut
              </Button>
            )}
          </View>
          <View
            style={{
              height: gridHeight,
              position: "relative",
              flexDirection: "row",
              flexWrap: "wrap",
              gap,
            }}
          >
            {renderedShortcuts.map((shortcut) => (
              <HomeShortcutCard
                key={shortcut.id}
                shortcut={shortcut}
                width={cardWidth}
                height={cardHeight}
                index={visibleShortcutIds.indexOf(
                  shortcut.id as HomeShortcutId,
                )}
                columns={columnCount}
                total={selectedShortcuts.length}
                gap={gap}
                editing={isEditing}
                onPress={() => shortcut.action && navigateTo(shortcut.action)}
                onRemove={() => removeShortcut(shortcut.id as HomeShortcutId)}
                onDragPreview={previewShortcutOrder}
                onDragEnd={() => {
                  const previewOrder = previewShortcutIdsRef.current;
                  if (previewOrder) shortcuts.reorderShortcuts(previewOrder);
                }}
                onDragCancel={() =>
                  setPreviewOrder([...persistedVisibleShortcutIds])
                }
                onCardTouchStart={() => setCardTouched(true)}
                onCardTouchEnd={() => setCardTouched(false)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <HomeShortcutLibrary
        isLibraryOpen={isLibraryOpen}
        isMobile={isMobile}
        windowSize={windowSize}
        catalogue={dashboard.config.shortcutCatalogue}
        shortcutIds={shortcuts.shortcutIds}
        query={query}
        setQuery={setQuery}
        expandedLibraryCategories={expandedLibraryCategories}
        toggleLibraryCategory={toggleLibraryCategory}
        addShortcut={addShortcut}
        onClose={() => setIsLibraryOpen(false)}
      />
    </View>
  );
};

interface HomeShortcutLibraryProps {
  isLibraryOpen: boolean;
  isMobile: boolean;
  windowSize: { width: number; height: number };
  catalogue: HomeDashboardCardDescriptor[];
  shortcutIds: HomeShortcutId[];
  query: string;
  setQuery: (query: string) => void;
  expandedLibraryCategories: Set<HomeShortcutCategory>;
  toggleLibraryCategory: (category: HomeShortcutCategory) => void;
  addShortcut: (shortcutId: HomeShortcutId) => void;
  onClose: () => void;
}

const HomeShortcutLibrary = ({
  isLibraryOpen,
  isMobile,
  windowSize,
  catalogue,
  shortcutIds,
  query,
  setQuery,
  expandedLibraryCategories,
  toggleLibraryCategory,
  addShortcut,
  onClose,
}: HomeShortcutLibraryProps) => {
  const { theme } = useTheme();
  const cardSurfaceColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const cardTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.quaternary;
  const deferredQuery = React.useDeferredValue(query.trim().toLowerCase());
  const availableShortcuts = catalogue.filter(
    (shortcut) =>
      !shortcutIds.includes(shortcut.id as HomeShortcutId) &&
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
                          onPress={() =>
                            addShortcut(shortcut.id as HomeShortcutId)
                          }
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

export default HomePage;
