import React from 'react';
import LoginButton from "./Auth0/LoginButton";
import ProfileButton from "./Profile/ProfileButton";
import StatisticsButton from "./Statistics/StatisticsButton";
import {Image, StyleSheet, View, TouchableOpacity} from "react-native";
import HomeButton from "./Home/HomeButton";

const Header = (props: any) => {

    return (
        <View style={styles.toggleIcons}>
            <TouchableOpacity onPress=>
            <Image style={{
                resizeMode: 'cover',
                height: 45,
                width: 100,
            }} source={require('./goldLogoText.png')} /> </TouchableOpacity>
            <View style={styles.profileButtons}>
                {(props.page == 'Landing') ? <></> : (props.page == 'Statistics') ? <HomeButton/> : <StatisticsButton/>}
                {(props.page == 'Landing') ? <></> : (props.page == 'Profile') ? <HomeButton/> : <ProfileButton/>}
                <LoginButton/>
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