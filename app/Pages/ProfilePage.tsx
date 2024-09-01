import React from "react";
import { View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { formatLessonNameArray } from "../Functions/learnedLessons";
import ProfileToggle from "../Components/Profile/ProfileToggle";
import StrategyOrder from "../Components/Profile/StrategyOrder";

const ProfilePage = () => {
  const theme = useTheme();

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
      <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 20 }}>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 25, color: "#025E73" }}>
            Strategies Learned:
          </Text>
          <Text
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
          name="Feature Preview"
          value={featurePreviewSetting}
          valueToggle={toggleFeaturePreview}
          testIdPrefix="FeaturePreview"
        ></ProfileToggle>
        {featurePreviewSetting ? <StrategyOrder></StrategyOrder> : <></>}
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
