import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "react-native-paper";
import { PreferencesContext } from "../Contexts/PreferencesContext";

const NavigationSideBar = (props: any) => {
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
        active={isCurrentPage === "LearnHome"}
        onPress={() => {
          updateCurrentPage("LearnHome");
          navigation.navigate("LearnHome");
        }}
      />
      <Drawer.Item
        icon={"whistle"}
        label="Drill"
        active={isCurrentPage === "DrillHome"}
        onPress={() => {
          updateCurrentPage("DrillHome");
          navigation.navigate("DrillHome");
        }}
      />
      <Drawer.Item
        icon={"play"}
        label="Play"
        active={isCurrentPage === "PlayHome"}
        onPress={() => {
          updateCurrentPage("PlayHome");
          navigation.navigate("PlayHome");
        }}
      />
    </Drawer.Section>
  );
};

export default NavigationSideBar;
