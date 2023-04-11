import React from 'react';
import {ScrollView, View} from "react-native";
import {Button, useTheme, Text, ActivityIndicator} from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from "../Components/Header"; 
import { useWindowDimensions } from "react-native";
import {getKeyString} from "../Functions/Auth0/token";
import {USERGAMESTATISTICSBFFURL} from '@env';
import {useNavigation} from "@react-navigation/native";
import {VictoryChart, VictoryLine, VictoryTheme} from "victory-native";
import {PreferencesContext} from "../Contexts/PreferencesContext";
import {useFocusEffect} from "@react-navigation/core";

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
        console.log(res);
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
            <Button mode="contained" onPress={() => {
              deleteUserStatistics(USERGAMESTATISTICSBFFURL);
            }}>
              Delete Statistics
            </Button>
            <Button mode="contained" onPress={() => {
              getUserStatistics(USERGAMESTATISTICSBFFURL);
            }}>
              Get User Statistics
            </Button>
            <VictoryChart
                theme={VictoryTheme.grayscale}
            >
              <VictoryLine
                  style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc"}
                  }}
                  data={[
                    { x: 1, y: 2 },
                    { x: 2, y: 3 },
                    { x: 3, y: 5 },
                    { x: 4, y: 4 },
                    { x: 5, y: 4 },
                    { x: 6, y: 4 },
                    { x: 7, y: 4 },
                    { x: 8, y: 4 },
                    { x: 9, y: 4 },
                    { x: 10, y: 4 },
                    { x: 11, y: 4 },
                    { x: 12, y: 4 },
                    { x: 13, y: 4 },
                    { x: 14, y: 4 },
                    { x: 15, y: 4 },
                    { x: 16, y: 4 },
                    { x: 17, y: 4 },
                    { x: 18, y: 4 },
                    { x: 19, y: 4 },
                    { x: 20, y: 4 },
                    { x: 21, y: 4 },
                    { x: 22, y: 4 },
                    { x: 23, y: 4 },
                    { x: 24, y: 4 },
                    { x: 25, y: 7 }
                  ]}
              />
            </VictoryChart>

            <VictoryChart
                theme={VictoryTheme.grayscale}
            >
              <VictoryLine
                  style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc"}
                  }}
                  data={[
                    { x: 1, y: 2 },
                    { x: 2, y: 3 },
                    { x: 3, y: 5 },
                    { x: 4, y: 4 },
                    { x: 5, y: 4 },
                    { x: 6, y: 4 },
                    { x: 7, y: 4 },
                    { x: 8, y: 4 },
                    { x: 9, y: 4 },
                    { x: 10, y: 4 },
                    { x: 11, y: 4 },
                    { x: 12, y: 4 },
                    { x: 13, y: 4 },
                    { x: 14, y: 4 },
                    { x: 15, y: 4 },
                    { x: 16, y: 4 },
                    { x: 17, y: 4 },
                    { x: 18, y: 4 },
                    { x: 19, y: 4 },
                    { x: 20, y: 4 },
                    { x: 21, y: 4 },
                    { x: 22, y: 4 },
                    { x: 23, y: 4 },
                    { x: 24, y: 4 },
                    { x: 25, y: 7 }
                  ]}
              />
            </VictoryChart>

            <VictoryChart
                theme={VictoryTheme.grayscale}
            >
              <VictoryLine
                  style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc"}
                  }}
                  data={[
                    { x: 1, y: 2 },
                    { x: 2, y: 3 },
                    { x: 3, y: 5 },
                    { x: 4, y: 4 },
                    { x: 5, y: 4 },
                    { x: 6, y: 4 },
                    { x: 7, y: 4 },
                    { x: 8, y: 4 },
                    { x: 9, y: 4 },
                    { x: 10, y: 4 },
                    { x: 11, y: 4 },
                    { x: 12, y: 4 },
                    { x: 13, y: 4 },
                    { x: 14, y: 4 },
                    { x: 15, y: 4 },
                    { x: 16, y: 4 },
                    { x: 17, y: 4 },
                    { x: 18, y: 4 },
                    { x: 19, y: 4 },
                    { x: 20, y: 4 },
                    { x: 21, y: 4 },
                    { x: 22, y: 4 },
                    { x: 23, y: 4 },
                    { x: 24, y: 4 },
                    { x: 25, y: 7 }
                  ]}
              />
            </VictoryChart>

            <VictoryChart
                theme={VictoryTheme.grayscale}
            >
              <VictoryLine
                  style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc"}
                  }}
                  data={[
                    { x: 1, y: 2 },
                    { x: 2, y: 3 },
                    { x: 3, y: 5 },
                    { x: 4, y: 4 },
                    { x: 5, y: 4 },
                    { x: 6, y: 4 },
                    { x: 7, y: 4 },
                    { x: 8, y: 4 },
                    { x: 9, y: 4 },
                    { x: 10, y: 4 },
                    { x: 11, y: 4 },
                    { x: 12, y: 4 },
                    { x: 13, y: 4 },
                    { x: 14, y: 4 },
                    { x: 15, y: 4 },
                    { x: 16, y: 4 },
                    { x: 17, y: 4 },
                    { x: 18, y: 4 },
                    { x: 19, y: 4 },
                    { x: 20, y: 4 },
                    { x: 21, y: 4 },
                    { x: 22, y: 4 },
                    { x: 23, y: 4 },
                    { x: 24, y: 4 },
                    { x: 25, y: 7 }
                  ]}
              />
            </VictoryChart>

            <VictoryChart
                theme={VictoryTheme.grayscale}
            >
              <VictoryLine
                  style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc"}
                  }}
                  data={[
                    { x: 1, y: 2 },
                    { x: 2, y: 3 },
                    { x: 3, y: 5 },
                    { x: 4, y: 4 },
                    { x: 5, y: 4 },
                    { x: 6, y: 4 },
                    { x: 7, y: 4 },
                    { x: 8, y: 4 },
                    { x: 9, y: 4 },
                    { x: 10, y: 4 },
                    { x: 11, y: 4 },
                    { x: 12, y: 4 },
                    { x: 13, y: 4 },
                    { x: 14, y: 4 },
                    { x: 15, y: 4 },
                    { x: 16, y: 4 },
                    { x: 17, y: 4 },
                    { x: 18, y: 4 },
                    { x: 19, y: 4 },
                    { x: 20, y: 4 },
                    { x: 21, y: 4 },
                    { x: 22, y: 4 },
                    { x: 23, y: 4 },
                    { x: 24, y: 4 },
                    { x: 25, y: 7 }
                  ]}
              />
            </VictoryChart>

          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
};


export default StatisticsPage;