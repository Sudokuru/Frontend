import { useNavigation } from "@react-navigation/native";
import React from "react";
import { IconButton } from "react-native-paper";

import { PreferencesContext } from "../../Contexts/PreferencesContext";

const HomeButton = () => {
  const navigation: any = useNavigation();
  const { updateCurrentPage } = React.useContext(PreferencesContext);

  return (
    <IconButton
      icon="home"
      testID="ViewHomePageButton"
      size={20}
      onPress={() => {
        updateCurrentPage("Landing");
        navigation.navigate("Landing");
      }}
    />
  );
};

export default HomeButton;
