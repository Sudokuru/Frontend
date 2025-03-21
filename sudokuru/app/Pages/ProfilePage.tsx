import React from "react";
import {
  View,
  ScrollView,
  useWindowDimensions,
  ScaledSize,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { formatLessonNameArray } from "../Functions/learnedLessons";
import ProfileToggle from "../Components/Profile/ProfileToggle";
import StrategyOrder from "../Components/Profile/StrategyOrder";

const ProfilePage = () => {
  const theme = useTheme();

  const size = useWindowDimensions();

  const {
    learnedLessons,
    toggleTheme,
    darkThemeSetting,
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
          color: theme.colors.primary,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Profile
      </Text>
      <View style={{ flexDirection: profileFlexDirection(size) }}>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 20,
            margin: 20,
            minWidth: 280,
          }}
        >
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 25, color: "#025E73" }}>
              Strategies Learned:
            </Text>
            <Text
              testID="LearnedLessons"
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#D9A05B",
              }}
            >
              {formatLessonNameArray(learnedLessons)}
            </Text>
          </View>
          <ProfileToggle
            name="Theme"
            value={darkThemeSetting}
            valueToggle={toggleTheme}
            testIdPrefix="DarkTheme"
          ></ProfileToggle>
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
        </View>
        <View
          style={{
            backgroundColor: "#fff",
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
