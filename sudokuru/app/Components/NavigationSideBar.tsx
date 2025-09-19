import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "react-native-paper";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { safeNavigate } from "../Navigation/navigation";

const NavigationSideBar = (props: any) => {
  const navigation: any = useNavigation();

  const { currentPage, updateCurrentPage, featurePreviewSetting } =
    React.useContext(PreferencesContext);

  return (
    <Drawer.Section showDivider={false}>
      <Drawer.Item
        icon={"menu"}
        testID="CloseDrawerNavigation"
        label="Close"
        active={false}
        onPress={() => {
          props.navigation.closeDrawer();
        }}
      />
      <Drawer.Item
        icon={"home"}
        testID="HomeButton"
        label="Home"
        active={currentPage === "HomePage"}
        onPress={() => {
          updateCurrentPage("HomePage");
          safeNavigate("HomePage");
        }}
      />
      <Drawer.Item
        icon={"book-open-page-variant"}
        testID="LearnButton"
        label="Learn"
        active={currentPage === "LearnPage"}
        onPress={() => {
          updateCurrentPage("LearnPage");
          safeNavigate("LearnPage");
        }}
      />
      {featurePreviewSetting && (
        <Drawer.Item
          icon={"whistle"}
          testID="DrillButton"
          label="Drill"
          active={currentPage === "DrillPage"}
          onPress={() => {
            updateCurrentPage("DrillPage");
            safeNavigate("DrillPage");
          }}
        />
      )}
      <Drawer.Item
        icon={"play"}
        testID="PlayButton"
        label="Play"
        active={currentPage === "PlayPage"}
        onPress={() => {
          updateCurrentPage("PlayPage");
          safeNavigate("PlayPage");
        }}
      />
      <Drawer.Item
        icon={"badge-account-horizontal"}
        testID="AboutUsButton"
        label="About Us"
        active={currentPage === "AboutUsPage"}
        onPress={() => {
          updateCurrentPage("AboutUsPage");
          safeNavigate("AboutUsPage");
        }}
      />
      <Drawer.Item
        icon={"note-text"}
        testID="ReleaseNotes"
        label="Release Notes"
        active={currentPage === "ReleaseNotesPage"}
        onPress={() => {
          updateCurrentPage("ReleaseNotesPage");
          safeNavigate("ReleaseNotesPage");
        }}
      />
      <Drawer.Item
        icon={"email"}
        testID="ContactButton"
        label="Contact"
        active={currentPage === "ContactPage"}
        onPress={() => {
          updateCurrentPage("ContactPage");
          safeNavigate("ContactPage");
        }}
      />
    </Drawer.Section>
  );
};

export default NavigationSideBar;
