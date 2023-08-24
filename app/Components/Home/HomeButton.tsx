import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React from "react";

const HomeButton = () => {
  const navigation: any = useNavigation();
  const theme = useTheme();

  return (
    <Button
      mode="contained"
      testID={"ViewHomePageButton"}
      style={{ marginRight: 5 }}
      onPress={() => navigation.navigate("Landing")}
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
