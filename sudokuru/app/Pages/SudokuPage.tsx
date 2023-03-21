// @ts-nocheck
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
import {getKeyString} from "../Functions/Auth0/token";
import {USERACTIVEGAMESBFFURL} from '@env'
import {useNavigation} from "@react-navigation/native";

// Sudokuru Package Import
const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js");

// Sudokuru Package Constants
const Puzzles = sudokuru.Puzzles;

// startGame - https://www.npmjs.com/package/sudokuru#:~:text=sudokuru.Puzzles%3B-,Puzzles.startGame(),-Description%3A%20Returns%20puzzle
let url = USERACTIVEGAMESBFFURL;
let difficulty = 29; // Get difficulty from slider
let strategies = ["NAKED_SINGLE"]; // Get strategies from previous page
let token = "token"; // Get token from previous page

function strPuzzleToArray(str) {
    console.log("strPuzzleToArray: ", str)
    let arr = [];
    for (let i = 0; i < str.length; i += 9) {
      arr.push(str.slice(i, i + 9).split('').map(Number));
    }
    output = arr[0].map((_, colIndex) => arr.map(row => row[colIndex]));
    return { puzzle: output };
  }

const SudokuPage = () => { // TODO: Take in props from previous page instead of static values

    let [fontsLoaded] = useFonts({
        Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
    });

    if (!fontsLoaded) {
        return null;
    }

    async function generateGame(url) {
        let token = null;

        await getKeyString("access_token").then(
            result => {
                token = result;
            });
        console.log("Token: ", token);

        let board = await Puzzles.startGame(url, difficulty, strategies, token).then(game => 
        {
            console.log("url: ", url, "difficulty: ", difficulty, "strategies: ", strategies, "token: ", token);
            console.log("Game: ", game);
            let board = makeBoard(strPuzzleToArray(game.puzzle));
            console.log("Board: ", board); 
            return board;
        })

        return {board, history: List.of(board), historyOffSet: 0, solution };
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Header page={'Sudoku'}/>
                <View style={homeScreenStyles.home}>
                    <View style={styles.container}>
                        {/* The game now required the info about it to be rendered, which is given in generateGame() */}
                        <SudokuBoard generatedGame={generateGame(USERACTIVEGAMESBFFURL)} isDrill={false}/>
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