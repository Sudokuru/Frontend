import React from 'react';
import LoginButton from "../Components/Auth0/LoginButton";
import {StyleSheet, View} from "react-native";
import {Text} from 'react-native-paper';
import ProfileButton from "../Components/Profile/ProfileButton";
import StatisticsButton from "../Components/Statistics/StatisticsButton";
import SidebarMenu from "../Components/SidebarMenu";
import Slider from '@react-native-community/slider';
import {StatusBar} from "expo-status-bar";
import CCarousel from "../Components/Home/Carousel";

import { useFonts, Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';

const HomePage = () => {

    let [fontsLoaded] = useFonts({
        Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View>
            <View style={styles.toggleIcons}>
                <View style={styles.profileHeader}>
                    <Text style={styles.profileText}>Sudokuru</Text>
                </View>
                <View style={styles.profileButtons}>
                    <StatisticsButton></StatisticsButton>
                    <ProfileButton></ProfileButton>
                    <LoginButton></LoginButton>
                </View>
            </View>
            <View style={homeScreenStyles.home}>
                <View style={homeScreenStyles.homeMenu}>
                    <SidebarMenu></SidebarMenu>
                </View>
                <View style={homeScreenStyles.lessons}>
                    <View style={styles.container1}>
                        <CCarousel/>
                        <Slider
                            style={{width: 200, height: 40}}
                            minimumValue={0}
                            maximumValue={100}
                            step={10}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                        />
                        <StatusBar style="auto" />
                    </View>
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
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container1: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
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

export default HomePage;