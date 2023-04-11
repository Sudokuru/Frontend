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
        <Button mode="contained" onPress={() => {
          deleteUserStatistics(USERGAMESTATISTICSBFFURL);
        }}>
          Delete Statistics
        </Button>
        <LineChart width={500} height={300} data={data}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
        </LineChart>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


export default StatisticsPage;