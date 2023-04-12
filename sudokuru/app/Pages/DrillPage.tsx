// @ts-nocheck
import React from 'react';
import { StyleSheet, View } from "react-native";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import Header from "../Components/Header";
import {useNavigation} from "@react-navigation/native";

const DrillPage = (props) => {
  let strategy = props.route.params ? props.route.params.params : "no props.route.params in DrillPage"
  let [fontsLoaded] = useFonts({
      Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
  });

  const navigation: any = useNavigation();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>

        <Header page={'Sudoku'}/>
        <View style={homeScreenStyles.home}>

          <View style={styles.container}>
            {/* The game now required the info about it to be rendered, which is given in generateGame() */}
            <SudokuBoard strategies={strategy} isDrill={true} navigation={navigation}/>
            <StatusBar style="auto" />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    toggleIcons: {
        flexDirection: 'row',
        margin: 5
    },
    profileHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    profileText: {
        fontSize: 20,
    },
    profileButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        top: 100,
        position: 'absolute',
    },
});

const homeScreenStyles = StyleSheet.create({
    home: {
        display: "flex",
        flexDirection: 'row',
    },
});

export default DrillPage;