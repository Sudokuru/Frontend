import React from "react";
import { ScrollView, View } from "react-native";
import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { DEFAULT_HOME_SHORTCUTS, HomeShortcutId } from "../Api/HomeShortcuts";
import HomeShortcutCard from "../Components/Home/HomeShortcutCard";
import HomeShortcutLibrary from "../Components/Home/HomeShortcutLibrary";
import HomeDashboardHeader from "../Components/Home/HomeDashboardHeader";
import { useHomeDashboardData } from "../Components/Home/useHomeDashboardData";
import { useHomeDifficulty } from "../Components/Home/useHomeDifficulty";
import { useHomeShortcuts } from "../Components/Home/useHomeShortcuts";
import { getHomeLayout } from "../Components/Home/HomeLayout";
import type { DashboardNavigationAction } from "../Components/Home/HomeDashboard";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { useTheme } from "../Contexts/ThemeContext";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";

const HomePage = () => {
  const navigation: any = useNavigation();
  const { theme } = useTheme();
  const windowSize = useNewWindowDimensions();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = React.useState(false);
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

  const clearCustomization = React.useCallback(() => {
    setIsLibraryOpen(false);
    setIsEditing(false);
    setCardTouched(false);
    previewShortcutIdsRef.current = null;
    setPreviewShortcutIds(null);
  }, []);

  // Discard only the temporary preview on blur. Returning Home must rebuild
  // the visible order using the current feature flags and saved shortcuts.
  useFocusEffect(
    React.useCallback(() => clearCustomization, [clearCustomization]),
  );

  const navigateTo = (action: DashboardNavigationAction) => {
    updateCurrentPage(action.currentPage);
    navigation.navigate(action.screen, action.params);
  };

  if (!isFocused) return <Text>Error Loading Page</Text>;

  if (
    !fontsLoaded ||
    shortcuts.isLoading ||
    homeDifficulty.isLoading ||
    dashboard.isLoading
  ) {
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
        visibleShortcutIds.includes(shortcut.id),
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

  const previewShortcutOrder = (
    shortcutId: HomeShortcutId,
    toIndex: number,
  ) => {
    const currentOrder =
      previewShortcutIdsRef.current ?? persistedVisibleShortcutIds;
    const fromIndex = currentOrder.indexOf(shortcutId);
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
    clearCustomization();
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
          {/* Rebuild changed grid geometry to clear stale Safari shadows. */}
          <View
            key={columnCount}
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
                index={visibleShortcutIds.indexOf(shortcut.id)}
                columns={columnCount}
                total={selectedShortcuts.length}
                gap={gap}
                editing={isEditing}
                onPress={() => shortcut.action && navigateTo(shortcut.action)}
                onRemove={() => removeShortcut(shortcut.id)}
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
        addShortcut={addShortcut}
        onClose={() => setIsLibraryOpen(false)}
      />
    </View>
  );
};

export default HomePage;
