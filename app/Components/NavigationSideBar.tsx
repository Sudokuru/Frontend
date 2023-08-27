import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "react-native-paper";
import { PreferencesContext } from "../Contexts/PreferencesContext";

const NavigationSideBar = () => {
  const navigation: any = useNavigation();

  const { isCurrentPage, updateCurrentPage } =
    React.useContext(PreferencesContext);

  return (
    <Drawer.Section showDivider={false}>
      <Drawer.Item
        icon={"home"}
        label="Home"
        active={isCurrentPage === "Landing"}
        onPress={() => {
          updateCurrentPage("Landing");
          navigation.navigate("Landing");
        }}
      />
      <Drawer.Item
        icon={"book-open-page-variant"}
        label="Learn"
        active={isCurrentPage === "Learn"}
        onPress={() => {
          updateCurrentPage("Learn");
          navigation.navigate("Learn");
        }}
      />
      <Drawer.Item
        icon={"whistle"}
        label="Drill"
        active={isCurrentPage === "Drill"}
        onPress={() => {
          updateCurrentPage("Drill");
          navigation.navigate("Drill");
        }}
      />
      <Drawer.Item
        icon={"play"}
        label="Play"
        active={isCurrentPage === "Play"}
        onPress={() => {
          updateCurrentPage("Play");
          navigation.navigate("Play");
        }}
      />
      <Drawer.Item
        icon={"calculator-variant"}
        label="Statistics"
        active={isCurrentPage === "Statistics"}
        onPress={() => {
          updateCurrentPage("Statistics");
          navigation.navigate("Statistics");
        }}
      />
      <Drawer.Item
        icon={"account"}
        label="Profile"
        active={isCurrentPage === "Profile"}
        onPress={() => {
          updateCurrentPage("Profile");
          navigation.navigate("Profile");
        }}
      />
    </Drawer.Section>
  );
};

export default NavigationSideBar;
