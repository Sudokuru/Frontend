import { useFocusEffect } from "@react-navigation/core";
import { rgba } from "polished";
import React from "react";
import { ScrollView, View } from "react-native";
import Alert from "react-native-awesome-alerts";
import { Button, useTheme, ActivityIndicator } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { Statistics } from "../Api/Statistics";
import TotalStatistics, {
  StatisticsProps,
} from "../Components/Statistics/TotalStatistics";
import { PreferencesContext } from "../Contexts/PreferencesContext";

const StatisticsPage = () => {
  const theme = useTheme();

  const { updateLearnedLessons } = React.useContext(PreferencesContext);

  const [isLoading, setLoading] = React.useState<boolean>(true);
  const [totalStatistics, setTotalStatistics] = React.useState<StatisticsProps>(
    {
      totalScore: 0,
      averageSolveTime: 0,
      fastestSolveTime: 0,
      numGamesPlayed: 0,
      numHintsUsed: 0,
      numWrongCellsPlayed: 0,
      totalSolveTime: 0,
    },
  );

  const [warningVisible, setWarningVisible] = React.useState(false);
  const showWarningButton = () => setWarningVisible(true);
  const hideWarningButton = () => setWarningVisible(false);

  async function deleteUserStatistics() {
    await Statistics.deleteStatistics().then(() => {
      updateLearnedLessons([]);
    });
  }

  async function getUserStatistics() {
    await Statistics.getStatistics().then((res: any) => {
      if (res) {
        setTotalStatistics(res);
      } else {
        console.log("Cannot get user statistics!");
      }
      setLoading(false);
    });
  }

  useFocusEffect(
    React.useCallback(() => {
      getUserStatistics();
    }, []),
  );

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ height: "100%", width: "100%" }}>
          <ActivityIndicator animating color={theme.colors.primary} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  } else {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ height: "100%", width: "100%" }}>
          <ScrollView>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TotalStatistics
                totalScore={totalStatistics.totalScore}
                numGamesPlayed={totalStatistics.numGamesPlayed}
                fastestSolveTime={totalStatistics.fastestSolveTime}
                averageSolveTime={totalStatistics.averageSolveTime}
                totalSolveTime={totalStatistics.totalSolveTime}
                numHintsUsed={totalStatistics.numHintsUsed}
                numWrongCellsPlayed={totalStatistics.numWrongCellsPlayed}
              />
              <Button
                mode="contained"
                onPress={() => {
                  showWarningButton();
                }}
              >
                Delete Statistics
              </Button>
            </View>
          </ScrollView>
        </SafeAreaView>
        <Alert
          show={warningVisible}
          title="Delete Statistics Warning"
          message={`\n\nThis action will delete ALL of your current progress.\nThis includes lesson completions. Do you wish to proceed?\n\n`}
          messageStyle={{ maxWidth: 500 }}
          alertContainerStyle={{
            backgroundColor: rgba(theme.colors.background, 0.3),
          }}
          showConfirmButton
          showCancelButton
          closeOnTouchOutside
          closeOnHardwareBackPress
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonColor="red"
          cancelButtonColor={theme.colors.primary}
          onConfirmPressed={() => {
            deleteUserStatistics().then(() => {
              hideWarningButton();
            });
          }}
          onCancelPressed={() => {
            hideWarningButton();
          }}
          overlayStyle={{ backgroundColor: "transparent" }}
        />
      </SafeAreaProvider>
    );
  }
};

export default StatisticsPage;
