import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, useTheme } from "react-native-paper";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { PreferencesContext } from "../../Contexts/PreferencesContext";

const StatisticsButton = () => {
  const navigation: any = useNavigation();
  const theme = useTheme();
  const { updateCurrentPage } = React.useContext(PreferencesContext);

  return (
    <Button
      mode="contained"
      testID={"ViewStatisticsPageButton"}
      style={{ marginRight: 5 }}
      onPress={() => {
        updateCurrentPage("Statistics");
        navigation.navigate("Statistics");
      }}
    >
      <MaterialCommunityIcons
        name="chart-line"
        size={24}
        color={theme.colors.onPrimaryContainer}
      />
    </Button>
  );
};

export default StatisticsButton;
