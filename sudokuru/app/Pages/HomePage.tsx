import React from "react";
import { ScrollView, View } from "react-native";
import type { ScrollViewInstance } from "react-native";
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
  const isEditingRef = React.useRef(false);
  const [isLibraryOpen, setIsLibraryOpen] = React.useState(false);
  const [previewShortcutIds, setPreviewShortcutIds] = React.useState<
    HomeShortcutId[] | null
  >(null);
  const previewShortcutIdsRef = React.useRef<HomeShortcutId[] | null>(null);
  // Lock native scrolling only while a card is held; auto-scroll below moves
  // the ScrollView programmatically during an active drag.
  const [cardTouched, setCardTouched] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollViewInstance>(null);
  const scrollOffsetRef = React.useRef(0);
  const activeDragScroll = React.useRef<((offset: number) => void) | null>(
    null,
  );
  const scrollContentHeight = React.useRef(0);
  const scrollViewport = React.useRef({ top: 0, height: windowSize.height });
  const dragPointerY = React.useRef<number | null>(null);
  const autoScrollFrame = React.useRef<number | null>(null);

  const stopAutoScroll = React.useCallback(() => {
    dragPointerY.current = null;
    activeDragScroll.current = null;
    if (autoScrollFrame.current !== null)
      cancelAnimationFrame(autoScrollFrame.current);
    autoScrollFrame.current = null;
  }, []);

  const autoScroll = React.useCallback(function step() {
    const pointerY = dragPointerY.current;
    if (pointerY === null) {
      autoScrollFrame.current = null;
      return;
    }
    const { top, height } = scrollViewport.current;
    const edge = Math.min(80, height / 4);
    const distanceFromTop = pointerY - top;
    const distanceFromBottom = top + height - pointerY;
    let direction = 0;
    if (distanceFromTop < edge) {
      direction = -Math.min(1, (edge - distanceFromTop) / edge);
    } else if (distanceFromBottom < edge) {
      direction = Math.min(1, (edge - distanceFromBottom) / edge);
    }
    const maxOffset = Math.max(0, scrollContentHeight.current - height);
    const nextOffset = Math.max(
      0,
      Math.min(maxOffset, scrollOffsetRef.current + direction * 14),
    );
    if (nextOffset !== scrollOffsetRef.current) {
      scrollViewRef.current?.scrollTo({ y: nextOffset, animated: false });
    }
    autoScrollFrame.current =
      direction === 0 ? null : requestAnimationFrame(step);
  }, []);

  React.useEffect(() => stopAutoScroll, [stopAutoScroll]);

  const startAutoScroll = (onScroll: (offset: number) => void) => {
    stopAutoScroll();
    activeDragScroll.current = onScroll;
    scrollViewRef.current?.measureInWindow((_, top, __, height) => {
      scrollViewport.current = { top, height };
    });
  };

  const moveAutoScroll = (pointerY: number) => {
    dragPointerY.current = pointerY;
    if (autoScrollFrame.current === null) {
      autoScrollFrame.current = requestAnimationFrame(autoScroll);
    }
  };

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
    isEditingRef.current = false;
    stopAutoScroll();
    setIsLibraryOpen(false);
    setIsEditing(false);
    setCardTouched(false);
    previewShortcutIdsRef.current = null;
    setPreviewShortcutIds(null);
  }, [stopAutoScroll]);

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
    dashboard.shortcutCatalogue.map((shortcut) => [shortcut.id, shortcut]),
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
    ? dashboard.shortcutCatalogue.filter((shortcut) =>
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
    isEditingRef.current = true;
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
        ref={scrollViewRef}
        style={{ width: windowSize.width, height: windowSize.height }}
        scrollEnabled={!cardTouched}
        scrollEventThrottle={16}
        onScroll={(event) => {
          const offset = event.nativeEvent.contentOffset.y;
          if (offset === scrollOffsetRef.current) return;
          scrollOffsetRef.current = offset;
          activeDragScroll.current?.(offset);
        }}
        onContentSizeChange={(_, height) => {
          scrollContentHeight.current = height;
        }}
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
                getScrollOffset={() => scrollOffsetRef.current}
                editing={isEditing}
                onPress={() => shortcut.action && navigateTo(shortcut.action)}
                onRemove={() => removeShortcut(shortcut.id)}
                onDragPreview={previewShortcutOrder}
                onDragStart={startAutoScroll}
                onDragPosition={moveAutoScroll}
                onDragEnd={() => {
                  stopAutoScroll();
                  const previewOrder = previewShortcutIdsRef.current;
                  if (previewOrder) shortcuts.reorderShortcuts(previewOrder);
                }}
                onDragCancel={() => {
                  stopAutoScroll();
                  if (isEditingRef.current) {
                    setPreviewOrder([...persistedVisibleShortcutIds]);
                  }
                }}
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
        catalogue={dashboard.shortcutCatalogue}
        shortcutIds={shortcuts.shortcutIds}
        addShortcut={addShortcut}
        onClose={() => setIsLibraryOpen(false)}
      />
    </View>
  );
};

export default HomePage;
