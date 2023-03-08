import React from 'react';
import LoginButton from "../Components/Auth0/LoginButton";
import {StyleSheet, View} from "react-native";
import {Text} from 'react-native-paper';
import ProfileButton from "../Components/Profile/ProfileButton";
import StatisticsButton from "../Components/Statistics/StatisticsButton";
import SidebarMenu from "../Components/SidebarMenu";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import {StatusBar} from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';

const SudokuPage = () => {

    let [fontsLoaded] = useFonts({
        Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <View style={styles.toggleIcons}>
                    <View style={styles.profileHeader}>
                        <Text style={styles.profileText}>Sudokuru</Text>
                    </View>
                    <View style={styles.profileButtons}>
                        <StatisticsButton></StatisticsButton>
                        <ProfileButton></ProfileButton>
                        <LoginButton></LoginButton>
                    </View>
                </View>
                <View style={homeScreenStyles.home}>
                    <View style={styles.container}>
                        <SudokuBoard boolVal={true} boolVal2={false}/>
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
        //backgroundColor: 'red',
    },
});

export default SudokuPage;