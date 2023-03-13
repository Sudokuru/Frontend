import React from 'react';
import ThemeToggle from "../Components/Profile/ThemeToggle";
import LoginButton from "../Components/Auth0/LoginButton";
import {StyleSheet, View} from "react-native";
import SaveGamePreferencesToggle from "../Components/Profile/SaveGamePreferencesToggle";
import StatisticsButton from "../Components/Statistics/StatisticsButton";
import HomeButton from "../Components/Home/HomeButton";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ProfilePage = () => {

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <View style={styles.toggleIcons}>
                    <View style={styles.profileButtons}>
                        <StatisticsButton></StatisticsButton>
                        <HomeButton></HomeButton>
                        <LoginButton></LoginButton>
                    </View>
                </View>
                <View style={homeScreenStyles.home}>
                    <View>
                        <ThemeToggle></ThemeToggle>
                        <SaveGamePreferencesToggle></SaveGamePreferencesToggle>
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
        margin: 5,
    },
    profileButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});

const homeScreenStyles = StyleSheet.create({
    home: {
        display: "flex",
        flexDirection: 'row',
        //backgroundColor: 'red',
    },
});

export default ProfilePage;