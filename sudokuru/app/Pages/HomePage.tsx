import React from 'react';
import LoginButton from "../Components/Auth0/LoginButton";
import {StyleSheet, View, Platform} from "react-native";
import {Text, Button, Drawer} from 'react-native-paper';
import ProfileButton from "../Components/Profile/ProfileButton";
import StatisticsButton from "../Components/Statistics/StatisticsButton";
import SidebarMenu from "../Components/SidebarMenu";
import Slider from '@react-native-community/slider';
import {StatusBar} from "expo-status-bar";
import CCarousel from "../Components/Home/Carousel";
import {useNavigation} from "@react-navigation/native";
import { createDrawerNavigator, DrawerItem} from '@react-navigation/drawer';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';

const HomePage = () => {
    const navigation: any = useNavigation();

    let [fontsLoaded] = useFonts({
        Inter_100Thin, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
    });

    if (!fontsLoaded) {
        return null;
    }
 if(Platform.OS === 'web'){
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
                <View>
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
                        <Button style={{top:50}} mode="contained" onPress={() => navigation.navigate('Sudoku')}>
                            Start
                        </Button>
                        <StatusBar style="auto" />
                    </View>
                </View>
            </View>
        </View>
    );}
    else{
        return(
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>

                    <Button style={styles.loginButton} mode="contained" onPress={() => navigation.openDrawer()}>
                                    Start
                    </Button>

                    <View>
                        <Text style={{top:-20}}>
                        <Text style={{color: '#D9A05B', fontSize: 30,  fontWeight: 'bold'}}>Discover </Text>
                        <Text style={{color: '#D9A05B', fontSize: 30,  fontWeight: 'bold'}}>new strategies</Text>
                        </Text>
                    </View>

                    <View>
                    <CCarousel/>
                    </View>

                    <View>
                        <Text style={{top:20}}>
                        <Text style={{color: '#D9A05B', fontSize: 28,  fontWeight: 'bold'}}>Train </Text>
                        <Text style={{color: '#F2F2F2', fontSize: 28,  fontWeight: 'bold'}}>with a random puzzle</Text>
                        </Text>
                    </View>

                    <View>
                    <Slider
                    style={{width: 300, height: 40, top:30}}
                    minimumValue={0}
                    maximumValue={100}
                    step={10}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    />
                    </View>
                    <Button style={{top:50}} mode="contained" onPress={() => navigation.navigate('Sudoku')}>
                        Start
                    </Button>


                </SafeAreaView>
            </SafeAreaProvider>
    );
    }
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
    loginButton:{
        position: 'absolute',
        right: 10,
        top: 45
      },
});

const homeScreenStyles = StyleSheet.create({
    home: {
        display: "flex",
        flexDirection: 'row',
        //backgroundColor: 'red',
    },
});

export default HomePage;