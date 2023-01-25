import React from 'react';
import ThemeToggle from "../Components/Profile/ThemeToggle";
import LoginButton from "../Components/Auth0/LoginButton";
import {StyleSheet, View} from "react-native";
import {Text} from 'react-native-paper';
import SaveGamePreferencesToggle from "../Components/Profile/SaveGamePreferencesToggle";
import StatisticsButton from "../Components/Statistics/StatisticsButton";
import HomeButton from "../Components/Home/HomeButton";
import HomeMenu from "../Components/Home/HomeMenu";
import LessonCard from "../Components/Learn/LessonCard";

const ProfilePage = () => {

    return (
        <View>
            <View style={styles.toggleIcons}>
                <View style={styles.profileHeader}>
                    <Text style={styles.profileText}>Profile Page</Text>
                </View>
                <View style={styles.profileButtons}>
                    <StatisticsButton></StatisticsButton>
                    <HomeButton></HomeButton>
                    <LoginButton></LoginButton>
                </View>
            </View>
            <View style={homeScreenStyles.home}>
                <View style={homeScreenStyles.homeMenu}>
                    <HomeMenu></HomeMenu>
                </View>
                <View style={homeScreenStyles.lessons}>
                    <ThemeToggle></ThemeToggle>
                    <SaveGamePreferencesToggle></SaveGamePreferencesToggle>
                </View>
            </View>
        </View>
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
});

const homeScreenStyles = StyleSheet.create({
    home: {
        display: "flex",
        flexDirection: 'row',
        //backgroundColor: 'red',
    },
    homeMenu: {
        //backgroundColor: 'red',
        width: "15%",
    },
    lessons: {
        //backgroundColor: 'blue',
        width: "85%",
        alignContent: "flex-start",
        flexDirection: 'column',
        flexWrap: "wrap",
    },
});

export default ProfilePage;