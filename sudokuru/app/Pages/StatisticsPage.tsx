import React from 'react';
import LoginButton from "../Components/Auth0/LoginButton";
import {StyleSheet, View} from "react-native";
import {Text} from 'react-native-paper';
import ProfileButton from "../Components/Profile/ProfileButton";
import HomeButton from "../Components/Landing/HomeButton";
import SidebarMenu from "../Components/SidebarMenu";

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
            <View style={homeScreenStyles.home}>
                <View style={homeScreenStyles.homeMenu}>
                    <SidebarMenu></SidebarMenu>
                </View>
                <View style={homeScreenStyles.lessons}>
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
        flexDirection: 'row',
        flexWrap: "wrap",
    },
});

export default ProfilePage;