import React from "react";
import { StyleSheet, View } from "react-native";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Button, Dialog, Portal } from "react-native-paper";

const Drill = (props: any) => {
  let strategy = props.route.params
    ? props.route.params.params
    : "no props.route.params in DrillPage";

  strategy = [strategy];
  const navigation: any = useNavigation();

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true); // call this function after verifying don't show this message again hasn't been selected previously

  const hideDialog = () => setVisible(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
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
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
