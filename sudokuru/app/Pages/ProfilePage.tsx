import React from 'react';
import ThemeToggle from "../Components/Profile/ThemeToggle";
import {StyleSheet, View} from "react-native";
import SaveGamePreferencesToggle from "../Components/Profile/SaveGamePreferencesToggle";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from "../Components/Header";
import {Text} from "react-native-paper";

const ProfilePage = () => {

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Header page={'Profile'}/>
                <View style={homeScreenStyles.home}>
                    <View>
                        <Text style={styles.profileText}>Profile</Text>
                        <ThemeToggle></ThemeToggle>
                        <SaveGamePreferencesToggle></SaveGamePreferencesToggle>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    profileText: {
        fontSize: 20,
        margin: 5,
    },
});

const homeScreenStyles = StyleSheet.create({
    home: {
        display: "flex",
        flexDirection: 'row',
    },
});

export default ProfilePage;