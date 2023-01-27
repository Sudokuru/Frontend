import {StyleSheet, View} from "react-native";
import React from "react";
import LessonCard from "../Components/Learn/LessonCard";
import HomeMenu from "../Components/Home/HomeMenu";
import {Text} from "react-native-paper";
import StatisticsButton from "../Components/Statistics/StatisticsButton";
import ProfileButton from "../Components/Profile/ProfileButton";
import LoginButton from "../Components/Auth0/LoginButton";


const DrillPage = () => {

    return (
        <View>
            <View style={styles.toggleIcons}>
                <View style={styles.profileHeader}>
                    <Text style={styles.profileText}>Drills</Text>
                </View>
                <View style={styles.profileButtons}>
                    <StatisticsButton></StatisticsButton>
                    <ProfileButton></ProfileButton>
                    <LoginButton></LoginButton>
                </View>
            </View>
            <View style={homeScreenStyles.home}>
                <View style={homeScreenStyles.homeMenu}>
                    <HomeMenu></HomeMenu>
                </View>
                <View style={homeScreenStyles.lessons}>
                    <LessonCard title={"Naked Single"}></LessonCard>
                    <LessonCard title={"Hidden Single"}></LessonCard>
                    <LessonCard title={"Naked Pair"}></LessonCard>
                    <LessonCard title={"Naked Triplet"}></LessonCard>
                    <LessonCard title={"Naked Quadruplet"}></LessonCard>
                    <LessonCard title={"Naked Quintuplet"}></LessonCard>
                    <LessonCard title={"Naked Sextuplet"}></LessonCard>
                    <LessonCard title={"Naked Septuplet"}></LessonCard>
                    <LessonCard title={"Naked Octuplet"}></LessonCard>
                    <LessonCard title={"Hidden Pair"}></LessonCard>
                    <LessonCard title={"Hidden Triplet"}></LessonCard>
                    <LessonCard title={"Hidden Quadruplet"}></LessonCard>
                    <LessonCard title={"Hidden Quintuplet"}></LessonCard>
                    <LessonCard title={"Hidden Sextuplet"}></LessonCard>
                    <LessonCard title={"Hidden Septuplet"}></LessonCard>
                    <LessonCard title={"Hidden Octuplet"}></LessonCard>
                    <LessonCard title={"Pointing Pair"}></LessonCard>
                    <LessonCard title={"Pointing Triplet"}></LessonCard>
                    <LessonCard title={"Box Line Reduction"}></LessonCard>
                    <LessonCard title={"X_Wing"}></LessonCard>
                    <LessonCard title={"Swordfish"}></LessonCard>
                    <LessonCard title={"Singles Chaining"}></LessonCard>
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

export default DrillPage;