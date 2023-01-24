import React from 'react';
import ThemeToggle from "../Components/Profile/ThemeToggle";
import LoginButton from "../Components/Auth0/LoginButton";
import {View} from "react-native";
import SaveGameHistoryToggle from "../Components/Profile/SaveGameHistoryToggle";

const ProfilePage = () => {

    return (
        <View>
            <LoginButton></LoginButton>
            <ThemeToggle></ThemeToggle>
            <SaveGameHistoryToggle></SaveGameHistoryToggle>
        </View>
    );
};

export default ProfilePage;