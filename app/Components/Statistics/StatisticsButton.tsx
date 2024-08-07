import { IconButton } from "react-native-paper";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { PreferencesContext } from "../../Contexts/PreferencesContext";

const StatisticsButton = () => {
  const navigation: any = useNavigation();
  const { updateCurrentPage } = React.useContext(PreferencesContext);

  return (
    <IconButton
      icon="chart-line"
      testID={"ViewStatisticsPageButton"}
      size={20}
      onPress={() => {
        updateCurrentPage("StatisticsPage");
        navigation.navigate("StatisticsPage");
      }}
    />
  );
};

export default StatisticsButton;
