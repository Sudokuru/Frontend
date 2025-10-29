import React from "react";
import { View } from "react-native";
import { Chip, Text } from "react-native-paper";
import { formatLessonNameArray } from "../../Functions/learnedLessons";
import ProfileToggle from "./ProfileToggle";
import StrategyOrder from "./StrategyOrder";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import { calculateCardsPerRow } from "../Home/Cards";
import { useTheme } from "../../Contexts/ThemeContext";
import { THEME_OPTIONS } from "../../Styling/theme";

const ProfilePanel = (props: any) => {
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

  const { theme, themeName, setTheme } = useTheme();

  let paneArray = [];

  // App Theme Pane
  paneArray.push(
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 10,
        padding: 20,
        margin: 20,
        minWidth: 280,
      }}
    >
      <Text style={{ fontSize: 25, color: theme.semantic.text.quaternary }}>
        App Theme:
      </Text>
      {THEME_OPTIONS.map(({ key, label, theme }) => (
        <Chip
          key={key}
          selected={key === themeName}
          onPress={() => setTheme(key)}
          style={{
            paddingVertical: 6,
            marginVertical: 8,
            borderColor: theme.semantic.text.primary,
            borderRadius: 16,
            borderWidth: key === themeName ? 4 : 2,
            backgroundColor: theme.colors.bg,
          }}
          textStyle={{
            fontSize: 16,
            color: theme.semantic.text.primary,
            fontWeight: key === themeName ? 700 : 400,
          }}
        >
          {label}
        </Chip>
      ))}
    </View>,
  );

  // Strategies/Highlight/Progress/Feature Preview Pane
  paneArray.push(
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
        <Text style={{ fontSize: 25, color: theme.semantic.text.quaternary }}>
          Strategies Learned:
        </Text>
        <Text
          testID="LearnedLessons"
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: theme.semantic.text.primary,
          }}
        >
          {formatLessonNameArray(learnedLessons)}
        </Text>
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
    </View>,
  );

  // Strategy Hint Order Pane
  paneArray.push(
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
    </View>,
  );

  let displayPaneArray = [];
  let subArray = [];
  let columnCount: number = calculateCardsPerRow(
    props.width,
    props.height,
    paneArray.length,
    280,
  );
  for (let i = 0; i < paneArray.length; i++) {
    subArray.push(paneArray[i]);
    // Add row
    if ((i + 1) % columnCount === 0) {
      displayPaneArray.push(subArray);
      subArray = [];
    }
  }
  // Add last row if not evenly divisible
  if (subArray.length > 0) {
    displayPaneArray.push(subArray);
  }

  // render each sub-array as a row
  return (
    <View style={{ flexWrap: "wrap", flexDirection: "column" }}>
      {displayPaneArray.map((subArray, index) => (
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
          }}
          key={index}
        >
          {subArray}
        </View>
      ))}
    </View>
  );
};

export default ProfilePanel;
