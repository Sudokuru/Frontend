import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PreferencesContext } from "../Contexts/PreferencesContext";

const NavigationBar = (props: any) => {
  const navigation: any = useNavigation();

  const HOME_LOGO = require("./homeLogo.png");
  const PLAY_LOGO = require("./playLogo.png");
  const DRILL_LOGO = require("./drillLogo.png");
  const LEARN_LOGO = require("./learnLogo.png");

  return (
    <View style={styles.toggleIcons}>
      {
          <Pressable onPress={() => navigation.navigate("Landing")} style={props.page == "Landing" ? styles.onPage : styles.notOnPage}>
            <Image
              style={{
                resizeMode: "cover",
                height: 45,
                width: 110,
              }}
              source={HOME_LOGO}
            />
          </Pressable>
      }
      {
          <Pressable onPress={() => navigation.navigate("Landing")} style={props.page == "Play" ? styles.onPage : styles.notOnPage}>
            <Image
              style={{
                resizeMode: "cover",
                height: 45,
                width: 110,
              }}
              source={PLAY_LOGO}
            />
          </Pressable>
      }
      {
          <Pressable onPress={() => navigation.navigate("Landing")} style={props.page == "Drill" ? styles.onPage : styles.notOnPage}>
            <Image
              style={{
                resizeMode: "cover",
                height: 45,
                width: 110,
              }}
              source={DRILL_LOGO}
            />
          </Pressable>
      }
      {
          <Pressable onPress={() => navigation.navigate("Landing")} style={props.page == "Learn" ? styles.onPage : styles.notOnPage}>
            <Image
              style={{
                resizeMode: "cover",
                height: 45,
                width: 110,
              }}
              source={LEARN_LOGO}
            />
          </Pressable>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  toggleIcons: {
    flexDirection: "column",
    height: "100%",
    width: 130,
    backgroundColor: "#012f39",
  },
  onPage: {
    width: 130,
    padding: 10,
    backgroundColor: "#000000",
  },
  notOnPage: {
    width: 130,
    padding: 10,
  },
});

export default NavigationBar;
