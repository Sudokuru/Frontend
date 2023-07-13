import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PreferencesContext } from "../Contexts/PreferencesContext";

const NavigationBar = (props: any) => {
  const navigation: any = useNavigation();

  const { isThemeDark } = React.useContext(PreferencesContext);

  return (
    <View style={styles.toggleIcons}>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleIcons: {
    flexDirection: "column",
    height: "100%",
    width: "10%",
    padding: 20,
    backgroundColor: "#012f39",
  },
});

export default NavigationBar;
