// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {StyleSheet, View} from "react-native";
import {Button, Text, useTheme} from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from "../Components/Header"; 
import { Dimensions, useWindowDimensions } from "react-native";
import {getKeyString} from "../Functions/Auth0/token";
import {USERACTIVEGAMESBFFURL, USERGAMESTATISTICSBFFURL} from '@env'
import {useFocusEffect} from "@react-navigation/core";
import {PreferencesContext} from "../Contexts/PreferencesContext";
import {useNavigation} from "@react-navigation/native";

// Sudokuru Package Import
const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js");

// Sudokuru Package Constants
const Puzzles = sudokuru.Puzzles;
const Statistics = sudokuru.Statistics;

const StatisticsPage = () => {
  const theme = useTheme();
  const navigation: any = useNavigation();

  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const [activeGame, setActiveGame] = useState(null);

  const { updateLearnedLessons, learnedLessons } = React.useContext(PreferencesContext);

  const formatTime = (seconds) => {
    // Get minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    // Pad with zeros if needed
    const paddedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const paddedSeconds = secs < 10 ? "0" + secs : secs;
    // Return formatted string
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  async function grabCurrentGame(url) {
    let token = null;

    await getKeyString("access_token").then(result => {
      token = result;
    });

    const gameData = await Puzzles.getGame(url, token).then(game => {
      if (game == null) {
        return null;
      }
      return game[0];
    });
    setActiveGame(gameData);
  }

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

  useFocusEffect(
      React.useCallback(() => {
    grabCurrentGame(USERACTIVEGAMESBFFURL);
  }, []));

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{height: '100%', width: '100%'}}>
        <Header page="Statistics" />
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 30 }}>
          <Text style={{ fontSize: reSize/20, color: '#D9A05B', fontWeight: 'bold', marginBottom: 10 }}>Statistics</Text>
          <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Strategies Learned:</Text>
              <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{learnedLessons.join('\r\n')}</Text>
            </View>
          </View>
          <Text style={{ fontSize: reSize/20, color: '#D9A05B', fontWeight: 'bold', marginBottom: 10 }}>Game Statistics</Text>
          {activeGame ? (
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Time Spent Playing:</Text>
                <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{formatTime(activeGame.currentTime)}</Text>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: reSize/22, color: '#025E73' }}>Number of Hints Used:</Text>
                <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{activeGame.numHintsUsed}</Text>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: reSize/22, color: '#025E73' }}>Number of Wrong Cells Played:</Text>
                <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{activeGame.numWrongCellsPlayed}</Text>
              </View>
              <View>
                <Text style={{ fontSize: reSize/22, color: '#025E73' }}>Internal Game Difficulty Score:</Text>
                <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{activeGame.difficulty}</Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: '#fff' }}>No active game found.</Text>
          )}
        </View>
        <Button mode="contained" onPress={() => {
          deleteUserStatistics(USERGAMESTATISTICSBFFURL);
        }}>
          Delete Statistics
        </Button>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


export default StatisticsPage;