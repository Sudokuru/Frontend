import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Surface, Text } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import type {
  DashboardNavigationAction,
  SudokuModeCardDescriptor,
} from "../SudokuModes/SudokuModeRegistry";
import { getSudokuModeCatalogue } from "../SudokuModes/SudokuModeRegistry";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { useTheme } from "../Contexts/ThemeContext";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";

const PlayModesPage = () => {
  const navigation: any = useNavigation();
  const { theme } = useTheme();
  const cardSurfaceColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const cardTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.quaternary;
  const { featurePreviewSetting, drillModeSetting, updateCurrentPage } =
    React.useContext(PreferencesContext);
  const windowSize = useNewWindowDimensions();
  const [focusedChoice, setFocusedChoice] = React.useState<string | null>(null);
  const variants = getSudokuModeCatalogue({
    featurePreview: featurePreviewSetting,
    drillMode: drillModeSetting,
  });
  const horizontalPadding = windowSize.width < 760 ? 18 : 32;
  const isFocused = useIsFocused();

  const navigateTo = (action: DashboardNavigationAction) => {
    updateCurrentPage(action.currentPage);
    navigation.navigate(action.screen, action.params);
  };

  if (!isFocused) return <Text>Error Loading Page</Text>;

  const renderChoices = (choices: SudokuModeCardDescriptor[]) => (
    <Surface
      elevation={2}
      style={{
        marginTop: 12,
        overflow: "hidden",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: cardSurfaceColor,
      }}
    >
      {choices.map((choice, index) => {
        const disabled = choice.status === "comingSoon";
        const focused = focusedChoice === choice.id;
        return (
          <Pressable
            key={choice.id}
            testID={choice.testID}
            accessibilityRole="button"
            accessibilityLabel={choice.title}
            accessibilityHint={disabled ? choice.badge : choice.description}
            accessibilityState={{ disabled }}
            disabled={disabled}
            onFocus={() => setFocusedChoice(choice.id)}
            onBlur={() => setFocusedChoice(null)}
            onPress={() => choice.action && navigateTo(choice.action)}
          >
            {({ hovered, pressed }: any) => (
              <View
                style={{
                  minHeight: 84,
                  paddingHorizontal: 18,
                  paddingVertical: 13,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderLeftWidth: focused ? 4 : 0,
                  borderColor: theme.colors.border,
                  backgroundColor:
                    hovered || focused ? theme.colors.bg : cardSurfaceColor,
                  opacity: disabled ? 0.68 : pressed ? 0.8 : 1,
                }}
              >
                <MaterialCommunityIcons
                  name={choice.icon}
                  size={28}
                  color={theme.colors.primary}
                />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    variant="titleMedium"
                    style={{
                      color: cardTextColor,
                      fontWeight: "800",
                    }}
                  >
                    {choice.title}
                  </Text>
                  <Text
                    numberOfLines={2}
                    variant="bodyMedium"
                    style={{
                      marginTop: 3,
                      color: cardTextColor,
                      opacity: 0.68,
                    }}
                  >
                    {choice.description}
                  </Text>
                </View>
                {choice.badge ? (
                  <Text
                    variant="labelSmall"
                    style={{
                      color: theme.colors.primary,
                      fontWeight: "800",
                    }}
                  >
                    {choice.badge.toUpperCase()}
                  </Text>
                ) : (
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={22}
                    color={theme.colors.primary}
                  />
                )}
              </View>
            )}
          </Pressable>
        );
      })}
    </Surface>
  );

  return (
    <ScrollView
      testID="PlayModesPage"
      style={{
        width: windowSize.width,
        height: windowSize.height,
        backgroundColor: theme.colors.bg,
      }}
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: horizontalPadding,
        paddingTop: 24,
        paddingBottom: 44,
      }}
    >
      <View style={{ width: "100%", maxWidth: 860 }}>
        <Text
          accessibilityRole="header"
          style={{
            color: theme.semantic.text.tertiary,
            fontSize: windowSize.width < 760 ? 36 : 48,
            lineHeight: windowSize.width < 760 ? 40 : 52,
            fontWeight: "800",
            letterSpacing: -1.2,
          }}
        >
          Choose a game
        </Text>
        <Text
          accessibilityRole="header"
          variant="titleLarge"
          style={{
            marginTop: 24,
            color: theme.semantic.text.tertiary,
            fontWeight: "800",
          }}
        >
          Sudoku variants
        </Text>
        {renderChoices(variants)}
      </View>
    </ScrollView>
  );
};

export default PlayModesPage;
