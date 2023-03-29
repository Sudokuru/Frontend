// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {StyleSheet, View} from "react-native";
import {Text, useTheme} from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from "../Components/Header"; 
import { Dimensions, useWindowDimensions } from "react-native";
import {getKeyString} from "../Functions/Auth0/token";
import {USERACTIVEGAMESBFFURL} from '@env'

// Sudokuru Package Import
const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js");

// Sudokuru Package Constants
const Puzzles = sudokuru.Puzzles;

const StatisticsPage = () => {
  const theme = useTheme();

  const screenWidth = Dimensions.get("window").width;

  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const [activeGame, setActiveGame] = useState(null);

  async function grabCurrentGame(url) {
    let token = null;

    await getKeyString("access_token").then(result => {
      token = result;
    });

    const gameData = await Puzzles.getGame(url, token).then(game => {
      if (game[0].puzzle == null) {
        console.log(game);
        return null;
      }
      return game[0];
    });

    console.log(gameData);
    console.log(gameData?.puzzle);
    console.log(gameData?.currentTime);
    console.log(gameData?.puzzleSolution);
    console.log(gameData?.numHintsUsed);
    console.log(gameData?.numWrongCellsPlayed);

    setActiveGame(gameData);
  }

  useEffect(() => {
    grabCurrentGame(USERACTIVEGAMESBFFURL);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Header title="Statistics" />
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 30 }}>
          <Text style={{ fontSize: 24, color: '#D9A05B', fontWeight: 'bold', marginBottom: 10 }}>Game Statistics</Text>
          {activeGame ? (
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 16 , color: '#025E73'}}>Time Spent Playing:</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#D9A05B' }}>{activeGame.currentTime}</Text>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 16, color: '#025E73' }}>Number of Hints Used:</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#D9A05B' }}>{activeGame.numHintsUsed}</Text>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 16, color: '#025E73' }}>Number of Wrong Cells Played:</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#D9A05B' }}>{activeGame.numWrongCellsPlayed}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 16, color: '#025E73' }}>Internal Game Difficulty Score:</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#D9A05B' }}>{activeGame.difficulty}</Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: '#fff' }}>No active game found.</Text>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


export default StatisticsPage;