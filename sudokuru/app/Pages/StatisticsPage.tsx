import React from 'react';
import {View} from "react-native";
import {Button, useTheme} from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from "../Components/Header"; 
import { useWindowDimensions } from "react-native";
import {getKeyString} from "../Functions/Auth0/token";
import {USERGAMESTATISTICSBFFURL} from '@env'
import {PreferencesContext} from "../Contexts/PreferencesContext";
import {useNavigation} from "@react-navigation/native";

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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{height: '100%', width: '100%'}}>
        <Header page="Statistics" />
        <View>
          <Button mode="contained" onPress={() => {
            deleteUserStatistics(USERGAMESTATISTICSBFFURL);
          }}>
            Delete Statistics
          </Button>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


export default StatisticsPage;