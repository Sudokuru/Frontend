import React from "react";
import ProfileButton from "./Profile/ProfileButton";
import StatisticsButton from "./Statistics/StatisticsButton";
import { Image, Pressable, View, useWindowDimensions } from "react-native";
import HomeButton from "./Home/HomeButton";
import { useNavigation } from "@react-navigation/native";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { IconButton, Text, useTheme } from "react-native-paper";

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

  return (
    <View
      style={{
        flexDirection: "row",
        margin: 5,
      }}
    >
      <IconButton
        icon="menu"
        testID="OpenDrawerNavigation"
        size={20}
        onPress={() => navigation.toggleDrawer()}
      />
      {
        /*
         * If we are on the Landing page, Logo will not navigate to the Landing page
         * If we are on any other page, Logo will navigate to the Landing page
         */
        currentPage == "Landing" ? (
          <Image
            style={{
              resizeMode: "cover",
              height: 45,
              width: 100,
            }}
            source={logoUrl}
          />
        ) : (
          <Pressable
            onPress={() => {
              updateCurrentPage("Landing");
              navigation.navigate("Landing");
            }}
          >
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
        }}
      >
        {featurePreviewSetting ? (
          <View style={{ alignSelf: "center" }}>
            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: "bold",
              }}
            >
              {featurePreviewText}
            </Text>
          </View>
        ) : (
          <></>
        )}
        {currentPage == "No" ? (
          <></>
        ) : currentPage == "Statistics" ? (
          <HomeButton />
        ) : (
          <StatisticsButton />
        )}
        {currentPage == "No" ? (
          <></>
        ) : currentPage == "Profile" ? (
          <HomeButton />
        ) : (
          <ProfileButton />
        )}
      </View>
    </View>
  );
};

export default Header;
