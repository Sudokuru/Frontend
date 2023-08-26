import React from "react";
import { StyleSheet, View } from "react-native";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import { useNavigation } from "@react-navigation/native";

const DrillPage = (props: any) => {
  let strategy = props.route.params
    ? props.route.params.params
    : "no props.route.params in DrillPage";

  strategy = [strategy];
  const navigation: any = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Header page={"Sudoku"} />
        <View style={homeScreenStyles.home}>
          <View style={styles.statisticsTitle}>
            {/* The game now required the info about it to be rendered, which is given in generateGame() */}
            <SudokuBoard
              gameType={"StartDrill"}
              strategies={strategy}
              navigation={navigation}
            />
            <StatusBar style="auto" />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  statisticsTitle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

const homeScreenStyles = StyleSheet.create({
  home: {
    display: "flex",
    flexDirection: "row",
  },
});

export default DrillPage;
