import React from 'react';
import ThemeToggle from "../Components/Profile/ThemeToggle";
import LoginButton from "../Components/Auth0/LoginButton";
import {StyleSheet, View} from "react-native";
import {Text} from 'react-native-paper';
import SaveGamePreferencesToggle from "../Components/Profile/SaveGamePreferencesToggle";

const ProfilePage = () => {

    return (
        <View>
            <LoginButton></LoginButton>
            <Text style={styles.header}>Profile Page</Text>
            <ThemeToggle></ThemeToggle>
            <SaveGamePreferencesToggle></SaveGamePreferencesToggle>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 40,
    },
});


export default ProfilePage;