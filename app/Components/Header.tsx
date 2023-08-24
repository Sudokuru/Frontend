import React from "react";
import ProfileButton from "./Profile/ProfileButton";
import StatisticsButton from "./Statistics/StatisticsButton";
import { Image, Pressable, StyleSheet, View } from "react-native";
import HomeButton from "./Home/HomeButton";
import { useNavigation } from "@react-navigation/native";
import { PreferencesContext } from "../Contexts/PreferencesContext";

const Header = (props: any) => {
  const navigation: any = useNavigation();

  const { isThemeDark } = React.useContext(PreferencesContext);

  const DARK_LOGO = require("./goldLogoText.png");
  const LIGHT_LOGO = require("./darkBlueLogoText.png");

  let logoUrl = isThemeDark ? DARK_LOGO : LIGHT_LOGO;

  return (
    <View
      style={{
        flexDirection: "row",
        margin: 5,
      }}
    >
      {
        /*
         * If we are on the Home page, Logo will not navigate to the Home page
         * If we are on any other page, Logo wil navigate to the Home page
         */
        props.page == "Home" ? (
          <Image
            style={{
              resizeMode: "cover",
              height: 45,
              width: 100,
            }}
            source={logoUrl}
          />
        ) : (
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Image
              style={{
                resizeMode: "cover",
                height: 45,
                width: 100,
              }}
              source={logoUrl}
            />
          </Pressable>
        )
      }
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-end",
          marginRight: 15,
          marginLeft: 10,
        }}
      >
        {props.page == "Landing" ? (
          <></>
        ) : props.page == "Statistics" ? (
          <HomeButton />
        ) : (
          <StatisticsButton />
        )}
        {props.page == "Landing" ? (
          <></>
        ) : props.page == "Profile" ? (
          <HomeButton />
        ) : (
          <ProfileButton />
        )}
      </View>
    </View>
  );
};

export default Header;
