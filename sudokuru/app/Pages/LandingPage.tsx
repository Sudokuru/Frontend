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
import { TextSize } from 'victory-native';

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

    let strategies = ["AMEND_NOTES", "SIMPLIFY_NOTES", "NAKED_SINGLE", "NAKED_PAIR", "NAKED_TRIPLET", "NAKED_QUADRUPLET", "HIDDEN_SINGLE", "HIDDEN_PAIR", "HIDDEN_TRIPLET", "HIDDEN_QUADRUPLET"];

    let [fontsLoaded] = useFonts({
        Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
    });

    if (!fontsLoaded) {
        return null;
    }

    async function canProceed() {
        await getTokenName().then(
            result => {
                if (result != ""){
                    if(newUser == 1){
                        navigation.replace('Home');
                        return null;
                    }
                    else{
                        navigation.replace('Lesson',{params:'AMEND_NOTES'});
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

    function componentBoardValsToArray(board)
    {
    let boardArray = [];
    let temp = [];
    for (let i = 0; i < 9; i++)
    {
        temp = [];
        for (let j = 0; j < 9; j++)
        {
        currVal = board.get('puzzle').getIn([i, j, 'value']);
        temp.push(!currVal ? "0" : currVal.toString());
        }
        boardArray.push(temp);
    }
    return boardArray;
    }

    function componentBoardNotesToArray(board)
    {
    let notesArray = [];
    let temp = [];
    for (let i = 0; i < 9; i++)
    {
        for (let j = 0; j < 9; j++)
        {
        temp = [];
        let notesSetFromComponent = board.get('puzzle').getIn([i, j, 'notes']);
        if (!notesSetFromComponent) 
        {
            notesArray.push(temp);
            continue;
        }
        for (let k = 1; k <= 9; k++)
        {
            if (notesSetFromComponent.includes(k))
            {
            temp.push((k).toString());
            }
        }
        notesArray.push(temp);
        }
    }
    return notesArray;
    }

    function componentSolutionValsToArray(solution)
    {
    let solArray = [];
    let temp = [];
    for (let i = 0; i < 9; i++)
    {
        temp = [];
        for (let j = 0; j < 9; j++)
        {
        temp.push(solution[9 * j + i].toString());
        }
        solArray.push(temp);
    }
    return solArray;
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
            <View style={{ flex: 1 }}>
            <Header page={'Landing'} />
            <View style={{ flex: 1, alignItems: 'center', marginTop: 50 }}>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: theme.colors.onPrimary, fontSize: reSize/25, fontStyle: 'normal' }}> Your path to </Text>
                    <Text style={{ color: theme.colors.onPrimary, fontSize: reSize/25, fontStyle: 'normal' }}> becoming a </Text>
                    <Text style={{ color: theme.colors.primary, fontSize: reSize/16, fontStyle: 'bold' }}> Sudoku Guru </Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <SudokuBoard generatedGame={getLandingGame()} isLanding={true} getHint={getHint} />
                </View>
                </View>
                <View style={{ alignItems: 'center', marginTop: reSize / 20 }}>
                <Pressable
                    style={({ pressed }) => [
                    { opacity: pressed ? 0.5 : 1.0, backgroundColor: theme.colors.primary, borderRadius: 15 },
                    ]}
                    onPress={async () => {
                    await canProceed();
                    }}>
                    <View>
                        <Text style={{ color: theme.colors.onPrimary, fontSize: reSize/19, marginBottom: 5 }}> Get Started </Text>
                    </View>
                </Pressable>
                </View>
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

export default LandingPage;