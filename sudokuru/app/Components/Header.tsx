import React from 'react';
import LoginButton from "./Auth0/LoginButton";
import ProfileButton from "./Profile/ProfileButton";
import StatisticsButton from "./Statistics/StatisticsButton";
import {StyleSheet, View} from "react-native";
import {Text} from 'react-native-paper';

const Header = () => {

    return (
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
    )
}

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
    }
});

export default Header;