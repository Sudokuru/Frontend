import React from "react";
import { ScrollView } from "react-native";
import { Text } from "react-native-paper";
import ProfilePanel from "../Components/Profile/ProfilePanel";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";
import { useIsFocused } from "@react-navigation/native";
import { useTheme } from "../Contexts/ThemeContext";

const ProfilePage = () => {
  const windowSize = useNewWindowDimensions();

  const { theme } = useTheme();

  const isFocused = useIsFocused();
  if (!isFocused) return <Text>Error Loading Page</Text>;

  return (
    <ScrollView
      contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
    >
      <Text
        style={{
          fontSize: 40,
          color: theme.semantic.text.primary,
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
