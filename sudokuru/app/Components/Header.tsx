import React from 'react';
import LoginButton from "./Auth0/LoginButton";
import ProfileButton from "./Profile/ProfileButton";
import StatisticsButton from "./Statistics/StatisticsButton";
import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import HomeButton from "./Home/HomeButton";
import {useNavigation} from "@react-navigation/native";

const Header = (props: any) => {

    const navigation: any = useNavigation();

    return (
        <View style={styles.toggleIcons}>
            {
                /*
                 * If we are on the landing page, Logo will not navigate to the Home page
                 * If we are on any other page, Logo wil navigate to the Home page
                 */
                (props.page == 'Landing') ?
                    <Image style={{
                        resizeMode: 'cover',
                        height: 45,
                        width: 100,
                    }} source={require('./goldLogoText.png')} />
                     : <Pressable  onPress={() => navigation.navigate('Main Page')} >
                    <Image style={{
                        resizeMode: 'cover',
                        height: 45,
                        width: 100,
                    }} source={require('./goldLogoText.png')} />
                </Pressable>
            }
            <View style={styles.profileButtons}>
                {(props.page == 'Landing') ? <></> : (props.page == 'Statistics') ? <HomeButton/> : <StatisticsButton/>}
                {(props.page == 'Landing') ? <></> : (props.page == 'Profile') ? <HomeButton/> : <ProfileButton/>}
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