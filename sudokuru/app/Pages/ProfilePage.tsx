import React from "react";
import {
  View,
  ScrollView,
  useWindowDimensions,
  ScaledSize,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { useTheme as useAppTheme } from "../Contexts/ThemeContext";
import { ThemeName } from "../Styling/theme";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { formatLessonNameArray } from "../Functions/learnedLessons";
import ProfileToggle from "../Components/Profile/ProfileToggle";
import StrategyOrder from "../Components/Profile/StrategyOrder";

const ProfilePage = () => {
  const { theme, themeName, setTheme } = useAppTheme();

  const size = useWindowDimensions();

  const {
    learnedLessons,
    toggleHighlightIdenticalValues,
    highlightIdenticalValuesSetting,
    highlightBoxSetting,
    toggleHighlightBox,
    toggleHighlightColumn,
    highlightColumnSetting,
    toggleHighlightRow,
    highlightRowSetting,
    progressIndicatorSetting,
    toggleProgressIndicator,
    initializeNotesSetting,
    toggleInitializeNotes,
    simplifyNotesSetting,
    toggleSimplifyNotes,
    toggleFeaturePreview,
    featurePreviewSetting,
  } = React.useContext(PreferencesContext);

  const highlightMode = () => {
    return (
      highlightIdenticalValuesSetting &&
      highlightBoxSetting &&
      highlightColumnSetting &&
      highlightRowSetting
    );
  };

  const setAllHighlights = (mode: boolean) => {
    if (mode !== highlightIdenticalValuesSetting) {
      toggleHighlightIdenticalValues();
    }
    if (mode !== highlightBoxSetting) {
      toggleHighlightBox();
    }
    if (mode !== highlightColumnSetting) {
      toggleHighlightColumn();
    }
    if (mode !== highlightRowSetting) {
      toggleHighlightRow();
    }
  };

  // This determines the minimum width
  // To render all profile components horizontally instead of vertically
  const PROFILE_COMPONENTS_WIDTH = 600;

  const profileFlexDirection = (size: ScaledSize) => {
    if (size.width > PROFILE_COMPONENTS_WIDTH) {
      return "row";
    } else {
      return "column";
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
    >
      <Text
        style={{
          fontSize: 40,
          color: theme.colors.accent,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Profile
      </Text>
      <View style={{ flexDirection: profileFlexDirection(size) }}>
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 10,
            padding: 20,
            margin: 20,
            minWidth: 280,
          }}
        >
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 25, color: theme.colors.text }}>
              Strategies Learned:
            </Text>
            <Text
              testID="LearnedLessons"
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: theme.colors.accent,
              }}
            >
              {formatLessonNameArray(learnedLessons)}
            </Text>
          </View>
          <View
            style={{
              marginBottom: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 25, color: theme.colors.text }}>
              Theme: {themeName}
            </Text>
            <Button
              mode="contained"
              buttonColor={theme.colors.accent}
              textColor={theme.colors.text}
              onPress={() => {
                const names: ThemeName[] = ["classic", "light", "dark"];
                const next =
                  names[(names.indexOf(themeName) + 1) % names.length];
                setTheme(next);
              }}
              testID="ThemeToggle"
            >
              Change
            </Button>
          </View>
          <ProfileToggle
            name="Highlight"
            value={highlightMode()}
            valueToggle={setAllHighlights}
            testIdPrefix="Highlight"
          ></ProfileToggle>
          <ProfileToggle
            name="  Identical Values"
            value={highlightIdenticalValuesSetting}
            valueToggle={toggleHighlightIdenticalValues}
            testIdPrefix="HighlightIdenticalValues"
          ></ProfileToggle>
          <ProfileToggle
            name="  Box"
            value={highlightBoxSetting}
            valueToggle={toggleHighlightBox}
            testIdPrefix="HighlightBox"
          ></ProfileToggle>
          <ProfileToggle
            name="  Row"
            value={highlightRowSetting}
            valueToggle={toggleHighlightRow}
            testIdPrefix="HighlightRow"
          ></ProfileToggle>
          <ProfileToggle
            name="  Column"
            value={highlightColumnSetting}
            valueToggle={toggleHighlightColumn}
            testIdPrefix="HighlightColumn"
          ></ProfileToggle>
          <ProfileToggle
            name="Progress Indicator"
            value={progressIndicatorSetting}
            valueToggle={toggleProgressIndicator}
            testIdPrefix="ProgressIndicator"
          ></ProfileToggle>
          <ProfileToggle
            name="Feature Preview"
            value={featurePreviewSetting}
            valueToggle={toggleFeaturePreview}
            testIdPrefix="FeaturePreview"
          ></ProfileToggle>
          {/* Initialize Notes is in feature preview as it's a new feature 
            that may affect game statistics and difficulty perception */}
          {featurePreviewSetting && (
            <ProfileToggle
              name="  Initialize Notes"
              value={initializeNotesSetting}
              valueToggle={toggleInitializeNotes}
              testIdPrefix="InitializeNotes"
            ></ProfileToggle>
          )}
          {/* Simplify Notes is in feature preview as it's a new feature 
            that may affect game statistics and difficulty perception */}
          {featurePreviewSetting && (
            <ProfileToggle
              name="  Simplify Notes"
              value={simplifyNotesSetting}
              valueToggle={toggleSimplifyNotes}
              testIdPrefix="SimplifyNotes"
            ></ProfileToggle>
          )}
        </View>
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 10,
            padding: 20,
            margin: 20,
            minWidth: 280,
          }}
        >
          <StrategyOrder></StrategyOrder>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
