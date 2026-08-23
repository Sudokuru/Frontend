import React from "react";
import { Image, ScrollView, View } from "react-native";
import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Button, Surface, Text } from "react-native-paper";
import DashboardActionCard from "../Components/Home/DashboardActionCard";
import { useHomeDashboardData } from "../Components/Home/useHomeDashboardData";
import type { DashboardNavigationAction } from "../Components/SudokuBoard/SudokuBoardSharedFunctionsController";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { useTheme } from "../Contexts/ThemeContext";
import { formatTime } from "../Components/SudokuBoard/Core/Functions/BoardFunctions";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";

const HOME_MAX_WIDTH = 1180;
const HOME_MOBILE_BREAKPOINT = 760;

const HomePage = () => {
  const navigation: any = useNavigation();
  const { theme } = useTheme();
  const windowSize = useNewWindowDimensions();
  const isMobile = windowSize.width < HOME_MOBILE_BREAKPOINT;
  const horizontalPadding = isMobile ? 16 : 32;
  const contentWidth = Math.min(
    HOME_MAX_WIDTH,
    Math.max(windowSize.width - horizontalPadding * 2, 0),
  );
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [variantSectionOffset, setVariantSectionOffset] = React.useState(0);

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

  const statistics = dashboard.statistics;
  const progressItems = [
    {
      label: "Classic solved",
      value: statistics ? statistics.numGamesPlayed.toString() : "-",
      testID: "HomeProgressGamesPlayed",
    },
    {
      label: "Total score",
      value: statistics ? statistics.totalScore.toLocaleString() : "-",
      testID: "HomeProgressTotalScore",
    },
    {
      label: "Fastest solve",
      value:
        statistics && statistics.fastestSolveTime > 0
          ? formatTime(statistics.fastestSolveTime)
          : statistics
            ? "Not yet"
            : "-",
      testID: "HomeProgressFastestSolveTime",
    },
    {
      label: "Lessons complete",
      value: `${dashboard.completedLessons} / ${dashboard.totalLessons}`,
      testID: "HomeProgressLessons",
    },
  ];

  return (
    <ScrollView
      ref={scrollViewRef}
      testID="HomeDashboard"
      style={{
        width: windowSize.width,
        height: windowSize.height,
        backgroundColor: theme.colors.bg,
      }}
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: horizontalPadding,
        paddingTop: isMobile ? 16 : 28,
        paddingBottom: 56,
      }}
    >
      <View style={{ width: contentWidth }}>
        <Surface
          elevation={4}
          style={{
            minHeight: isMobile ? 360 : 390,
            borderRadius: isMobile ? 22 : 30,
            overflow: "hidden",
            backgroundColor: theme.colors.surfaceAlt,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: isMobile ? 24 : 44,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1, maxWidth: isMobile ? undefined : 710 }}>
            <Text
              variant="labelLarge"
              style={{
                color: theme.colors.primary,
                fontWeight: "800",
                letterSpacing: 1.5,
              }}
            >
              YOUR SUDOKU GURU
            </Text>
            <Text
              testID="HomeHeroTitle"
              accessibilityRole="header"
              style={{
                marginTop: 14,
                maxWidth: 680,
                color: theme.semantic.text.inverse,
                fontSize: isMobile ? 40 : 58,
                lineHeight: isMobile ? 44 : 62,
                fontWeight: "800",
                letterSpacing: -1.4,
              }}
            >
              Learn the logic. Master every grid.
            </Text>
            <Text
              variant={isMobile ? "bodyLarge" : "titleMedium"}
              style={{
                marginTop: 18,
                maxWidth: 620,
                color: theme.semantic.text.inverse,
                opacity: 0.82,
                lineHeight: isMobile ? 25 : 28,
              }}
            >
              Build techniques step by step, practice the patterns, and find the
              puzzle that fits your pace.
            </Text>
            <View
              style={{
                marginTop: 28,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <Button
                testID="HomeHeroPrimaryButton"
                mode="contained"
                buttonColor={theme.colors.primary}
                textColor={theme.semantic.text.info}
                contentStyle={{ minHeight: 48 }}
                labelStyle={{ fontWeight: "800" }}
                onPress={() => navigateTo(dashboard.heroAction.action)}
              >
                {dashboard.heroAction.label}
              </Button>
              <Button
                testID="HomeExploreVariantsButton"
                mode="outlined"
                textColor={theme.semantic.text.inverse}
                style={{ borderColor: theme.colors.primary }}
                contentStyle={{ minHeight: 48 }}
                labelStyle={{ fontWeight: "700" }}
                onPress={() =>
                  scrollViewRef.current?.scrollTo({
                    y: Math.max(variantSectionOffset - 16, 0),
                    animated: true,
                  })
                }
              >
                Explore variants
              </Button>
            </View>
          </View>
          {!isMobile ? (
            <View
              style={{
                flex: 1,
                minWidth: 250,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 270,
                  height: 270,
                  borderRadius: 135,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.bg,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Image
                  accessible={false}
                  source={require("../../.assets/goldLogoNoText.png")}
                  style={{ width: 190, height: 190, resizeMode: "contain" }}
                />
              </View>
            </View>
          ) : null}
        </Surface>

        <View style={{ marginTop: 38 }}>
          <Text
            accessibilityRole="header"
            variant="headlineMedium"
            style={{
              color: theme.semantic.text.primary,
              fontWeight: "800",
            }}
          >
            Continue
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              marginTop: 4,
              color: theme.semantic.text.tertiary,
              opacity: 0.82,
            }}
          >
            Pick up where you left off.
          </Text>
          {dashboard.isLoading && dashboard.resumes.length === 0 ? (
            <Surface
              style={{
                marginTop: 16,
                minHeight: 112,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.surfaceAlt,
              }}
            >
              <ActivityIndicator
                testID="HomeLoading"
                color={theme.colors.primary}
              />
            </Surface>
          ) : dashboard.resumes.length > 0 ? (
            <View
              style={{
                marginTop: 16,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              {dashboard.resumes.map((resume) => (
                <View
                  key={resume.id}
                  style={{
                    flexGrow: 1,
                    flexBasis: isMobile ? "100%" : 320,
                    minWidth: isMobile ? undefined : 280,
                  }}
                >
                  <DashboardActionCard
                    title={resume.title}
                    description={resume.description}
                    icon={resume.icon}
                    metadata={`${resume.metadata} elapsed`}
                    testID={resume.testID}
                    onPress={() => navigateTo(resume.action)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <Surface
              testID="HomeEmptyResumeState"
              elevation={1}
              style={{
                marginTop: 16,
                minHeight: 112,
                borderRadius: 18,
                padding: 22,
                justifyContent: "center",
                backgroundColor: theme.colors.surfaceAlt,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <Text
                variant="titleMedium"
                style={{
                  color: theme.semantic.text.inverse,
                  fontWeight: "700",
                }}
              >
                Ready for a fresh grid?
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  marginTop: 4,
                  color: theme.semantic.text.inverse,
                  opacity: 0.75,
                }}
              >
                Choose Classic Sudoku below and find your next challenge.
              </Text>
            </Surface>
          )}
        </View>

        <View
          onLayout={(event) =>
            setVariantSectionOffset(event.nativeEvent.layout.y)
          }
          style={{ marginTop: 38 }}
        >
          <Text
            accessibilityRole="header"
            variant="headlineMedium"
            style={{
              color: theme.semantic.text.primary,
              fontWeight: "800",
            }}
          >
            Explore variants
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              marginTop: 4,
              color: theme.semantic.text.tertiary,
              opacity: 0.82,
            }}
          >
            Start with the classic, with new ways to play on the horizon.
          </Text>
          <View
            style={{
              marginTop: 16,
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {dashboard.config.variants.map((variant) => (
              <View
                key={variant.id}
                style={{
                  flexGrow: 1,
                  flexBasis: isMobile ? "100%" : 320,
                  minWidth: isMobile ? undefined : 280,
                }}
              >
                <DashboardActionCard
                  title={variant.title}
                  description={variant.description}
                  icon={variant.icon}
                  badge={variant.badge}
                  testID={variant.testID}
                  disabled={variant.status === "comingSoon"}
                  onPress={
                    variant.action
                      ? () => navigateTo(variant.action!)
                      : undefined
                  }
                />
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 38 }}>
          <Text
            accessibilityRole="header"
            variant="headlineMedium"
            style={{
              color: theme.semantic.text.primary,
              fontWeight: "800",
            }}
          >
            Improve your skills
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              marginTop: 4,
              color: theme.semantic.text.tertiary,
              opacity: 0.82,
            }}
          >
            Learn the strategy, then put it into practice.
          </Text>
          <View
            style={{
              marginTop: 16,
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {dashboard.config.skills.map((skill) => (
              <View
                key={skill.id}
                style={{
                  flexGrow: 1,
                  flexBasis: isMobile ? "100%" : 320,
                  minWidth: isMobile ? undefined : 280,
                }}
              >
                <DashboardActionCard
                  title={skill.title}
                  description={skill.description}
                  icon={skill.icon}
                  badge={skill.badge}
                  testID={skill.testID}
                  onPress={
                    skill.action ? () => navigateTo(skill.action!) : undefined
                  }
                />
              </View>
            ))}
          </View>
        </View>

        <Surface
          testID="HomeProgressSummary"
          elevation={3}
          style={{
            marginTop: 38,
            borderRadius: 22,
            padding: isMobile ? 22 : 28,
            backgroundColor: theme.colors.surfaceAlt,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View>
              <Text
                accessibilityRole="header"
                variant="headlineSmall"
                style={{
                  color: theme.semantic.text.inverse,
                  fontWeight: "800",
                }}
              >
                Your progress
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  marginTop: 3,
                  color: theme.semantic.text.inverse,
                  opacity: 0.72,
                }}
              >
                A quick look at how far you have come.
              </Text>
            </View>
            <Button
              testID="HomeViewStatisticsButton"
              mode="outlined"
              textColor={theme.semantic.text.inverse}
              style={{ borderColor: theme.colors.primary }}
              onPress={() =>
                navigateTo({
                  screen: "StatisticsPage",
                  currentPage: "StatisticsPage",
                })
              }
            >
              View statistics
            </Button>
          </View>
          <View
            style={{
              marginTop: 24,
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {progressItems.map((item) => (
              <View
                key={item.label}
                testID={item.testID}
                style={{
                  flexGrow: 1,
                  flexBasis: isMobile ? 140 : 200,
                  minHeight: 94,
                  borderRadius: 14,
                  padding: 16,
                  justifyContent: "center",
                  backgroundColor: theme.colors.bg,
                }}
              >
                <Text
                  variant="headlineSmall"
                  style={{
                    color: theme.colors.primary,
                    fontWeight: "800",
                  }}
                >
                  {item.value}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{
                    marginTop: 3,
                    color: theme.semantic.text.tertiary,
                  }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
          {dashboard.hasError ? (
            <View
              testID="HomeError"
              accessibilityLiveRegion="polite"
              style={{
                marginTop: 18,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text
                variant="bodyMedium"
                style={{ color: theme.semantic.text.inverse }}
              >
                Some progress could not be loaded.
              </Text>
              <Button
                testID="HomeRetryButton"
                compact
                textColor={theme.colors.primary}
                onPress={dashboard.refresh}
              >
                Retry
              </Button>
            </View>
          ) : null}
        </Surface>
      </View>
    </ScrollView>
  );
};

export default HomePage;
