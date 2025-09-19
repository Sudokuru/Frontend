import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import { safeNavigate } from "../../Navigation/navigation";

const ProfileButton = () => {
  const navigation: any = useNavigation();
  const { updateCurrentPage } = React.useContext(PreferencesContext);

  return (
    <IconButton
      icon="account-details"
      testID={"ViewProfilePageButton"}
      size={20}
      onPress={() => {
        updateCurrentPage("ProfilePage");
        safeNavigate("ProfilePage");
      }}
    />
  );
};

export default ProfileButton;
