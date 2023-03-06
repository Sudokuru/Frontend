import React from 'react';
import LoginButton from "../Components/Auth0/LoginButton";
import {StyleSheet, View} from "react-native";
import {Text} from 'react-native-paper';
import ProfileButton from "../Components/Profile/ProfileButton";
import HomeButton from "../Components/Home/HomeButton";
import SidebarMenu from "../Components/SidebarMenu";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ProfilePage = () => {

    return (
        <SafeAreaProvider>
            <SafeAreaView>
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
                <View style={homeScreenStyles.home}>
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
});

const homeScreenStyles = StyleSheet.create({
    home: {
        display: "flex",
        flexDirection: 'row',
        //backgroundColor: 'red',
    },
});

export default ProfilePage;