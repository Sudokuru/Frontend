import React from "react";
import { Text } from "react-native-paper";
import ProfilePanel from "../Components/Profile/ProfilePanel";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";
import { useIsFocused } from "@react-navigation/native";
import { useTheme } from "../Contexts/ThemeContext";
import KeyboardScrollView from "../Components/KeyboardScrollView";

const ProfilePage = () => {
  const windowSize = useNewWindowDimensions();

  const { theme } = useTheme();

  const isFocused = useIsFocused();
  if (!isFocused) return <Text>Error Loading Page</Text>;

  return (
    <KeyboardScrollView
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
      <ProfilePanel width={windowSize.width} height={windowSize.height} />
    </KeyboardScrollView>
  );
};

export default ProfilePage;
