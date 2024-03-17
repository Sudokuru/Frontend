import { useNavigation } from "@react-navigation/native";
import React from "react";
import { IconButton } from "react-native-paper";

import { PreferencesContext } from "../../Contexts/PreferencesContext";

const StatisticsButton = () => {
  const navigation: any = useNavigation();
  const { updateCurrentPage } = React.useContext(PreferencesContext);

  return (
    <IconButton
      icon="chart-line"
      testID="ViewStatisticsPageButton"
      size={20}
      onPress={() => {
        updateCurrentPage("Statistics");
        navigation.navigate("Statistics");
      }}
    />
  );
};

export default StatisticsButton;
