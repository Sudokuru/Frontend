import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "react-native-paper";

const NavigationSideBar = (props: any) => {
  const navigation: any = useNavigation();

  const [active, setActive] = React.useState("");

  return (
    <Drawer.Section showDivider={false}>
      <Drawer.Item
        icon={"home"}
        label="Home"
        active={active === "first"}
        onPress={() => {
          setActive("first");
          navigation.navigate("Landing");
        }}
      />
      <Drawer.Item
        icon={"book-open-page-variant"}
        label="Learn"
        active={active === "second"}
        onPress={() => {
          setActive("second");
          navigation.navigate("LearnHome");
        }}
      />
      <Drawer.Item
        icon={"whistle"}
        label="Drill"
        active={active === "third"}
        onPress={() => {
          setActive("third");
          navigation.navigate("DrillHome");
        }}
      />
      <Drawer.Item
        icon={"play"}
        label="Play"
        active={active === "forth"}
        onPress={() => {
          setActive("forth");
          navigation.navigate("PlayHome");
        }}
      />
    </Drawer.Section>
  );
};

export default NavigationSideBar;
