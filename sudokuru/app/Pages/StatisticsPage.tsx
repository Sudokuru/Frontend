import React from 'react';
import LoginButton from "../Components/Auth0/LoginButton";
import {StyleSheet, View} from "react-native";
import {Text} from 'react-native-paper';
import ProfileButton from "../Components/Profile/ProfileButton";
import HomeButton from "../Components/Home/HomeButton";

const ProfilePage = () => {

    return (
        <View>
            <View style={styles.toggleIcons}>
                <View style={styles.profileHeader}>
                    <Text style={styles.profileText}>Stats</Text>
                </View>
                <View style={styles.profileButtons}>
                    <HomeButton></HomeButton>
                    <ProfileButton></ProfileButton>
                    <LoginButton></LoginButton>
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

export default ProfilePage;