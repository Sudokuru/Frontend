import React from 'react';
import {StyleSheet} from "react-native";
import BoardBox from '../Components/Learn/BoardBox';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const PuzzlePage = () => {

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <BoardBox/>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
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
        padding: 15,
        marginRight: 10,
    },
});

const homeScreenStyles = StyleSheet.create({
    home: {
        display: "flex",
        flexDirection: 'row',
        //backgroundColor: 'red',
    },
});

export default PuzzlePage;