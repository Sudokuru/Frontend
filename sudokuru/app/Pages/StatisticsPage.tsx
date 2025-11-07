import React from "react";
import { Modal, ScrollView, View } from "react-native";
import { Button, ActivityIndicator, Text } from "react-native-paper";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { deleteStatistics, getStatistics } from "../Api/Statistics";
import TotalStatistics from "../Components/Statistics/TotalStatistics";
import { Statistics } from "../Api/Puzzle.Types";
import { CARD_IMAGE_HEIGHT, CARD_WIDTH } from "../Components/Home/Cards";
import { useTheme } from "../Contexts/ThemeContext";

const StatisticsPage = () => {
  const { theme } = useTheme();

  const { updateLearnedLessons } = React.useContext(PreferencesContext);

  const [isLoading, setLoading] = React.useState<boolean>(true);
  const [totalStatistics, setTotalStatistics] = React.useState<Statistics>({
    version: 1,
    totalScore: 0,
    averageSolveTime: 0,
    fastestSolveTime: 0,
    totalSolveTime: 0,
    numGamesPlayed: 0,
    numWrongCellsPlayed: 0,
    numHintsUsed: 0,
    numHintsUsedPerStrategy: [],
  });

  const [warningVisible, setWarningVisible] = React.useState(false);
  const showWarningButton = () => setWarningVisible(true);
  const hideWarningButton = () => setWarningVisible(false);

  async function deleteUserStatistics() {
    await deleteStatistics().then(() => {
      updateLearnedLessons(["NONE"]);
    });
  }

  async function getUserStatistics() {
    await getStatistics().then((res: any) => {
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

  const isFocused = useIsFocused();
  if (!isFocused) return <Text>Error Loading Page</Text>;

  if (isLoading) {
    return <ActivityIndicator animating={true} color={theme.colors.primary} />;
  } else {
    return (
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
            numWrongCellsPlayed={totalStatistics.numWrongCellsPlayed}
            numHintsUsed={totalStatistics.numHintsUsed}
            numHintsUsedPerStrategy={totalStatistics.numHintsUsedPerStrategy}
          />
          <Button
            mode="contained"
            onPress={() => {
              showWarningButton();
            }}
            testID="deleteStatsButton"
            textColor={theme.semantic.text.inverse}
            labelStyle={{ fontSize: 20, fontWeight: 700 }}
          >
            Delete Statistics
          </Button>
        </View>
        <Modal
          visible={warningVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={hideWarningButton}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: theme.colors.surface,
                alignSelf: "center",
                width: CARD_WIDTH * 1.2,
                height: CARD_IMAGE_HEIGHT * 1,
                padding: CARD_WIDTH / 10,
                borderRadius: CARD_WIDTH / 8,
                borderWidth: CARD_WIDTH / 80,
                borderColor: theme.colors.border,
              }}
            >
              <Text
                variant="headlineMedium"
                style={{ alignSelf: "center", margin: CARD_IMAGE_HEIGHT / 50 }}
                theme={{
                  colors: { onSurface: theme.semantic.text.quaternary },
                }}
              >
                Are you sure?
              </Text>
              <Text
                variant="bodyLarge"
                style={{ alignSelf: "center", textAlign: "center" }}
                theme={{
                  colors: { onSurface: theme.semantic.text.quaternary },
                }}
              >
                Do you really want to delete your progress?{"\n"}
                This includes lesson completions.{"\n"}
                This process cannot be undone.
              </Text>
              <View
                style={{
                  flexWrap: "wrap",
                  flexDirection: "row",
                  alignSelf: "center",
                  marginTop: CARD_IMAGE_HEIGHT / 50,
                }}
              >
                <Button
                  mode="contained"
                  buttonColor={theme.colors.onSurface}
                  onPress={hideWarningButton}
                  labelStyle={{
                    fontSize: 20,
                    color: theme.colors.onError,
                    fontWeight: "bold",
                  }}
                  style={{
                    marginRight: CARD_WIDTH / 10,
                  }}
                  testID="cancelDeleteButton"
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  buttonColor={theme.colors.error}
                  onPress={() => {
                    deleteUserStatistics().then(() => {
                      hideWarningButton();
                    });
                  }}
                  labelStyle={{
                    fontSize: 20,
                    color: theme.colors.onError,
                    fontWeight: "bold",
                  }}
                  testID="confirmDeleteButton"
                >
                  Delete
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
};

export default StatisticsPage;
