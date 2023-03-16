import React from 'react';
import {StyleSheet, View} from "react-native";
import {StatusBar} from "expo-status-bar";

import Header from "../../Components/Header";
import SidebarMenu from "../../Components/SidebarMenu";
import {Text} from "react-native-paper";

const HiddenSingleLesson = () => {

    return (
        <View>
            <Header page={'Lesson'}/>
            <View style={homeScreenStyles.home}>
                <View style={homeScreenStyles.homeMenu}>
                    <SidebarMenu></SidebarMenu>
                </View>
                <View style={homeScreenStyles.lessons}>
                    <View style={styles.container1}>
                        <Text>HiddenSingleLesson</Text>
                        <StatusBar style="auto" />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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

export default HiddenSingleLesson;