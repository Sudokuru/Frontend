// @ts-nocheck
import React, {useEffect} from 'react';
import {Image, Pressable, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from "@react-navigation/native";
import Header from "../Components/Header";
import {getTokenName} from "../Functions/Auth0/token";
import Alert from "react-native-awesome-alerts";
import {useTheme} from "react-native-paper";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import { makePuzzle, pluck, makeBoard } from '../Components/Sudoku Board/sudoku';
import {USERACTIVEGAMESBFFURL} from '@env'
import { StatusBar } from "expo-status-bar";
import { useFonts, Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { List } from 'immutable';
import {getKeyString} from "../Functions/Auth0/token";
import {parseApiAndAddNotes, strPuzzleToArray} from "./DrillPage";

// Sudokuru Package Import
const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js");

// Sudokuru Package Constants
const Puzzles = sudokuru.Puzzles;

const LandingPage = () => {

    const theme = useTheme();

    const navigation: any = useNavigation();
    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const newUser = 1;

    let [fontsLoaded] = useFonts({
        Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
    });

    if (!fontsLoaded) {
        return null;
    }

    async function canProceed() {
        await getTokenName().then(
            result => {
                if (result != ""){
                    if(newUser == 1){
                    navigation.navigate('Home');
                    }
                    else{
                    navigation.navigate('Lesson',{params:'AMEND_NOTES'});
                    }
                } else {
                    showModal();
                }
            });
    }

    async function getLandingGame() {
        game = Puzzles.getRandomGame()
        let board = makeBoard(strPuzzleToArray(game[0].puzzle), game[0].puzzle);
        return {
            board,
            history: List.of(board),
            historyOffSet: 0,
            solution: game[0].puzzleSolution,
            activeGame: game,
        };
    }

    function getHint(board, solution)
    {
      let boardArray = componentBoardValsToArray(board);
      let notesArray = componentBoardNotesToArray(board);
      let solutionArray = componentSolutionValsToArray(solution);
      let hint;
      try {
        hint = Puzzles.getHint(boardArray, notesArray, strategies, solutionArray);
      } catch (e) {
        console.log(e);
      }
      return hint;
    }
    
    return (
            <SafeAreaProvider>
                <SafeAreaView>
                    <View>
                        <Header page={'Landing'}/>
                        <View style={styles(reSize).container}>
                            <View style={styles(reSize).boxtext}>
                                <View style={styles(reSize).inner3}>
                                    <Text style={{ fontSize: reSize / 20, color: theme.colors.onPrimary }}> Your Guide to Becoming a </Text>
                                    <Text style={{ fontSize: reSize / 20, color: theme.colors.primary }}> Sudoku Guru </Text>
                                    <Pressable
                                        style={({ pressed }) => [
                                            { opacity: pressed ? 0.5 : 1.0, backgroundColor: theme.colors.primary }
                                        ]}
                                        onPress={async () => {
                                            await canProceed();
                                        }}>
                                        <View>
                                            <Text style={{ fontSize: reSize / 20, color: theme.colors.onPrimary }}> Get Started </Text>
                                        </View>
                                    </Pressable>
                                </View>
                            </View>
                            <SudokuBoard generatedGame={getLandingGame()} isDrill={true} getHint={getHint}/>
                        </View>
                    </View>
                </SafeAreaView>
                <Alert
                    show={visible}
                    message="Please Login!"
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    confirmButtonColor={theme.colors.background}
                    onConfirmPressed={() => {
                        hideModal();
                    }}
                />
            </SafeAreaProvider>
    );
};

const styles = (size: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    box: {
        flexDirection: 'row',
        display: 'flex',
        width: '50%',
        height: '70%',
    },
    boxtext: {
        flexDirection: 'row',
        display: 'flex',
        width: '50%',
        height: '30%',
    },
    box4: {
        width: '100%',
        height: '20%',
    },
    menubox: {
        width: '30%',
        height: '13%',
    },
    midbox: {
        width: '50%',
        height: '20%',
    },
    box1: {
        width: '20%',
        height: '20%',
        justifyContent: 'center'
    },
    inner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inner3: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    inner2: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    profileButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
})

export default LandingPage;