import React from 'react';
import ThemeToggle from "../Components/Profile/ThemeToggle";
import LoginButton from "../Components/Auth0/LoginButton";
import {View} from "react-native";
import SaveGameHistoryToggle from "../Components/Profile/SaveGameHistoryToggle";
import SaveGamePreferencesToggle from "../Components/Profile/SaveGamePreferencesToggle";

const ProfilePage = () => {

    return (
        <View>
            <LoginButton></LoginButton>
            <ThemeToggle></ThemeToggle>
            <SaveGameHistoryToggle></SaveGameHistoryToggle>
            <SaveGamePreferencesToggle></SaveGamePreferencesToggle>
        </View>
    );
};

export default ProfilePage;