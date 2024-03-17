import { useNavigation } from "@react-navigation/native";
import React from "react";
import { IconButton } from "react-native-paper";

import { PreferencesContext } from "../../Contexts/PreferencesContext";

const ProfileButton = () => {
  const navigation: any = useNavigation();
  const { updateCurrentPage } = React.useContext(PreferencesContext);

  return (
    <IconButton
      icon="account-details"
      testID="ViewProfilePageButton"
      size={20}
      onPress={() => {
        updateCurrentPage("Profile");
        navigation.navigate("Profile");
      }}
    />
  );
};

export default ProfileButton;
