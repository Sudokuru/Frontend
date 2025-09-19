import React from "react";
import ProfileButton from "./Profile/ProfileButton";
import StatisticsButton from "./Statistics/StatisticsButton";
import { Image, Pressable, View, useWindowDimensions } from "react-native";
import HomeButton from "./Home/HomeButton";
import { useNavigation } from "@react-navigation/native";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { IconButton, Text, useTheme } from "react-native-paper";
import { safeNavigate } from "../Navigation/navigation";

const Header = () => {
  const navigation: any = useNavigation();
  const theme = useTheme();

  const {
    darkThemeSetting,
    currentPage,
    updateCurrentPage,
    featurePreviewSetting,
  } = React.useContext(PreferencesContext);

  const size = useWindowDimensions();
  const minSize = Math.min(size.width, size.height);
  const featurePreviewText = minSize >= 500 ? "Feature Preview" : "FP";

  const DARK_LOGO = require("../../.assets/goldLogoText.png");
  const LIGHT_LOGO = require("../../.assets/darkBlueLogoText.png");

  const logoUrl = darkThemeSetting ? DARK_LOGO : LIGHT_LOGO;

  const statisticsButton = (currentPage: string) => {
    if (currentPage !== "StatisticsPage") {
      return <StatisticsButton />;
    } else {
      return <HomeButton />;
    }
  };

  const profileButton = (currentPage: string) => {
    if (currentPage !== "ProfilePage") {
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
       * If we are on the Home page, Logo will not navigate to the Home page
       * If we are on any other page, Logo will navigate to the Home page
       */}
      <Pressable
        disabled={currentPage === "HomePage"}
        onPress={() => {
          updateCurrentPage("HomePage");
          safeNavigate(navigation, "HomePage");
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
        {featurePreviewSetting && (
          <View style={{ alignSelf: "center" }} testID="FeaturePreviewText">
            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: "bold",
              }}
            >
              {featurePreviewText}
            </Text>
          </View>
        )}
        {statisticsButton(currentPage)}
        {profileButton(currentPage)}
      </View>
    </View>
  );
};

export default Header;
