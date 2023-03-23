import React from 'react';
import {Image, Pressable, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {SafeAreaProvider, SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from "@react-navigation/native";
import Header from "../Components/Header";
import {getTokenName} from "../Functions/Auth0/token";
import Alert from "react-native-awesome-alerts";
import {useTheme} from "react-native-paper";

const LandingPage = () => {

    const theme = useTheme();

    const navigation: any = useNavigation();
    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    async function canProceed() {
        await getTokenName().then(
            result => {
                if (result != ""){
                    navigation.navigate('Home');
                } else {
                    showModal();
                }
            });
    }

    return (
            <SafeAreaProvider>
                <SafeAreaView>
                    <View>
                        <Header page={'Landing'}/>
                        <View style={styles(reSize).container}>
                            <View style={styles(reSize).boxtext}>
                                <View style={styles(reSize).inner3}>
                                    <Text style={{ fontSize: reSize / 20, color: '#f2f2f2' }}> Your Guide to Becoming a </Text>
                                    <Text style={{ fontSize: reSize / 20, color: '#D9A05B' }}> Sudoku Guru </Text>
                                    <Pressable
                                        style={({ pressed }) => [
                                            { opacity: pressed ? 0.5 : 1.0, backgroundColor: '#D9A05B' }
                                        ]}
                                        onPress={async () => {
                                            await canProceed();
                                        }}>
                                        <View>
                                            <Text style={{ fontSize: reSize / 20, color: '#f2f2f2' }}> Get Started </Text>
                                        </View>
                                    </Pressable>
                                </View>
                            </View>
                            <View style={styles(reSize).box}>
                                <View style={styles(reSize).inner}>
                                    <Image style={{
                                        resizeMode: 'cover',
                                        height: reSize / 2.5,
                                        width: reSize / 2.5,
                                    }} source={require('./App.png')} />
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
};

const styles = (size: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    box: {
        flexDirection: 'row',
        display: 'flex',
        width: '50%',
        height: '70%',
    },
    boxtext: {
        flexDirection: 'row',
        display: 'flex',
        width: '50%',
        height: '30%',
    },
    box4: {
        width: '100%',
        height: '20%',
    },
    menubox: {
        width: '30%',
        height: '13%',
    },
    midbox: {
        width: '50%',
        height: '20%',
    },
    box1: {
        width: '20%',
        height: '20%',
        justifyContent: 'center'
    },
    inner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inner3: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    inner2: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    profileButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
})

export default LandingPage;