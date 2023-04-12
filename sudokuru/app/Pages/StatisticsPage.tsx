import React from 'react';
import {ScrollView, StyleSheet, View} from "react-native";
import {Button, useTheme, ActivityIndicator} from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from "../Components/Header"; 
import { useWindowDimensions } from "react-native";
import {getKeyString} from "../Functions/Auth0/token";
import {USERGAMESTATISTICSBFFURL} from '@env';
import {useNavigation} from "@react-navigation/native";
import {PreferencesContext} from "../Contexts/PreferencesContext";
import {useFocusEffect} from "@react-navigation/core";
import TotalStatistics from "../Components/Statistics/TotalStatistics";
import {retrieveTotalStatistics} from "../Functions/Statistics/StatisticsParsing";
let iHateEnv = USERGAMESTATISTICSBFFURL;
import Alert from "react-native-awesome-alerts";
import { useState } from 'react';

// Sudokuru Package Import
const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js");

// Sudokuru Package Constants
const Statistics = sudokuru.Statistics;
 
const StatisticsPage = () => {
  const theme = useTheme();
  const navigation: any = useNavigation();

  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const { updateLearnedLessons, learnedLessons } = React.useContext(PreferencesContext);

  const [isLoading, setLoading] = React.useState(true);
  const [totalStatistics, setTotalStatistics] = React.useState<any>();

  const [warningVisible, setWarningVisible] = React.useState(false);
  const showWarningButton = () => setWarningVisible(true);
  const hideWarningButton = () => setWarningVisible(false);

  async function deleteUserStatistics(url: string) {

    let token = null;
    await getKeyString("access_token").then(result => {
      token = result;
    });

    await Statistics.deleteStatistics(url, token).then((res: any) => {
      if (res) {
        console.log("Statistics deleted successfully!")
      }
      else {
        console.log("Statistics not deleted");
      }
      updateLearnedLessons([]);
      navigation.navigate("Home");
    });
  }

  async function getUserStatistics(url: string) {

    let token = null;
    await getKeyString("access_token").then(result => {
      token = result;
    });

    await Statistics.getStatistics(url, token).then((res: any) => {
      if (res) {
        setTotalStatistics(retrieveTotalStatistics(res));
        setLoading(false);
      }
      else {
        console.log("Cannot get user statistics!");
      }
    });
  }

  useFocusEffect(
      React.useCallback(() => {
        getUserStatistics(USERGAMESTATISTICSBFFURL);
      }, []))

  if (isLoading){
    return (
        <SafeAreaProvider>
          <SafeAreaView style={{height: '100%', width: '100%'}}>
              <Header page="Statistics" />
            <ActivityIndicator animating={true} color={theme.colors.primary} />
          </SafeAreaView>
        </SafeAreaProvider>
    )
  }
  else {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{height: '100%', width: '100%'}}>
          <ScrollView>
            <Header page="Statistics" />
            <View style={styles.container}>
              <TotalStatistics
                  totalScore={totalStatistics.totalScore}
                  numGamesPlayed={totalStatistics.numGamesPlayed}
                  fastestSolveTime={totalStatistics.fastestSolveTime}
                  averageSolveTime={totalStatistics.averageSolveTime}
                  totalSolveTime={totalStatistics.totalSolveTime}
                  numHintsUsed={totalStatistics.numHintsUsed}
                  numWrongCellsPlayed={totalStatistics.numWrongCellsPlayed}
              />
              <Button mode="contained" onPress={() => {
                showWarningButton();
              }}>
                Delete Statistics
              </Button>
            </View>
            <Alert
            show={warningVisible}
            title="Delete Warning"
            message=
                {
                `\n\nThis action will entirely delete ALL of your current progress. Are you sure?\n\n`
                }
            messageStyle={{ maxWidth: 500 }}
            showConfirmButton={true}
            showCancelButton={true}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
            confirmText={"Yes, I'm sure!"}
            cancelText={"Never mind."}
            confirmButtonColor={theme.colors.background}
            onConfirmPressed={() => {
                deleteUserStatistics(USERGAMESTATISTICSBFFURL);
                hideWarningButton();
            }}
            onCancelPressed={() => {hideWarningButton() }}
        />
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default StatisticsPage;