import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "react-native-paper";
import { PreferencesContext } from "../Contexts/PreferencesContext";

const NavigationSideBar = (props: any) => {
  const navigation: any = useNavigation();

  const { currentPage, updateCurrentPage } =
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
        active={currentPage === "LandingPage"}
        onPress={() => {
          updateCurrentPage("LandingPage");
          navigation.navigate("LandingPage");
        }}
      />
      <Drawer.Item
        icon={"book-open-page-variant"}
        testID="LearnButton"
        label="Learn"
        active={currentPage === "LearnPage"}
        onPress={() => {
          updateCurrentPage("LearnPage");
          navigation.navigate("LearnPage");
        }}
      />
      <Drawer.Item
        icon={"whistle"}
        testID="DrillButton"
        label="Drill"
        active={currentPage === "DrillPage"}
        onPress={() => {
          updateCurrentPage("DrillPage");
          navigation.navigate("DrillPage");
        }}
      />
      <Drawer.Item
        icon={"play"}
        testID="PlayButton"
        label="Play"
        active={currentPage === "PlayPage"}
        onPress={() => {
          updateCurrentPage("PlayPage");
          navigation.navigate("PlayPage");
        }}
      />
      <Drawer.Item
        icon={"note-text"}
        testID="ReleaseNotes"
        label="Release Notes"
        active={currentPage === "ReleaseNotesPage"}
        onPress={() => {
          updateCurrentPage("ReleaseNotesPage");
          navigation.navigate("ReleaseNotesPage");
        }}
      />
      <Drawer.Item
        icon={"email"}
        testID="ContactButton"
        label="Contact"
        active={currentPage === "ContactPage"}
        onPress={() => {
          updateCurrentPage("ContactPage");
          navigation.navigate("ContactPage");
        }}
      />
    </Drawer.Section>
  );
};

export default NavigationSideBar;
