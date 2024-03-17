// import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";

const Drill = (props: any) => {
  // let strategy = props.route.params
  //   ? props.route.params.params
  //   : "no props.route.params in DrillPage";

  // strategy = [strategy];
  // const navigation: any = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={homeScreenStyles.home}>
          <View style={styles.statisticsTitle}>
            {/* The game now required the info about it to be rendered, which is given in generateGame() */}
            {/* <SudokuBoard
              gameType={"StartDrill"}
              strategies={strategy}
              navigation={navigation}
            /> */}
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

export default Drill;
