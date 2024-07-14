import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "react-native-paper";
import { PreferencesContext } from "../Contexts/PreferencesContext";

const NavigationSideBar = (props: any) => {
  const navigation: any = useNavigation();

  const { currentPage, updateCurrentPage, previewModeSetting } =
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
        active={currentPage === "Landing"}
        onPress={() => {
          updateCurrentPage("Landing");
          navigation.navigate("Landing");
        }}
      />
      <Drawer.Item
        icon={"book-open-page-variant"}
        testID="LearnButton"
        label="Learn"
        active={currentPage === "Learn"}
        onPress={() => {
          updateCurrentPage("Learn");
          navigation.navigate("Learn");
        }}
      />
      {previewModeSetting ? (
        <Drawer.Item
          icon={"whistle"}
          testID="DrillButton"
          label="Drill"
          active={currentPage === "Drill"}
          onPress={() => {
            updateCurrentPage("Drill");
            navigation.navigate("Drill");
          }}
        />
      ) : (
        <></>
      )}
      <Drawer.Item
        icon={"play"}
        testID="PlayButton"
        label="Play"
        active={currentPage === "Play"}
        onPress={() => {
          updateCurrentPage("Play");
          navigation.navigate("Play");
        }}
      />
      <Drawer.Item
        icon={"email"}
        testID="ContactButton"
        label="Contact"
        active={currentPage === "Contact"}
        onPress={() => {
          updateCurrentPage("Contact");
          navigation.navigate("Contact");
        }}
      />
    </Drawer.Section>
  );
};

export default NavigationSideBar;
