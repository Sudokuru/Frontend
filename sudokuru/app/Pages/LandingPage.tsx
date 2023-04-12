// @ts-nocheck
import React from 'react';
import {Pressable, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from "@react-navigation/native";
import Header from "../Components/Header";
import {getTokenName} from "../Functions/Auth0/token";
import Alert from "react-native-awesome-alerts";
import {useTheme} from "react-native-paper";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import { useFonts, Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';


const LandingPage = () => {

    const theme = useTheme();

    const isWeb = (Platform.OS === 'web');

    const navigation: any = useNavigation();
    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const newUser = 1;

    let strategies = ["AMEND_NOTES", "SIMPLIFY_NOTES", "NAKED_SINGLE", "NAKED_PAIR", "NAKED_TRIPLET", "NAKED_QUADRUPLET", "HIDDEN_SINGLE", "HIDDEN_PAIR", "HIDDEN_TRIPLET", "HIDDEN_QUADRUPLET"];

    let [fontsLoaded] = useFonts({
        Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_700Bold
    });

    if (!fontsLoaded) {
        return null;
    }

    async function canProceed() {
        await getTokenName().then(
            result => {
                if (result != ""){
                    if(newUser == 1){
                        navigation.replace('Home');
                        return null;
                    }
                    else{
                        navigation.replace('Lesson',{params:'AMEND_NOTES'});
                    }
                } else {
                    showModal();
                }
            });
    }


    if (isWeb && size.width > size.height / .63) {
        return (
            <SafeAreaProvider>
            <SafeAreaView>
                <View>
                <Header page={'Landing'} />
                <View style={{ flex: 1, alignItems: 'center', marginTop: 50 }}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: reSize / 6 }}>
                            <Text style={{ color: theme.colors.onPrimary, fontSize: reSize/18 }}>Your path to becoming a</Text>
                            <Text style={{ color: theme.colors.primary, fontSize: reSize/12 }}> Sudoku Guru </Text>
                            <View style={{ alignItems: 'center', marginTop: reSize / 18 }}>
                                <Pressable
                                    style={({ pressed }) => [
                                        { opacity: pressed ? 0.5 : 1.0, backgroundColor: theme.colors.primary, borderRadius: reSize / 120, padding: reSize / 120 },
                                    ]}
                                    onPress={async () => {
                                        await canProceed();
                                    }}>
                                    <View>
                                        <Text style={{ color: theme.colors.onPrimary, fontSize: reSize/19, marginBottom: reSize / 140 }}>
                                        Get Started
                                        </Text>
                                    </View>
                                </Pressable>
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: reSize / 6 }}>
                            <SudokuBoard isLanding={true} strategies={strategies} />
                        </View>
                    </View>
                </View>
            </View>
            </SafeAreaView>
            <Alert
                show={visible}
                message="Please Login!"
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmButtonColor={theme.colors.background}
                onConfirmPressed={() => {
                hideModal();
                }}
            />
            </SafeAreaProvider>
        );
    } else {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{height: '100%', width: '100%'}}>
                    <View>
                    <Header page={'Landing'} />
                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                        <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.onPrimary, fontSize: reSize/18, marginBottom: 20 }}>
                            Your path to becoming a
                        </Text>
                        <Text style={{ color: theme.colors.primary, fontSize: reSize/12, marginBottom: 20 }}>
                            Sudoku Guru
                        </Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                        <SudokuBoard generatedGame={getLandingGame()} isLanding={true} getHint={getHint} />
                        <View style={{ alignItems: 'center', marginTop: reSize / 18 }}>
                            <Pressable
                                style={({ pressed }) => [
                                    { opacity: pressed ? 0.5 : 1.0, backgroundColor: theme.colors.primary, borderRadius: reSize / 120, padding: reSize / 50 },
                                ]}
                                onPress={async () => {
                                    await canProceed();
                                }}>
                                <View>
                                    <Text style={{ color: theme.colors.onPrimary, fontSize: reSize/19, marginBottom: reSize / 140 }}>
                                    Get Started
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                        </View>
                    </View>
                    </View>
                </SafeAreaView>
                <Alert
                    show={visible}
                    message="Please Login!"
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    confirmButtonColor={theme.colors.background}
                    onConfirmPressed={() => {
                    hideModal();
                    }}
                />
            </SafeAreaProvider>
        );
    }
};

export default LandingPage;