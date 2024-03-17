import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Drawer } from "react-native-paper";

import { PreferencesContext } from "../Contexts/PreferencesContext";

const NavigationSideBar = (props: any) => {
  const navigation: any = useNavigation();

  const { isCurrentPage, updateCurrentPage } =
    React.useContext(PreferencesContext);

  return (
    <Drawer.Section showDivider={false}>
      <Drawer.Item
        icon="menu"
        testID="CloseDrawerNavigation"
        label="Close"
        active={false}
        onPress={() => {
          props.navigation.closeDrawer();
        }}
      />
      <Drawer.Item
        icon="home"
        testID="HomeButton"
        label="Home"
        active={isCurrentPage === "Landing"}
        onPress={() => {
          updateCurrentPage("Landing");
          navigation.navigate("Landing");
        }}
      />
      <Drawer.Item
        icon="book-open-page-variant"
        testID="LearnButton"
        label="Learn"
        active={isCurrentPage === "Learn"}
        onPress={() => {
          updateCurrentPage("Learn");
          navigation.navigate("Learn");
        }}
      />
      <Drawer.Item
        icon="whistle"
        testID="DrillButton"
        label="Drill"
        active={isCurrentPage === "Drill"}
        onPress={() => {
          updateCurrentPage("Drill");
          navigation.navigate("Drill");
        }}
      />
      <Drawer.Item
        icon="play"
        testID="PlayButton"
        label="Play"
        active={isCurrentPage === "Play"}
        onPress={() => {
          updateCurrentPage("Play");
          navigation.navigate("Play");
        }}
      />
      <Drawer.Item
        icon="email"
        testID="ContactButton"
        label="Contact"
        active={isCurrentPage === "Contact"}
        onPress={() => {
          updateCurrentPage("Contact");
          navigation.navigate("Contact");
        }}
      />
    </Drawer.Section>
  );
};

export default NavigationSideBar;
