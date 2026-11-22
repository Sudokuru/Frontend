import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import type { DashboardNavigationAction } from "../SudokuModes/SudokuModeRegistry";
import { getSudokuModeCatalogue } from "../SudokuModes/SudokuModeRegistry";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { useTheme } from "../Contexts/ThemeContext";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";
import GameModeChoices from "../Components/GameModeChoices";

/** Variant selection for one game type: only that game's variants are shown. */
const ModeVariantsPage = ({ route }: any) => {
  const navigation: any = useNavigation();
  const { theme } = useTheme();
  const { featurePreviewSetting, drillModeSetting, updateCurrentPage } =
    React.useContext(PreferencesContext);
  const windowSize = useNewWindowDimensions();
  const game = route.params?.game === "drill" ? "drill" : "play";
  const variants = getSudokuModeCatalogue({
    featurePreview: featurePreviewSetting,
    drillMode: drillModeSetting,
  }).filter((choice) => (choice.section ?? "play") === game);
  const horizontalPadding = windowSize.width < 760 ? 18 : 32;
  const isFocused = useIsFocused();

  const navigateTo = (action: DashboardNavigationAction) => {
    updateCurrentPage(action.currentPage);
    navigation.navigate(action.screen, action.params);
  };

  if (!isFocused) return <Text>Error Loading Page</Text>;

  return (
    <ScrollView
      testID="ModeVariantsPage"
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
            color: theme.semantic.text.primary,
            fontSize: windowSize.width < 760 ? 36 : 48,
            lineHeight: windowSize.width < 760 ? 40 : 52,
            fontWeight: "800",
            letterSpacing: -1.2,
          }}
        >
          {game === "drill" ? "Drill" : "Play"}
        </Text>
        {variants.length === 0 ? (
          <Text
            style={{
              marginTop: 16,
              color: theme.semantic.text.primary,
              fontSize: 18,
            }}
          >
            Enable Feature Preview and Drill Mode to practice drills.
          </Text>
        ) : (
          <GameModeChoices choices={variants} onChoose={navigateTo} />
        )}
      </View>
    </ScrollView>
  );
};

export default ModeVariantsPage;
