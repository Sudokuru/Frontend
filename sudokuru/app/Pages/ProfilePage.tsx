import React from "react";
import { Text } from "react-native-paper";
import ProfilePanel from "../Components/Profile/ProfilePanel";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";
import { useIsFocused } from "@react-navigation/native";
import { useTheme } from "../Contexts/ThemeContext";
import { PageScrollView } from "../Components/PageScrollView";

const ProfilePage = () => {
  const windowSize = useNewWindowDimensions();

  const { theme } = useTheme();

  const isFocused = useIsFocused();
  if (!isFocused) return <Text>Error Loading Page</Text>;

  return (
    <PageScrollView
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
    </PageScrollView>
  );
};

export default ProfilePage;
