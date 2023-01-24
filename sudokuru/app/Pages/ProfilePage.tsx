import React from 'react';
import ThemeToggle from "../Components/Profile/ThemeToggle";
import LoginButton from "../Components/Auth0/LoginButton";
import {View} from "react-native";

const ProfilePage = () => {

    return (
        <View>
            <LoginButton></LoginButton>
            <ThemeToggle></ThemeToggle>
        </View>
    );
};

export default ProfilePage;