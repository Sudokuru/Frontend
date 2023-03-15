import React from 'react';
import LoginButton from "../Components/Auth0/LoginButton";
import {StyleSheet, View} from "react-native";
import {Text} from 'react-native-paper';
import ProfileButton from "../Components/Profile/ProfileButton";
import HomeButton from "../Components/Home/HomeButton";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from "../Components/Header";

const ProfilePage = () => {

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Header page={'Statistics'}/>
                <View style={homeScreenStyles.home}>
                    <Text style={styles.profileText}>Statistics</Text>
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