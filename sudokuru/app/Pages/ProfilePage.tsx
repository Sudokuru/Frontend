import React from "react";
import { ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import ProfilePanel from "../Components/Profile/ProfilePanel";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";

const ProfilePage = () => {
  const windowSize = useNewWindowDimensions();

  const theme = useTheme();

  return (
    <ScrollView
      contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
    >
      <Text
        style={{
          fontSize: 40,
          color: theme.colors.primary,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Profile
      </Text>
      <ProfilePanel width={windowSize.width} />
    </ScrollView>
  );
};

export default ProfilePage;
