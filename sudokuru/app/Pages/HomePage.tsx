import React from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Modal,
  Portal,
  Searchbar,
  Surface,
  Text,
} from "react-native-paper";
import { DEFAULT_HOME_SHORTCUTS, HomeShortcutId } from "../Api/HomeShortcuts";
import HomeShortcutCard from "../Components/Home/HomeShortcutCard";
import { useHomeDashboardData } from "../Components/Home/useHomeDashboardData";
import { useHomeShortcuts } from "../Components/Home/useHomeShortcuts";
import type { DashboardNavigationAction } from "../Components/SudokuBoard/SudokuBoardSharedFunctionsController";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { useTheme } from "../Contexts/ThemeContext";
import { formatTime } from "../Components/SudokuBoard/Core/Functions/BoardFunctions";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";

const HOME_MAX_WIDTH = 1160;
const HOME_MOBILE_BREAKPOINT = 760;

const HomePage = () => {
  const navigation: any = useNavigation();
  const { theme } = useTheme();
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
  const [query, setQuery] = React.useState("");
  const [customizeFocused, setCustomizeFocused] = React.useState(false);
  const [previewShortcutIds, setPreviewShortcutIds] = React.useState<
    HomeShortcutId[] | null
  >(null);
  const previewShortcutIdsRef = React.useRef<HomeShortcutId[] | null>(null);
  const deferredQuery = React.useDeferredValue(query.trim().toLowerCase());

  const { featurePreviewSetting, drillModeSetting, updateCurrentPage } =
    React.useContext(PreferencesContext);
  const dashboard = useHomeDashboardData({
    featurePreview: featurePreviewSetting,
    drillMode: drillModeSetting,
  });
  const shortcuts = useHomeShortcuts();
  const [fontsLoaded] = useFonts({ Inter_400Regular });

  const navigateTo = (action: DashboardNavigationAction) => {
    updateCurrentPage(action.currentPage);
    navigation.navigate(action.screen, action.params);
  };

  if (!fontsLoaded || shortcuts.isLoading) {
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

  const normalCardCount = selectedShortcuts.length + 1;
  const columnCount = isMobile ? 1 : Math.min(4, Math.max(2, normalCardCount));
  const rowCount = Math.ceil(normalCardCount / columnCount);
  const headerHeight = isEditing
    ? isShort
      ? 66
      : 78
    : dashboard.resumes.length > 0
      ? isMobile
        ? 190
        : 150
      : isMobile
        ? 145
        : 120;
  const sectionHeadingHeight = isShort ? 22 : 28;
  const progressHeight = isShort ? 54 : 64;
  const cardHeight = isMobile ? 116 : 130;
  const cardWidth = (contentWidth - gap * (columnCount - 1)) / columnCount;
  const gridHeight = cardHeight * rowCount + gap * (rowCount - 1);
  const statistics = dashboard.statistics;
  const progressItems = [
    {
      value: statistics ? statistics.numGamesPlayed.toString() : "-",
      label: "Solved",
    },
    {
      value:
        statistics && statistics.fastestSolveTime > 0
          ? formatTime(statistics.fastestSolveTime)
          : "-",
      label: "Best time",
    },
    {
      value: `${dashboard.completedLessons}/${dashboard.totalLessons}`,
      label: "Lessons",
    },
  ];

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
                        Sudoku Home
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
                      marginTop: 9,
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    {(
                      [
                        ["grid", "Classic puzzles"],
                        ["school-outline", "Guided lessons"],
                        ["target", "Strategy drills"],
                      ] as const
                    ).map(([icon, label]) => (
                      <View
                        key={label}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <MaterialCommunityIcons
                          name={icon}
                          size={16}
                          color={theme.colors.primary}
                        />
                        <Text
                          variant="labelMedium"
                          style={{ color: theme.semantic.text.tertiary }}
                        >
                          {label}
                        </Text>
                      </View>
                    ))}
                  </View>
                  {dashboard.resumes.length > 0 ? (
                    <View
                      style={{
                        marginTop: 8,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 6,
                      }}
                    >
                      {dashboard.resumes.map((resume) => (
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
                  textColor={theme.semantic.text.info}
                  onPress={finishEditing}
                >
                  Done
                </Button>
              </View>
            ) : null}
          </View>

          <View style={{ height: gap }} />

          <Surface
            elevation={1}
            style={{
              height: progressHeight,
              paddingHorizontal: isShort ? 12 : 18,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surfaceAlt,
              opacity: isEditing ? 0.58 : 1,
            }}
          >
            {dashboard.isLoading && !statistics ? (
              <ActivityIndicator
                color={theme.colors.primary}
                size="small"
                style={{ marginRight: 10 }}
              />
            ) : null}
            {progressItems.map((item) => (
              <View key={item.label} style={{ flex: 1, minWidth: 0 }}>
                <Text
                  numberOfLines={1}
                  variant={isShort ? "titleSmall" : "titleMedium"}
                  style={{ color: theme.colors.primary, fontWeight: "800" }}
                >
                  {item.value}
                </Text>
                <Text
                  numberOfLines={1}
                  variant="labelSmall"
                  style={{
                    color: theme.semantic.text.inverse,
                    opacity: 0.68,
                  }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </Surface>

          <View style={{ height: gap }} />

          <Text
            variant={isShort ? "titleSmall" : "titleMedium"}
            style={{
              height: sectionHeadingHeight,
              color: theme.semantic.text.tertiary,
              fontWeight: "800",
            }}
          >
            {isEditing ? "Your layout" : "Your Home"}
          </Text>
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
                onLongPress={beginEditing}
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
            <Pressable
              testID="HomeCustomizeButton"
              accessibilityRole="button"
              accessibilityLabel={
                isEditing ? "Add a Home shortcut" : "Customize Home"
              }
              accessibilityHint={
                isEditing
                  ? "Open the shortcut library"
                  : "Edit and add Home shortcuts"
              }
              onFocus={() => setCustomizeFocused(true)}
              onBlur={() => setCustomizeFocused(false)}
              onPress={openLibrary}
              style={{
                position: isEditing ? "absolute" : "relative",
                left: isEditing
                  ? (selectedShortcuts.length % columnCount) * (cardWidth + gap)
                  : undefined,
                top: isEditing
                  ? Math.floor(selectedShortcuts.length / columnCount) *
                    (cardHeight + gap)
                  : undefined,
                width: cardWidth,
                height: cardHeight,
              }}
            >
              {({ hovered, pressed }: any) => (
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    borderRadius: 14,
                    borderWidth: hovered || customizeFocused ? 2 : 1,
                    borderStyle: "dashed",
                    borderColor: theme.colors.primary,
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ rotate: isEditing ? "0.35deg" : "0deg" }],
                  }}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={isShort ? 28 : 36}
                    color={theme.colors.primary}
                  />
                  {cardHeight >= 82 ? (
                    <Text
                      variant="labelLarge"
                      style={{
                        color: theme.semantic.text.tertiary,
                        fontWeight: "800",
                      }}
                    >
                      {isEditing ? "Add shortcut" : "Customize"}
                    </Text>
                  ) : null}
                </View>
              )}
            </Pressable>
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
              backgroundColor: theme.colors.surfaceAlt,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
            inputStyle={{ color: theme.semantic.text.inverse }}
            iconColor={theme.colors.primary}
            placeholderTextColor={theme.semantic.text.inverse}
          />
          <ScrollView style={{ marginTop: 12 }}>
            {availableShortcuts.length > 0 ? (
              availableShortcuts.map((shortcut, index) => (
                <Pressable
                  key={shortcut.id}
                  testID={`Add${shortcut.testID}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${shortcut.title}`}
                  onPress={() => addShortcut(shortcut.id as HomeShortcutId)}
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
                        borderTopWidth: index === 0 ? 0 : 1,
                        borderColor: theme.colors.border,
                        backgroundColor: hovered
                          ? theme.colors.surfaceAlt
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
                          backgroundColor: theme.colors.surfaceAlt,
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
