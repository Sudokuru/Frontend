import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "react-native-paper";

const NavigationBar = () => {
  const navigation: any = useNavigation();

  const [active, setActive] = React.useState("");

  const HOME_LOGO = require("./homeLogo.png");
  const PLAY_LOGO = require("./playLogo.png");
  const DRILL_LOGO = require("./drillLogo.png");
  const LEARN_LOGO = require("./learnLogo.png");

  return (
    <Drawer.Section title="Some title">
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
        icon={"play"}
        label="Play"
        active={active === "second"}
        onPress={() => {
          setActive("second");
          navigation.navigate("Landing");
        }}
      />
      <Drawer.Item
        icon={"book-open-page-variant"}
        label="Learn"
        active={active === "third"}
        onPress={() => {
          setActive("third");
          navigation.navigate("Landing");
        }}
      />
      <Drawer.Item
        icon={"whistle"}
        label="Drill"
        active={active === "forth"}
        onPress={() => {
          setActive("forth");
          navigation.navigate("Landing");
        }}
      />
      <Drawer.Item
        icon={"cog"}
        label="Settings"
        active={active === "fifth"}
        onPress={() => {
          setActive("fifth");
          navigation.navigate("Profile");
        }}
      />
    </Drawer.Section>
  );
};

export default NavigationBar;
