import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { PreferencesContext } from "../../Contexts/PreferencesContext";

const HomeButton = () => {
  const navigation: any = useNavigation();
  const { updateCurrentPage } = React.useContext(PreferencesContext);

  return (
    <IconButton
      icon="home"
      testID={"ViewHomePageButton"}
      size={20}
      onPress={() => {
        updateCurrentPage("HomePage");
        navigation.navigate("HomePage");
      }}
    />
  );
};

export default HomeButton;
