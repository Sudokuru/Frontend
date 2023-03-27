import React from 'react';
import {StyleSheet, View} from "react-native";
import {Text, useTheme} from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from "../Components/Header"; 
import { Dimensions, useWindowDimensions } from "react-native";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";

const StatisticsPage = () => {
    const theme = useTheme();

    const screenWidth = Dimensions.get("window").width;

    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

    const months = ["Jan.", "Feb.", "March", "Apr.", "May", "June", 'July','Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];

    const data = {
        labels: months,
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43, 55, 23, 12, 56, 78, 12],
            color: (opacity = 1) => `rgba(2, 94, 115, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["Sudoku Puzzles You Completed"] // optional
      };

    const data2 = {
        labels: months,
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43, 55, 23, 12, 56, 78, 12],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["Sudoku Puzzles Completed"] // optional
      };

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Header page={'Statistics'}/>
                <View style={homeScreenStyles.home}>
                    <View style={styles.container}>
                <Text style={{color: theme.colors.onPrimary, fontSize: 25,  fontWeight: 'bold'}}>Your Statistics </Text>
                <View style={styles.inner_container}> 
                <LineChart
    data={data}
    width={reSize} // from react-native
    height={220}
    yAxisLabel={''}
    chartConfig={{
      backgroundColor: theme.colors.primary,
      backgroundGradientFrom: theme.colors.primary,
      backgroundGradientTo: theme.colors.primary,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      }}}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />
  
  <ProgressChart
        data={[0.4, 0.6, 0.8]}
        width={reSize}
        height={220}
        chartConfig={{
          backgroundColor: theme.colors.primary,
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

<BarChart
        data={{
          labels: months,
          datasets: [
            {
              data: [20, 45, 28, 80, 99, 43, 54, 13, 24, 54, 12, 32],
              color: (opacity = 1) => `rgba(2, 94, 115, ${opacity})`,
              strokeWidth: 2, 
            },
          ],
        }}
        width={reSize}
        height={220}
        yAxisLabel={''}
        chartConfig={{
          backgroundColor: theme.colors.primary,
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
  
   </View>
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
    container1: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
    },
    inner_container: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
},
});

const homeScreenStyles = StyleSheet.create({
    home: {
        display: "flex",
        flexDirection: 'row',
        //backgroundColor: 'red',
    },
});

export default StatisticsPage;