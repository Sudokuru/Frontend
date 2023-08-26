import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React from "react";

const ProfileButton = () => {
  const navigation: any = useNavigation();
  const theme = useTheme();

  return (
    <Button
      mode="contained"
      testID={"ViewProfilePageButton"}
      style={{ marginRight: 5 }}
      onPress={() => navigation.navigate("Profile")}
    >
      <MaterialCommunityIcons
        name="account-details"
        size={24}
        color={theme.colors.onPrimaryContainer}
      />
    </Button>
  );
};

export default ProfileButton;
