import React from 'react';
import ThemeToggle from "../Components/Profile/ThemeToggle";
import {StyleSheet, useWindowDimensions, View} from "react-native";
import SaveGamePreferencesToggle from "../Components/Profile/SaveGamePreferencesToggle";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from "../Components/Header";
import {Text} from "react-native-paper";
import {PreferencesContext} from "../Contexts/PreferencesContext";

const ProfilePage = () => {

    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

    const { updateLearnedLessons, learnedLessons } = React.useContext(PreferencesContext);

    const formatLessonNameArray = (learnedLessons: string[]) => {
        if (!learnedLessons) return "Loading...";
        let formattedLessonArray = [];
        for (let i = 0; i < learnedLessons.length; i++)
        {
            formattedLessonArray.push(formatOneLessonName(learnedLessons[i]));
        }
        return formattedLessonArray.join('\r\n');
    }

    const formatOneLessonName = (lessonName: string) => {
        const words = lessonName.toLowerCase().replaceAll('_', ' ').split(" ");
        for (let i = 0; i < words.length; i++)
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        return words.join(" ");
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Header page={'Profile'}/>
                <View style={homeScreenStyles.home}>
                    <View>
                        <Text style={styles.profileText}>Profile</Text>
                        <ThemeToggle></ThemeToggle>
                        <SaveGamePreferencesToggle></SaveGamePreferencesToggle>
                    </View>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 30 }}>
                    <Text style={{ fontSize: reSize/20, color: '#D9A05B', fontWeight: 'bold', marginBottom: 10 }}>Statistics</Text>
                    <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Strategies Learned:</Text>
                            <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{formatLessonNameArray(learnedLessons)}</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    profileText: {
        fontSize: 20,
        margin: 5,
    },
});

const homeScreenStyles = StyleSheet.create({
    home: {
        display: "flex",
        flexDirection: 'row',
    },
});

export default ProfilePage;