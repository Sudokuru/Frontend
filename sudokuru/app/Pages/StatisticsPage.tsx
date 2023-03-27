import React from 'react';
import {StyleSheet, View} from "react-native";
import {Text, useTheme} from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from "../Components/Header"; 
import { Dimensions } from "react-native";
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

    const data = {
        labels: ["January", "February", "March", "April", "May", "June", 'July','August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43, 55, 23, 12, 56, 78, 12],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["Sudoku Puzzles Completed"] // optional
      };

    const data2 = {
        labels: ["January", "February", "March", "April", "May", "June", 'July','August', 'September', 'October', 'November', 'December'],
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
    width={Dimensions.get('window').width} // from react-native
    height={220}
    yAxisLabel={''}
    chartConfig={{
      backgroundColor: theme.colors.primary,
      backgroundGradientFrom: theme.colors.primary,
      backgroundGradientTo: theme.colors.primary,
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
        width={Dimensions.get('window').width - 16}
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
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              data: [20, 45, 28, 80, 99, 43],
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
              strokeWidth: 2, 
            },
          ],
        }}
        width={Dimensions.get('window').width - 16}
        height={220}
        yAxisLabel={'Rs'}
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