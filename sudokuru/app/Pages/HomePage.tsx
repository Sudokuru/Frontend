import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Button, Surface, Text } from "react-native-paper";
import HomePuzzleArtwork from "../Components/Home/HomePuzzleArtwork";
import { useHomeDashboardData } from "../Components/Home/useHomeDashboardData";
import type {
  DashboardNavigationAction,
  HomeDashboardIcon,
} from "../Components/SudokuBoard/SudokuBoardSharedFunctionsController";
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
  const horizontalPadding = isMobile ? 20 : 40;
  const contentWidth = Math.min(
    HOME_MAX_WIDTH,
    Math.max(windowSize.width - horizontalPadding * 2, 0),
  );
  const artworkSize = isMobile
    ? Math.min(330, Math.max(contentWidth - 8, 210))
    : Math.min(390, contentWidth * 0.38);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [variantSectionOffset, setVariantSectionOffset] = React.useState(0);
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

  const statistics = dashboard.statistics;
  const progressItems = [
    {
      value: statistics ? statistics.numGamesPlayed.toString() : "-",
      label: "Classic puzzles solved",
      testID: "HomeProgressGamesPlayed",
    },
    {
      value:
        statistics && statistics.fastestSolveTime > 0
          ? formatTime(statistics.fastestSolveTime)
          : statistics
            ? "Not yet"
            : "-",
      label: "Fastest solve",
      testID: "HomeProgressFastestSolveTime",
    },
    {
      value: `${dashboard.completedLessons} / ${dashboard.totalLessons}`,
      label: "Lessons complete",
      testID: "HomeProgressLessons",
    },
  ];
  const utilityActions: {
    id: string;
    title: string;
    description: string;
    icon: HomeDashboardIcon | "chart-line";
    testID: string;
    action: DashboardNavigationAction;
  }[] = [
    ...dashboard.config.skills.flatMap((skill) =>
      skill.action
        ? [
            {
              id: skill.id,
              title: skill.title,
              description: skill.description,
              icon: skill.icon,
              testID: skill.testID,
              action: skill.action,
            },
          ]
        : [],
    ),
    {
      id: "statistics",
      title: "See Your Progress",
      description: "Review your scores, solve times, hints, and mistakes.",
      icon: "chart-line",
      testID: "HomeViewStatisticsButton",
      action: {
        screen: "StatisticsPage",
        currentPage: "StatisticsPage",
      },
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
        paddingBottom: 64,
      }}
    >
      <View style={{ width: contentWidth }}>
        <View
          style={{
            minHeight: isMobile ? undefined : 570,
            paddingVertical: isMobile ? 36 : 48,
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            gap: isMobile ? 46 : 62,
          }}
        >
          <View style={{ flex: isMobile ? undefined : 1, width: "100%" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 3,
                  backgroundColor: theme.colors.primary,
                }}
              />
              <Text
                variant="labelLarge"
                style={{
                  color: theme.colors.primary,
                  fontWeight: "800",
                  letterSpacing: 1.4,
                }}
              >
                THINK IN PATTERNS
              </Text>
            </View>
            <Text
              testID="HomeHeroTitle"
              accessibilityRole="header"
              style={{
                marginTop: 20,
                maxWidth: 630,
                color: theme.semantic.text.tertiary,
                fontSize: isMobile ? 46 : 68,
                lineHeight: isMobile ? 49 : 70,
                fontWeight: "800",
                letterSpacing: isMobile ? -1.5 : -2.5,
              }}
            >
              Learn the pattern.{"\n"}
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: isMobile ? 46 : 68,
                  lineHeight: isMobile ? 49 : 70,
                  fontWeight: "800",
                  letterSpacing: isMobile ? -1.5 : -2.5,
                }}
              >
                Solve with purpose.
              </Text>
            </Text>
            <Text
              variant={isMobile ? "bodyLarge" : "titleMedium"}
              style={{
                marginTop: 22,
                maxWidth: 560,
                color: theme.semantic.text.tertiary,
                opacity: 0.78,
                lineHeight: isMobile ? 26 : 29,
              }}
            >
              Guided lessons when you want to learn. Thoughtful hints when you
              get stuck. A clean grid when you are ready to solve.
            </Text>
            <View
              style={{
                marginTop: 30,
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
                contentStyle={{ minHeight: 52, paddingHorizontal: 8 }}
                labelStyle={{ fontWeight: "800", fontSize: 15 }}
                onPress={() => navigateTo(dashboard.heroAction.action)}
              >
                {dashboard.heroAction.label}
              </Button>
              <Button
                testID="HomeExploreVariantsButton"
                mode="text"
                icon="arrow-down"
                textColor={theme.semantic.text.tertiary}
                contentStyle={{ minHeight: 52 }}
                labelStyle={{ fontWeight: "700" }}
                onPress={() =>
                  scrollViewRef.current?.scrollTo({
                    y: Math.max(variantSectionOffset - 20, 0),
                    animated: true,
                  })
                }
              >
                Choose a grid
              </Button>
            </View>
          </View>
          <HomePuzzleArtwork size={artworkSize} />
        </View>

        {dashboard.supportingResumes.length > 0 ? (
          <View style={{ marginBottom: 34 }}>
            <Text
              variant="labelMedium"
              style={{
                color: theme.colors.primary,
                fontWeight: "800",
                letterSpacing: 1.1,
              }}
            >
              STILL IN PROGRESS
            </Text>
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {dashboard.supportingResumes.map((resume) => (
                <Pressable
                  key={resume.id}
                  testID={resume.testID}
                  accessibilityRole="button"
                  accessibilityLabel={`Resume ${resume.title}`}
                  onPress={() => navigateTo(resume.action)}
                  onFocus={() => setFocusedAction(resume.testID)}
                  onBlur={() => setFocusedAction(null)}
                >
                  {({ hovered, pressed }: any) => (
                    <View
                      style={{
                        minHeight: 52,
                        paddingHorizontal: 16,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        borderRadius: 999,
                        borderWidth: focusedAction === resume.testID ? 2 : 1,
                        borderColor:
                          hovered || focusedAction === resume.testID
                            ? theme.colors.primary
                            : theme.colors.border,
                        backgroundColor: theme.colors.surfaceAlt,
                        opacity: pressed ? 0.78 : 1,
                      }}
                    >
                      <MaterialCommunityIcons
                        name={resume.icon}
                        size={20}
                        color={theme.colors.primary}
                      />
                      <Text
                        variant="labelLarge"
                        style={{ color: theme.semantic.text.inverse }}
                      >
                        Resume {resume.description}
                      </Text>
                      <Text
                        variant="labelMedium"
                        style={{ color: theme.colors.primary }}
                      >
                        {resume.metadata}
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        <View
          testID="HomeProgressSummary"
          style={{
            paddingVertical: 22,
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: theme.colors.border,
            rowGap: 20,
          }}
        >
          {dashboard.isLoading && !statistics ? (
            <ActivityIndicator
              testID="HomeLoading"
              color={theme.colors.primary}
              style={{ marginRight: 24 }}
            />
          ) : null}
          {progressItems.map((item) => (
            <View
              key={item.label}
              testID={item.testID}
              style={{
                minWidth: isMobile ? "50%" : 190,
                flexGrow: 1,
                paddingRight: 24,
              }}
            >
              <Text
                variant="titleLarge"
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
                  marginTop: 2,
                  color: theme.semantic.text.tertiary,
                  opacity: 0.76,
                }}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <View
          onLayout={(event) =>
            setVariantSectionOffset(event.nativeEvent.layout.y)
          }
          style={{ paddingTop: isMobile ? 54 : 72 }}
        >
          <Text
            variant="labelLarge"
            style={{
              color: theme.colors.primary,
              fontWeight: "800",
              letterSpacing: 1.2,
            }}
          >
            WAYS TO PLAY
          </Text>
          <Text
            accessibilityRole="header"
            style={{
              marginTop: 8,
              color: theme.semantic.text.tertiary,
              fontSize: isMobile ? 34 : 44,
              lineHeight: isMobile ? 39 : 49,
              fontWeight: "800",
              letterSpacing: -1,
            }}
          >
            Choose your kind of challenge.
          </Text>
          <View
            style={{
              marginTop: 26,
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 18,
            }}
          >
            {dashboard.config.variants.map((variant) => {
              const disabled = variant.status === "comingSoon";
              const focused = focusedAction === variant.testID;
              return (
                <Pressable
                  key={variant.id}
                  testID={variant.testID}
                  accessibilityRole="button"
                  accessibilityLabel={variant.title}
                  accessibilityHint={
                    disabled ? variant.badge : variant.description
                  }
                  accessibilityState={{ disabled }}
                  disabled={disabled}
                  onFocus={() => setFocusedAction(variant.testID)}
                  onBlur={() => setFocusedAction(null)}
                  onPress={() => variant.action && navigateTo(variant.action)}
                  style={{
                    flexGrow: 1,
                    flexBasis: isMobile ? "100%" : 360,
                  }}
                >
                  {({ hovered, pressed }: any) => (
                    <Surface
                      elevation={disabled ? 0 : pressed ? 1 : 3}
                      style={{
                        minHeight: isMobile ? 210 : 240,
                        padding: isMobile ? 24 : 30,
                        justifyContent: "space-between",
                        borderRadius: 10,
                        borderWidth: focused || hovered ? 3 : 1,
                        borderStyle: disabled ? "dashed" : "solid",
                        borderColor:
                          focused || hovered
                            ? theme.colors.primary
                            : theme.colors.border,
                        backgroundColor: disabled
                          ? theme.colors.bg
                          : theme.colors.surfaceAlt,
                        opacity: pressed ? 0.84 : 1,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <MaterialCommunityIcons
                          name={variant.icon}
                          size={40}
                          color={theme.colors.primary}
                        />
                        {variant.badge ? (
                          <Text
                            variant="labelMedium"
                            style={{
                              color: theme.colors.primary,
                              fontWeight: "800",
                              letterSpacing: 0.8,
                            }}
                          >
                            {variant.badge.toUpperCase()}
                          </Text>
                        ) : (
                          <MaterialCommunityIcons
                            name="arrow-top-right"
                            size={26}
                            color={theme.colors.primary}
                          />
                        )}
                      </View>
                      <View>
                        <Text
                          style={{
                            color: disabled
                              ? theme.semantic.text.tertiary
                              : theme.semantic.text.inverse,
                            fontSize: isMobile ? 28 : 34,
                            lineHeight: isMobile ? 32 : 38,
                            fontWeight: "800",
                          }}
                        >
                          {variant.title}
                        </Text>
                        <Text
                          variant="bodyLarge"
                          style={{
                            marginTop: 8,
                            maxWidth: 430,
                            color: disabled
                              ? theme.semantic.text.tertiary
                              : theme.semantic.text.inverse,
                            opacity: 0.72,
                          }}
                        >
                          {variant.description}
                        </Text>
                      </View>
                    </Surface>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ paddingTop: isMobile ? 54 : 72 }}>
          <Text
            variant="labelLarge"
            style={{
              color: theme.colors.primary,
              fontWeight: "800",
              letterSpacing: 1.2,
            }}
          >
            YOUR TOOLKIT
          </Text>
          <Text
            accessibilityRole="header"
            style={{
              marginTop: 8,
              color: theme.semantic.text.tertiary,
              fontSize: isMobile ? 34 : 44,
              lineHeight: isMobile ? 39 : 49,
              fontWeight: "800",
              letterSpacing: -1,
            }}
          >
            More than a blank grid.
          </Text>
          <Surface
            elevation={2}
            style={{
              marginTop: 26,
              overflow: "hidden",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surfaceAlt,
            }}
          >
            {utilityActions.map((item, index) => (
              <Pressable
                key={item.id}
                testID={item.testID}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                accessibilityHint={item.description}
                onFocus={() => setFocusedAction(item.testID)}
                onBlur={() => setFocusedAction(null)}
                onPress={() => navigateTo(item.action)}
              >
                {({ hovered, pressed }: any) => (
                  <View
                    style={{
                      minHeight: isMobile ? 104 : 92,
                      paddingHorizontal: isMobile ? 20 : 28,
                      paddingVertical: 18,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 18,
                      borderTopWidth: index === 0 ? 0 : 1,
                      borderColor: theme.colors.border,
                      backgroundColor:
                        hovered || focusedAction === item.testID
                          ? theme.colors.bg
                          : theme.colors.surfaceAlt,
                      opacity: pressed ? 0.78 : 1,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={28}
                      color={theme.colors.primary}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        variant="titleMedium"
                        style={{
                          color: theme.semantic.text.inverse,
                          fontWeight: "800",
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        variant="bodyMedium"
                        style={{
                          marginTop: 3,
                          color: theme.semantic.text.inverse,
                          opacity: 0.68,
                        }}
                      >
                        {item.description}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={24}
                      color={theme.colors.primary}
                    />
                  </View>
                )}
              </Pressable>
            ))}
          </Surface>
        </View>

        {dashboard.hasError ? (
          <View
            testID="HomeError"
            accessibilityLiveRegion="polite"
            style={{
              marginTop: 24,
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text
              variant="bodyMedium"
              style={{ color: theme.semantic.text.tertiary }}
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
      </View>
    </ScrollView>
  );
};

export default HomePage;
