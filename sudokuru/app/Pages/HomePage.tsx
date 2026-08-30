import React from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Menu,
  Modal,
  Portal,
  Searchbar,
  Text,
} from "react-native-paper";
import { DEFAULT_HOME_SHORTCUTS, HomeShortcutId } from "../Api/HomeShortcuts";
import HomeShortcutCard from "../Components/Home/HomeShortcutCard";
import { useHomeDashboardData } from "../Components/Home/useHomeDashboardData";
import { useHomeDifficulty } from "../Components/Home/useHomeDifficulty";
import { useHomeShortcuts } from "../Components/Home/useHomeShortcuts";
import type {
  DashboardNavigationAction,
  HomeShortcutCategory,
} from "../Components/Home/HomeDashboard";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { useTheme } from "../Contexts/ThemeContext";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";

const HOME_MAX_WIDTH = 1160;
const HOME_MOBILE_BREAKPOINT = 760;
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
  const cardSurfaceColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const cardTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.quaternary;
  const primaryButtonTextColor = theme.useDarkTheme
    ? theme.semantic.text.info
    : theme.semantic.text.inverse;
  const windowSize = useNewWindowDimensions();
  const isMobile = windowSize.width < HOME_MOBILE_BREAKPOINT;
  const isShort = windowSize.height < 590;
  const outerPadding = isShort ? 10 : isMobile ? 16 : 24;
  const gap = isShort ? 8 : 12;
  const contentWidth = Math.min(
    HOME_MAX_WIDTH,
    Math.max(windowSize.width - outerPadding * 2, 0),
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = React.useState(false);
  const [isDifficultyMenuOpen, setIsDifficultyMenuOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [expandedLibraryCategories, setExpandedLibraryCategories] =
    React.useState<Set<HomeShortcutCategory>>(
      () => new Set(["activities", "account"]),
    );
  const [previewShortcutIds, setPreviewShortcutIds] = React.useState<
    HomeShortcutId[] | null
  >(null);
  const previewShortcutIdsRef = React.useRef<HomeShortcutId[] | null>(null);
  const deferredQuery = React.useDeferredValue(query.trim().toLowerCase());

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
  const availableShortcuts = dashboard.config.shortcutCatalogue.filter(
    (shortcut) =>
      !shortcuts.shortcutIds.includes(shortcut.id as HomeShortcutId) &&
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
  const selectedDifficultyOption = dashboard.heroAction.difficultyOptions?.find(
    (option) => option.value === selectedDifficulty,
  );

  const columnCount = isMobile
    ? 1
    : Math.min(4, Math.max(2, selectedShortcuts.length));
  const rowCount = Math.ceil(selectedShortcuts.length / columnCount);
  const headerHeight = isEditing ? (isShort ? 66 : 78) : undefined;
  const sectionHeadingHeight = 40;
  const cardHeight = isMobile ? 116 : 130;
  const cardWidth = (contentWidth - gap * (columnCount - 1)) / columnCount;
  const gridHeight =
    rowCount > 0 ? cardHeight * rowCount + gap * (rowCount - 1) : 0;

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

  const openLibrary = () => {
    if (!isEditing) beginEditing();
    setIsLibraryOpen(true);
  };

  const finishEditing = () => {
    const previewOrder = previewShortcutIdsRef.current;
    if (previewOrder) shortcuts.reorderShortcuts(previewOrder);
    setQuery("");
    setIsLibraryOpen(false);
    setIsEditing(false);
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
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: outerPadding,
          paddingVertical: outerPadding,
          minHeight: windowSize.height,
        }}
      >
        <View style={{ width: contentWidth }}>
          <View
            style={{
              minHeight: headerHeight,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              {isEditing ? (
                <>
                  <Text
                    accessibilityRole="header"
                    variant={isMobile ? "headlineSmall" : "headlineMedium"}
                    style={{
                      color: theme.semantic.text.tertiary,
                      fontWeight: "800",
                    }}
                  >
                    Edit Home
                  </Text>
                  <Text
                    numberOfLines={1}
                    variant="bodySmall"
                    style={{
                      color: theme.semantic.text.tertiary,
                      opacity: 0.7,
                    }}
                  >
                    Drag shortcuts to rearrange them.
                  </Text>
                </>
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <Image
                      accessible={false}
                      source={require("../../.assets/goldLogoNoText.png")}
                      style={{
                        width: isMobile ? 52 : 64,
                        height: isMobile ? 52 : 64,
                        resizeMode: "contain",
                      }}
                    />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        accessibilityRole="header"
                        variant={isMobile ? "headlineSmall" : "headlineMedium"}
                        style={{
                          color: theme.semantic.text.tertiary,
                          fontWeight: "800",
                        }}
                      >
                        Sudokuru
                      </Text>
                      <Text
                        variant="bodyMedium"
                        style={{
                          marginTop: 2,
                          color: theme.semantic.text.tertiary,
                          opacity: 0.72,
                        }}
                      >
                        Play puzzles, learn solving strategies, and practice
                        with focused drills.
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      marginTop: 14,
                      padding: isMobile ? 14 : 18,
                      flexDirection: isMobile ? "column" : "row",
                      alignItems: isMobile ? "stretch" : "center",
                      gap: 16,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      backgroundColor: cardSurfaceColor,
                    }}
                  >
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        variant={isMobile ? "titleMedium" : "titleLarge"}
                        style={{
                          color: cardTextColor,
                          fontWeight: "800",
                        }}
                      >
                        {dashboard.heroAction.title}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{
                          marginTop: 3,
                          color: cardTextColor,
                          opacity: 0.7,
                        }}
                      >
                        {dashboard.heroAction.description}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {dashboard.heroAction.difficultyOptions ? (
                        <Menu
                          visible={isDifficultyMenuOpen}
                          onDismiss={() => setIsDifficultyMenuOpen(false)}
                          anchor={
                            <Button
                              testID="HomeDifficultySelector"
                              accessibilityLabel={`Difficulty: ${selectedDifficultyOption?.label ?? selectedDifficulty}`}
                              mode="outlined"
                              icon="chevron-down"
                              textColor={theme.colors.primary}
                              style={{
                                minWidth: 140,
                                borderColor: theme.colors.primary,
                              }}
                              onPress={() => setIsDifficultyMenuOpen(true)}
                            >
                              {selectedDifficultyOption?.label ??
                                selectedDifficulty}
                            </Button>
                          }
                          contentStyle={{ backgroundColor: theme.colors.bg }}
                        >
                          <ScrollView style={{ maxHeight: 320 }}>
                            {dashboard.heroAction.difficultyOptions.map(
                              (option) => (
                                <Menu.Item
                                  key={option.value}
                                  testID={`HomeDifficulty-${option.value}`}
                                  title={option.label}
                                  leadingIcon={
                                    option.value === selectedDifficulty
                                      ? "check"
                                      : undefined
                                  }
                                  titleStyle={{
                                    color: theme.semantic.text.tertiary,
                                  }}
                                  onPress={() => {
                                    homeDifficulty.updateDifficulty(
                                      option.value,
                                    );
                                    setIsDifficultyMenuOpen(false);
                                  }}
                                />
                              ),
                            )}
                          </ScrollView>
                        </Menu>
                      ) : null}
                      <Button
                        testID={dashboard.heroAction.testID}
                        mode="contained"
                        icon="arrow-right"
                        contentStyle={{ flexDirection: "row-reverse" }}
                        buttonColor={theme.colors.primary}
                        textColor={primaryButtonTextColor}
                        onPress={() => navigateTo(dashboard.heroAction.action)}
                      >
                        {dashboard.heroAction.label}
                      </Button>
                    </View>
                  </View>
                  {dashboard.supportingResumes.length > 0 ? (
                    <View
                      style={{
                        marginTop: 8,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 6,
                      }}
                    >
                      {dashboard.supportingResumes.map((resume) => (
                        <Button
                          key={resume.id}
                          testID={resume.testID}
                          compact
                          mode="outlined"
                          icon={resume.icon}
                          textColor={theme.semantic.text.tertiary}
                          style={{ borderColor: theme.colors.border }}
                          onPress={() => navigateTo(resume.action)}
                        >
                          Resume {resume.title}
                        </Button>
                      ))}
                    </View>
                  ) : null}
                </>
              )}
            </View>
            {isEditing ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Button
                  testID="HomeResetShortcutsButton"
                  compact
                  textColor={theme.colors.primary}
                  onPress={resetShortcuts}
                >
                  Reset
                </Button>
                <Button
                  testID="HomeCustomizeDoneButton"
                  mode="contained"
                  buttonColor={theme.colors.primary}
                  textColor={primaryButtonTextColor}
                  onPress={finishEditing}
                >
                  Done
                </Button>
              </View>
            ) : null}
          </View>

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
                onPress={openLibrary}
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
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={isLibraryOpen}
          onDismiss={() => {
            setQuery("");
            setIsLibraryOpen(false);
          }}
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
              onPress={() => {
                setQuery("");
                setIsLibraryOpen(false);
              }}
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
    </View>
  );
};

export default HomePage;
