import React from 'react';
import LoginButton from "../Components/Auth0/LoginButton";
import { StyleSheet, View } from "react-native";
import { Text } from 'react-native-paper';
import ProfileButton from "../Components/Profile/ProfileButton";
import StatisticsButton from "../Components/Statistics/StatisticsButton";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { makePuzzle, pluck, makeBoard } from '../Components/Sudoku Board/sudoku';
import { List } from 'immutable';
import Header from "../Components/Header";
import {USERACTIVEGAMESBFFURL} from '@env'


const SudokuPage = () => {

    let [fontsLoaded] = useFonts({
        Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
    });

    if (!fontsLoaded) {
        return null;
    }

    // TODO: This should eventually call greg's API for making the puzzle
    function generateGame (finalCount = 20) {
        const solution = makePuzzle();
        let output = solution[0].map((_, colIndex) => solution.map(row => row[colIndex]));
        console.log(output);
        const { puzzle } = pluck(solution, finalCount);
        const board = makeBoard({ puzzle });
        return {
            board, history: List.of(board), historyOffSet: 0, solution,
        };
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Header page={'Sudoku'}/>
                <View style={homeScreenStyles.home}>
                    <View style={styles.container}>
                        {/* The game now required the info about it to be rendered, which is given in generateGame() */}
                        <SudokuBoard generatedGame={generateGame()}/>
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
});

const homeScreenStyles = StyleSheet.create({
    home: {
        display: "flex",
        flexDirection: 'row',
    },
});

export default SudokuPage;