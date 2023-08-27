import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { PreferencesContext } from "../../Contexts/PreferencesContext";

const HomeButton = () => {
  const navigation: any = useNavigation();
  const theme = useTheme();

  const { isCurrentPage } = React.useContext(PreferencesContext);

  return (
    <Button
      mode="contained"
      testID={"ViewHomePageButton"}
      style={{ marginRight: 5 }}
      onPress={() => navigation.navigate(isCurrentPage)}
    >
      <MaterialCommunityIcons
        name="home"
        size={24}
        color={theme.colors.onPrimaryContainer}
      />
    </Button>
  );
};

export default HomeButton;
