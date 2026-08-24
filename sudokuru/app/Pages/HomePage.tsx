import React from "react";
import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Button, Surface, Text } from "react-native-paper";
import { useHomeDashboardData } from "../Components/Home/useHomeDashboardData";
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
  const isVeryShort = windowSize.height < 480;
  const isShort = windowSize.height < 620;
  const outerPadding = isVeryShort ? 6 : isShort ? 10 : isMobile ? 16 : 24;
  const sectionGap = isVeryShort ? 6 : isShort ? 10 : 16;
  const cardGap = isVeryShort ? 6 : isShort ? 8 : 12;
  const contentWidth = Math.min(
    HOME_MAX_WIDTH,
    Math.max(windowSize.width - outerPadding * 2, 0),
  );
  const [focusedAction, setFocusedAction] = React.useState<string | null>(null);

  const { featurePreviewSetting, drillModeSetting, updateCurrentPage } =
    React.useContext(PreferencesContext);
  const dashboard = useHomeDashboardData({
    featurePreview: featurePreviewSetting,
    drillMode: drillModeSetting,
  });
  const [fontsLoaded] = useFonts({ Inter_400Regular });

  const navigateTo = (action: DashboardNavigationAction) => {
    updateCurrentPage(action.currentPage);
    navigation.navigate(action.screen, action.params);
  };

  if (!fontsLoaded) {
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

  const homeActions = dashboard.config.homeActions;
  const columnCount = isMobile ? 2 : homeActions.length;
  const rowCount = Math.ceil(homeActions.length / columnCount);
  const actionSectionHeight = isMobile
    ? isVeryShort
      ? 138
      : Math.min(isShort ? 220 : 270, windowSize.height * 0.43)
    : isVeryShort
      ? 88
      : Math.min(isShort ? 128 : 176, windowSize.height * 0.29);
  const actionHeadingHeight = isVeryShort ? 18 : isShort ? 22 : 28;
  const actionCardHeight = Math.max(
    isVeryShort ? 52 : 72,
    (actionSectionHeight -
      actionHeadingHeight -
      cardGap -
      cardGap * (rowCount - 1)) /
      rowCount,
  );
  const actionCardWidth =
    (contentWidth - cardGap * (columnCount - 1)) / columnCount;
  const progressHeight = isVeryShort ? 48 : isShort ? 58 : 70;
  const availableHeroHeight =
    windowSize.height -
    outerPadding * 2 -
    sectionGap * 2 -
    actionSectionHeight -
    progressHeight;
  const heroHeight = Math.max(
    isVeryShort ? 92 : 118,
    Math.min(isMobile ? 220 : 250, availableHeroHeight),
  );
  const compactHero = heroHeight < 240;
  const showActionDescriptions = !isVeryShort && actionCardHeight >= 92;
  const statistics = dashboard.statistics;
  const progressItems = [
    {
      value: statistics ? statistics.numGamesPlayed.toString() : "-",
      label: "Solved",
      testID: "HomeProgressGamesPlayed",
    },
    {
      value:
        statistics && statistics.fastestSolveTime > 0
          ? formatTime(statistics.fastestSolveTime)
          : "-",
      label: "Best time",
      testID: "HomeProgressFastestSolveTime",
    },
    {
      value: `${dashboard.completedLessons}/${dashboard.totalLessons}`,
      label: "Lessons",
      testID: "HomeProgressLessons",
    },
  ];

  return (
    <View
      testID="HomeDashboard"
      style={{
        width: windowSize.width,
        height: windowSize.height,
        alignItems: "center",
        padding: outerPadding,
        overflow: "hidden",
        backgroundColor: theme.colors.bg,
      }}
    >
      <View
        style={{
          width: contentWidth,
          height: "100%",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: heroHeight,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ width: "100%", maxWidth: 820 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: isVeryShort ? 12 : 18,
              }}
            >
              <View
                style={{
                  width: isVeryShort ? 44 : isMobile ? 56 : 68,
                  height: isVeryShort ? 44 : isMobile ? 56 : 68,
                  flexShrink: 0,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.surfaceAlt,
                }}
              >
                <MaterialCommunityIcons
                  name="grid"
                  size={isVeryShort ? 27 : isMobile ? 34 : 42}
                  color={theme.colors.primary}
                />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                {!isVeryShort ? (
                  <Text
                    variant="labelSmall"
                    style={{
                      marginBottom: 2,
                      color: theme.colors.primary,
                      fontWeight: "800",
                      letterSpacing: 1.2,
                    }}
                  >
                    SUDOKU
                  </Text>
                ) : null}
                <Text
                  testID="HomeHeroTitle"
                  accessibilityRole="header"
                  numberOfLines={isVeryShort ? 1 : 2}
                  adjustsFontSizeToFit
                  style={{
                    color: theme.semantic.text.tertiary,
                    fontSize: isMobile
                      ? isVeryShort
                        ? 26
                        : compactHero
                          ? 32
                          : 40
                      : isVeryShort
                        ? 30
                        : compactHero
                          ? 40
                          : 56,
                    lineHeight: isMobile
                      ? isVeryShort
                        ? 29
                        : compactHero
                          ? 35
                          : 43
                      : isVeryShort
                        ? 33
                        : compactHero
                          ? 43
                          : 59,
                    fontWeight: "800",
                    letterSpacing: -1.4,
                  }}
                >
                  {dashboard.heroAction.title}
                </Text>
              </View>
            </View>
            {!compactHero && !isVeryShort ? (
              <Text
                variant="bodyLarge"
                numberOfLines={2}
                style={{
                  marginTop: 10,
                  maxWidth: 620,
                  marginLeft: isMobile ? 74 : 86,
                  color: theme.semantic.text.tertiary,
                  opacity: 0.72,
                }}
              >
                {dashboard.heroAction.description}
              </Text>
            ) : null}
            <View
              style={{
                marginTop: isVeryShort ? 6 : compactHero ? 12 : 18,
                marginLeft: isVeryShort ? 56 : isMobile ? 74 : 86,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Button
                testID="HomeHeroPrimaryButton"
                mode="contained"
                buttonColor={theme.colors.primary}
                textColor={theme.semantic.text.info}
                contentStyle={{
                  minHeight: isVeryShort ? 36 : compactHero ? 42 : 48,
                }}
                labelStyle={{ fontWeight: "800" }}
                onPress={() => navigateTo(dashboard.heroAction.action)}
              >
                {dashboard.heroAction.label}
              </Button>
              {dashboard.supportingResumes.map((resume) => (
                <Button
                  key={resume.id}
                  testID={resume.testID}
                  compact={compactHero || isVeryShort}
                  mode="outlined"
                  icon={resume.icon}
                  textColor={theme.semantic.text.tertiary}
                  style={{ borderColor: theme.colors.border }}
                  contentStyle={{
                    minHeight: isVeryShort ? 36 : compactHero ? 42 : 48,
                  }}
                  onPress={() => navigateTo(resume.action)}
                >
                  Resume drill
                </Button>
              ))}
            </View>
          </View>
        </View>

        <View style={{ height: sectionGap }} />

        <View style={{ height: actionSectionHeight }}>
          <View
            style={{
              height: actionHeadingHeight,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              accessibilityRole="header"
              variant={isShort ? "titleSmall" : "titleMedium"}
              style={{
                color: theme.semantic.text.tertiary,
                fontWeight: "800",
              }}
            >
              Sudoku puzzles and lessons
            </Text>
          </View>
          <View
            style={{
              marginTop: cardGap,
              flexDirection: "row",
              flexWrap: "wrap",
              gap: cardGap,
            }}
          >
            {homeActions.map((item, index) => {
              const disabled = item.status === "comingSoon";
              const focused = focusedAction === item.testID;
              const isLastOddMobileCard =
                isMobile &&
                homeActions.length % 2 === 1 &&
                index === homeActions.length - 1;
              return (
                <Pressable
                  key={item.id}
                  testID={item.testID}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  accessibilityHint={disabled ? item.badge : item.description}
                  accessibilityState={{ disabled }}
                  disabled={disabled}
                  onFocus={() => setFocusedAction(item.testID)}
                  onBlur={() => setFocusedAction(null)}
                  onPress={() => item.action && navigateTo(item.action)}
                  style={{
                    width: isLastOddMobileCard ? contentWidth : actionCardWidth,
                    height: actionCardHeight,
                  }}
                >
                  {({ hovered, pressed }: any) => (
                    <Surface
                      elevation={disabled ? 0 : pressed ? 1 : 2}
                      style={{
                        width: "100%",
                        height: "100%",
                        paddingHorizontal: isShort ? 12 : 16,
                        paddingVertical: isVeryShort ? 6 : isShort ? 10 : 14,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: isShort ? 10 : 14,
                        borderRadius: 12,
                        borderWidth: hovered || focused ? 2 : 1,
                        borderStyle: disabled ? "dashed" : "solid",
                        borderColor:
                          hovered || focused
                            ? theme.colors.primary
                            : theme.colors.border,
                        backgroundColor: disabled
                          ? theme.colors.bg
                          : theme.colors.surfaceAlt,
                        opacity: pressed ? 0.8 : 1,
                      }}
                    >
                      <View
                        style={{
                          width: isVeryShort ? 30 : isShort ? 36 : 42,
                          height: isVeryShort ? 30 : isShort ? 36 : 42,
                          flexShrink: 0,
                          borderRadius: isVeryShort ? 8 : 10,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: disabled
                            ? theme.colors.surfaceAlt
                            : theme.colors.bg,
                        }}
                      >
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={isVeryShort ? 18 : isShort ? 22 : 25}
                          color={theme.colors.primary}
                        />
                      </View>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        {item.badge ? (
                          <Text
                            numberOfLines={1}
                            variant="labelSmall"
                            style={{
                              marginBottom: 2,
                              color: theme.colors.primary,
                              fontWeight: "800",
                            }}
                          >
                            {item.badge.toUpperCase()}
                          </Text>
                        ) : null}
                        <Text
                          numberOfLines={1}
                          variant={isShort ? "titleSmall" : "titleMedium"}
                          style={{
                            color: disabled
                              ? theme.semantic.text.tertiary
                              : theme.semantic.text.inverse,
                            fontWeight: "800",
                          }}
                        >
                          {item.title}
                        </Text>
                        {showActionDescriptions ? (
                          <Text
                            numberOfLines={2}
                            variant="bodySmall"
                            style={{
                              marginTop: 3,
                              color: disabled
                                ? theme.semantic.text.tertiary
                                : theme.semantic.text.inverse,
                              opacity: 0.68,
                            }}
                          >
                            {item.description}
                          </Text>
                        ) : null}
                      </View>
                      {!disabled ? (
                        <MaterialCommunityIcons
                          name="arrow-right"
                          size={20}
                          color={theme.colors.primary}
                        />
                      ) : null}
                    </Surface>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ height: sectionGap }} />

        <Pressable
          testID="HomeViewStatisticsButton"
          accessibilityRole="button"
          accessibilityLabel="View statistics"
          onFocus={() => setFocusedAction("HomeViewStatisticsButton")}
          onBlur={() => setFocusedAction(null)}
          onPress={() =>
            navigateTo({
              screen: "StatisticsPage",
              currentPage: "StatisticsPage",
            })
          }
          style={{ height: progressHeight }}
        >
          {({ hovered, pressed }: any) => (
            <Surface
              testID="HomeProgressSummary"
              elevation={1}
              style={{
                height: "100%",
                paddingHorizontal: isShort ? 12 : 18,
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 12,
                borderWidth:
                  hovered || focusedAction === "HomeViewStatisticsButton"
                    ? 2
                    : 1,
                borderColor:
                  hovered || focusedAction === "HomeViewStatisticsButton"
                    ? theme.colors.primary
                    : theme.colors.border,
                backgroundColor: theme.colors.surfaceAlt,
                opacity: pressed ? 0.8 : 1,
              }}
            >
              {dashboard.isLoading && !statistics ? (
                <ActivityIndicator
                  testID="HomeLoading"
                  color={theme.colors.primary}
                  size="small"
                  style={{ marginRight: 12 }}
                />
              ) : null}
              {progressItems.map((item) => (
                <View
                  key={item.label}
                  testID={item.testID}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <Text
                    numberOfLines={1}
                    variant={isShort ? "titleSmall" : "titleMedium"}
                    style={{
                      color: theme.colors.primary,
                      fontWeight: "800",
                    }}
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
              <MaterialCommunityIcons
                name="chart-line"
                size={isShort ? 20 : 24}
                color={theme.colors.primary}
              />
            </Surface>
          )}
        </Pressable>

        {dashboard.hasError ? (
          <Button
            testID="HomeRetryButton"
            compact
            textColor={theme.colors.primary}
            style={{ position: "absolute", right: 4, top: 4 }}
            onPress={dashboard.refresh}
          >
            Retry progress
          </Button>
        ) : null}
      </View>
    </View>
  );
};

export default HomePage;
