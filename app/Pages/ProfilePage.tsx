import React from "react";
import { useWindowDimensions, View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { formatLessonNameArray } from "../Functions/learnedLessons";
import ProfileToggle from "../Components/Profile/ProfileToggle";

const ProfilePage = () => {
  const theme = useTheme();

  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

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

  return (
    <ScrollView>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 30,
        }}
      >
        <Text
          style={{
            fontSize: reSize / 20,
            color: theme.colors.primary,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Profile
        </Text>
        <View
          style={{ backgroundColor: "#fff", borderRadius: 10, padding: 20 }}
        >
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: reSize / 22, color: "#025E73" }}>
              Strategies Learned:
            </Text>
            <Text
              style={{
                fontSize: reSize / 40,
                fontWeight: "bold",
                color: "#D9A05B",
              }}
            >
              {formatLessonNameArray(learnedLessons)}
            </Text>
          </View>
          <ProfileToggle
            name="Theme"
            fontSize={reSize / 22}
            value={darkThemeSetting}
            valueToggle={toggleTheme}
            testIdPrefix="DarkTheme"
          ></ProfileToggle>
          <ProfileToggle
            name="Highlight Identical Values"
            fontSize={reSize / 22}
            value={highlightIdenticalValuesSetting}
            valueToggle={toggleHighlightIdenticalValues}
            testIdPrefix="HighlightIdenticalValues"
          ></ProfileToggle>
          <ProfileToggle
            name="Highlight Box"
            fontSize={reSize / 22}
            value={highlightBoxSetting}
            valueToggle={toggleHighlightBox}
            testIdPrefix="HighlightBox"
          ></ProfileToggle>
          <ProfileToggle
            name="Highlight Row"
            fontSize={reSize / 22}
            value={highlightRowSetting}
            valueToggle={toggleHighlightRow}
            testIdPrefix="HighlightRow"
          ></ProfileToggle>
          <ProfileToggle
            name="Highlight Column"
            fontSize={reSize / 22}
            value={highlightColumnSetting}
            valueToggle={toggleHighlightColumn}
            testIdPrefix="HighlightColumn"
          ></ProfileToggle>
          <ProfileToggle
            name="Feature Preview"
            fontSize={reSize / 22}
            value={featurePreviewSetting}
            valueToggle={toggleFeaturePreview}
            testIdPrefix="FeaturePreview"
          ></ProfileToggle>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
