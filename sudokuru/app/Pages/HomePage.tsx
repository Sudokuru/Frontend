import React from "react";
import { ScrollView, View } from "react-native";
import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import HomeShortcutCard from "../Components/Home/HomeShortcutCard";
import HomeShortcutLibrary from "../Components/Home/HomeShortcutLibrary";
import HomeDashboardHeader from "../Components/Home/HomeDashboardHeader";
import { useHomeDashboardData } from "../Components/Home/useHomeDashboardData";
import { useHomeDifficulty } from "../Components/Home/useHomeDifficulty";
import { useHomeShortcuts } from "../Components/Home/useHomeShortcuts";
import { useHomeShortcutCustomization } from "../Components/Home/useHomeShortcutCustomization";
import { getHomeLayout } from "../Components/Home/HomeLayout";
import type { DashboardNavigationAction } from "../Components/Home/HomeDashboard";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { useTheme } from "../Contexts/ThemeContext";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";
import { useDragAutoScroll } from "../Functions/useDragAutoScroll";

const HomePage = () => {
  const navigation: any = useNavigation();
  const { theme } = useTheme();
  const windowSize = useNewWindowDimensions();
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
  const customization = useHomeShortcutCustomization(
    dashboard.shortcutCatalogue,
    shortcuts,
  );
  const {
    scrollViewProps,
    dragProps,
    reset: resetDragScroll,
  } = useDragAutoScroll(windowSize.height, {
    onDragEnd: customization.commitDrag,
    onDragCancel: customization.cancelDrag,
  });
  const [fontsLoaded] = useFonts({ Inter_400Regular });
  const isFocused = useIsFocused();

  useFocusEffect(React.useCallback(() => resetDragScroll, [resetDragScroll]));

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
  } = getHomeLayout(windowSize, customization.selectedShortcuts.length);
  const headerHeight = customization.isEditing
    ? editingHeaderHeight
    : undefined;
  const sectionHeadingHeight = 40;

  return (
    <View
      testID={customization.isEditing ? "HomeCustomizeMode" : "HomeDashboard"}
      style={{
        width: windowSize.width,
        height: windowSize.height,
        backgroundColor: theme.colors.bg,
      }}
    >
      <ScrollView
        {...scrollViewProps}
        style={{ width: windowSize.width, height: windowSize.height }}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: outerPadding,
          paddingVertical: outerPadding,
          minHeight: windowSize.height,
        }}
      >
        <View style={{ width: contentWidth }}>
          <HomeDashboardHeader
            isEditing={customization.isEditing}
            isMobile={isMobile}
            height={headerHeight}
            heroAction={dashboard.heroAction}
            supportingResumes={dashboard.supportingResumes}
            difficulty={selectedDifficulty}
            onDifficultyChange={homeDifficulty.updateDifficulty}
            onNavigate={navigateTo}
            onReset={customization.resetShortcuts}
            onDone={customization.finishEditing}
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
              {customization.isEditing ? "Your layout" : "Your Home"}
            </Text>
            {!customization.isEditing ? (
              <Button
                testID="HomeCustomizeButton"
                compact
                icon="pencil-outline"
                textColor={theme.colors.primary}
                onPress={customization.beginEditing}
              >
                Customize home
              </Button>
            ) : (
              <Button
                testID="HomeAddShortcutButton"
                compact
                icon="plus"
                textColor={theme.colors.primary}
                onPress={customization.openLibrary}
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
            {customization.renderedShortcuts.map((shortcut) => (
              <HomeShortcutCard
                {...dragProps}
                key={shortcut.id}
                shortcut={shortcut}
                width={cardWidth}
                height={cardHeight}
                index={customization.visibleShortcutIds.indexOf(shortcut.id)}
                columns={columnCount}
                total={customization.selectedShortcuts.length}
                gap={gap}
                editing={customization.isEditing}
                onPress={() => shortcut.action && navigateTo(shortcut.action)}
                onRemove={() => customization.removeShortcut(shortcut.id)}
                onDragPreview={customization.previewShortcutOrder}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <HomeShortcutLibrary
        isLibraryOpen={customization.isLibraryOpen}
        isMobile={isMobile}
        windowSize={windowSize}
        catalogue={dashboard.shortcutCatalogue}
        shortcutIds={shortcuts.shortcutIds}
        addShortcut={customization.addShortcut}
        onClose={customization.closeLibrary}
      />
    </View>
  );
};

export default HomePage;
