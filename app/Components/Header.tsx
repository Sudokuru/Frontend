import React from "react";
import ProfileButton from "./Profile/ProfileButton";
import StatisticsButton from "./Statistics/StatisticsButton";
import { Image, Pressable, View } from "react-native";
import HomeButton from "./Home/HomeButton";
import { useNavigation } from "@react-navigation/native";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { IconButton } from "react-native-paper";

const Header = () => {
  const navigation: any = useNavigation();

  const { darkThemeSetting, currentPage, updateCurrentPage } =
    React.useContext(PreferencesContext);

  const DARK_LOGO = require("../../.assets/goldLogoText.png");
  const LIGHT_LOGO = require("../../.assets/darkBlueLogoText.png");

  const logoUrl = darkThemeSetting ? DARK_LOGO : LIGHT_LOGO;

  const statisticsButton = (currentPage: string) => {
    if (currentPage != "StatisticsPage") {
      return <StatisticsButton />;
    } else {
      return <HomeButton />;
    }
  };

  const profileButton = (currentPage: string) => {
    if (currentPage != "ProfilePage") {
      return <ProfileButton />;
    } else {
      return <HomeButton />;
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <IconButton
        icon="menu"
        testID="OpenDrawerNavigation"
        size={20}
        onPress={() => navigation.toggleDrawer()}
      />
      {/*
       * If we are on the Landing page, Logo will not navigate to the Landing page
       * If we are on any other page, Logo will navigate to the Landing page
       */}
      <Pressable
        disabled={currentPage == "LandingPage"}
        onPress={() => {
          updateCurrentPage("LandingPage");
          navigation.navigate("LandingPage");
        }}
      >
        <Image
          style={{
            resizeMode: "cover",
            height: 45,
            width: 100,
          }}
          defaultSource={logoUrl} // bruh adding this fixed the flickering issue bruh
          source={logoUrl}
        />
      </Pressable>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        {statisticsButton(currentPage)}
        {profileButton(currentPage)}
      </View>
    </View>
  );
};

export default Header;
