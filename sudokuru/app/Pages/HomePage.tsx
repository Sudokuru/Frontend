import React from 'react';
import { useState } from 'react';
import {StyleSheet, View, Pressable, useWindowDimensions} from "react-native";
import {Text, Button, useTheme, ActivityIndicator} from 'react-native-paper';
import {StatusBar} from "expo-status-bar";
import {useNavigation} from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/core";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import Header from "../Components/Header";
import DifficultySlider from '../Components/Home/DifficultySlider';
import {getKeyString} from "../Functions/Auth0/token";
import {USERACTIVEGAMESBFFURL, USERGAMESTATISTICSBFFURL} from '@env'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import Alert from "react-native-awesome-alerts";
import {PreferencesContext} from "../Contexts/PreferencesContext";
import LessonPanel from "../Components/Home/LessonPanel";
import LessonButton from "../Components/Home/LessonButton";

const HomePage = () => {
    const navigation: any = useNavigation();

    // Sudokuru Package Import
    const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js");

    // Sudokuru Package Constants
    const Puzzles = sudokuru.Puzzles;
    const Statistics = sudokuru.Statistics;

    const theme = useTheme();

    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height) / 25;

    const { updateLearnedLessons, learnedLessons } = React.useContext(PreferencesContext);

    const [areLessonsLoaded, setLessonsLoaded] = React.useState(false);

    const [resumeVisible, setResumeVisible] = React.useState(false);
    const showResumeButton = () => setResumeVisible(true);
    const hideResumeButton = () => setResumeVisible(false);

    const [drillsVisible, setDrillsVisible] = React.useState(true);
    const showDrillsButton = () => setDrillsVisible(true);
    const hideDrillsButton = () => setDrillsVisible(false);

    const [gameVisible, setGameVisible] = React.useState(true);
    const showGameButton = () => setGameVisible(true);
    const hideGameButton = () => setGameVisible(false);

    const [learnHelpVisible, setLearnHelpVisible] = React.useState(false);
    const showLearnHelp = () => setLearnHelpVisible(true);
    const hideLearnHelp = () => setLearnHelpVisible(false);

    const [drillHelpVisible, setDrillHelpVisible] = React.useState(false);
    const showDrillHelp = () => setDrillHelpVisible(true);
    const hideDrillHelp = () => setDrillHelpVisible(false);

    const [playHelpVisible, setPlayHelpVisible] = React.useState(false);
    const showPlayHelp = () => setPlayHelpVisible(true);
    const hidePlayHelp = () => setPlayHelpVisible(false);

    const [difficulty, setDifficulty] = useState(50);

    const getData = (val: any) => {
        setDifficulty(val);
    }

    useFocusEffect(
        React.useCallback(() => {

            // Show and display home content depending on canPlay function
            if (!canPlay(true)){
                hideDrillsButton();
            } else {
                showDrillsButton();
            }
            if (!canPlay(false)){
                hideResumeButton();
                hideGameButton();
                return;
            } else {
                showGameButton();
            }

            // This determines if user has active game and displays resume button conditionally.
            async function grabCurrentGame(url: string) {
                let token = null;
                await getKeyString("access_token").then(result => {
                    token = result;
                });

                await Puzzles.getGame(url, token).then(
                    (game: any) => {
                        if (game !== null && game[0].moves.length > 0) {
                            showResumeButton();
                        } else {
                            hideResumeButton();
                        }
                    });
            }
            grabCurrentGame(USERACTIVEGAMESBFFURL);
    }, [learnedLessons]));

    useFocusEffect(
        React.useCallback(() => {
            // This determines what lessons the user has learned and conditionally displays everything.
            async function getUserLearnedLessons(url: string) {

                let token = null;
                await getKeyString("access_token").then(result => {
                    token = result;
                });

                await Statistics.getLearnedLessons(url, token).then((lessons: any) => {
                    if (lessons !== null) {
                        // prevent the infinite loop
                        if (learnedLessons != lessons.strategiesLearned && !areLessonsLoaded) {
                            updateLearnedLessons(lessons.strategiesLearned);
                        }

                        setLessonsLoaded(true);
                    }
                    else {
                        console.log("Error retrieving lessons of user");
                    }
                });
            }
            getUserLearnedLessons(USERGAMESTATISTICSBFFURL);
        }, [learnedLessons]));

    // returns if user can play game or do drills
    function canPlay(drill: boolean):boolean {
        if (!(learnedLessons.includes("SUDOKU_101")) || !(learnedLessons.includes("AMEND_NOTES")) ||
             !(learnedLessons.includes("NAKED_SINGLE"))) {
            return false;
        }
        if (!drill && !(learnedLessons.includes("SIMPLIFY_NOTES"))) {
            return false;
        }
        return true;
    }

    let [fontsLoaded] = useFonts({
        Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{height: '100%', width: '100%'}}>
                <Header page={'Home'}/>
                <View style={styles.container}>
                    <View style={styles.container1}>

                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: theme.colors.onPrimary, fontSize: reSize,  fontWeight: 'bold'}}>Learn </Text>
                            <Text style={{color: theme.colors.primary, fontSize: reSize,  fontWeight: 'bold'}}>new strategies</Text>
                            <Pressable onPress={() => showLearnHelp()}>
                                <MaterialCommunityIcons color={theme.colors.onPrimary} name="help"/>
                            </Pressable>
                        </View>

                        {
                            (areLessonsLoaded) ? <LessonPanel/> : <ActivityIndicator animating={true} color={theme.colors.primary} />
                        }


                        <View style={{top:reSize/2, flexDirection: 'row', padding: reSize/4}}>
                            <Text style={{color: theme.colors.onPrimary, fontSize: reSize,  fontWeight: 'bold'}}>Train </Text>
                            <Text style={{color: theme.colors.primary, fontSize: reSize,  fontWeight: 'bold'}}>with a strategy</Text>
                            <Pressable onPress={() => showDrillHelp()}>
                                <MaterialCommunityIcons color={theme.colors.onPrimary} name="help"/>
                            </Pressable>
                        </View>

                        {
                            (drillsVisible) ?
                                <View style={{padding: reSize/4}}>
                                    <Button style={{top:reSize/2}}
                                            mode="contained"
                                            onPress={() => {navigation.openDrawer()}}
                                    >
                                        Start Drill
                                    </Button>
                                </View> :
                                <LessonButton
                                    backgroundColor={"grey"}
                                    disabled={true}
                                ></LessonButton>
                        }

                        <View style={{top:20, flexDirection: 'row', padding: reSize/4}}>
                            <Text style={{color: theme.colors.onPrimary, fontSize: reSize,  fontWeight: 'bold'}}>Play </Text>
                            <Text style={{color: theme.colors.primary, fontSize: reSize,  fontWeight: 'bold'}}>with a random puzzle</Text>
                            <Pressable onPress={() => showPlayHelp()}>
                                <MaterialCommunityIcons color={theme.colors.onPrimary} name="help"/>
                            </Pressable>
                        </View>

                        {
                            (gameVisible) ?
                                <View style={{top:reSize/2, padding: reSize/4}}>
                                    <DifficultySlider sendData={getData}/>
                                </View> : <></>
                        }

                        <View style={{top: reSize/2, flexDirection: 'row'}}>
                            {
                                (resumeVisible) ?
                                    <Button style={{right: reSize}} mode="outlined"
                                            onPress={() => navigation.navigate('Sudoku', {gameType: "ResumeGame"})}
                                    >
                                        Resume Puzzle
                                    </Button> : <></>
                            }

                            {
                                (gameVisible) ?
                                    <Button mode="contained"
                                            onPress={() => {
                                                    navigation.navigate('Sudoku', {gameType: "StartGame", difficulty: (difficulty / 100)})
                                            }}
                                    >
                                        Start Puzzle
                                    </Button> :
                                    <LessonButton
                                        backgroundColor={"grey"}
                                        disabled={true}
                                    ></LessonButton>
                            }
                        </View>

                        <StatusBar style="auto" />
                    </View>
                </View>
                <Alert
                    show={learnHelpVisible}
                    title="Learning Help"
                    message=
                        {
                        `Select a strategy to learn by clicking on the lesson button that is not greyed out.\n\n` +
                        `Lessons ensure that you will not encounter Sudoku puzzles with strategies you are unfamiliar with.\n\n` +
                        `As you learn, more features of the app will be unlocked!\n\n` +
                        `Lessons can only be completed in a set order, from left to right, top to bottom. \n\n` +
                        `Strategies you have already learned will be greyed out, but you will still have access to them.`
                        }
                    messageStyle={{maxWidth: 500}}
                    showConfirmButton={true}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    confirmText={"OK"}
                    confirmButtonColor={theme.colors.background}
                    onConfirmPressed={() => {
                        hideLearnHelp();
                    }}
                />
                <Alert
                    show={drillHelpVisible}
                    title="Drill Help"
                    message=
                        {
                        `Drills are a place where you can practice a strategy.\n\n` +
                        `When you click the "Start Drill" button, a menu will appear on the left side of your screen with a list of all strategies you can practice.\n\n` +
                        `Selecting a strategy from the list will navigate you to the Drill page. This page has a puzzle where you must use the strategy to solve the next step in the puzzle.\n\n` +
                        `Each drill is unlocked after completing the corresponding lesson!`
                        }
                    messageStyle={{maxWidth: 500}}
                    showConfirmButton={true}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    confirmText={"OK"}
                    confirmButtonColor={theme.colors.background}
                    onConfirmPressed={() => {
                        hideDrillHelp();
                    }}
                />
                <Alert
                    show={playHelpVisible}
                    title="Play Help"
                    message=
                        {
                        `To play a puzzle, select a difficulty using the difficulty slider and press the "Play Puzzle" button.\n\n` +
                        `You will only be served puzzles with strategies that you have already learned! This will ensure that you will not encounter a puzzle that you don't have the skills and knowledge to solve.` +
                        `If you have a game currently in progress, you can resume the game by clicking the "Resume Puzzle" button`
                        }
                    messageStyle={{maxWidth: 500}}
                    showConfirmButton={true}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    confirmText={"OK"}
                    confirmButtonColor={theme.colors.background}
                    onConfirmPressed={() => {
                        hidePlayHelp();
                    }}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};


const styles = StyleSheet.create({
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
});

export default HomePage;