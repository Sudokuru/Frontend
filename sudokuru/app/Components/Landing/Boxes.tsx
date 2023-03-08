import React from 'react';
import {StyleSheet, Text, View, Image, Pressable, useWindowDimensions} from 'react-native';
import LoginButton from '../Auth0/LoginButton';
import {useNavigation} from "@react-navigation/native";

const Boxes = () => {

    const navigation: any = useNavigation();
    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

        return(
            <View style={styles(reSize).container}>
                <View style={styles(reSize).box1}>
                   
                        <Image style={{
            resizeMode: 'cover',
            height: reSize / 10,
            width: reSize / 5,
          }} source={require('./goldLogoText.png')} />
                </View>
            
                <View style={styles(reSize).midbox}>
                        <Text> </Text>
                </View>

                <View style={styles(reSize).menubox}>
                    <View style={styles(reSize).inner2}>
                        <LoginButton/>
                    </View>
                </View>
                <View style={styles(reSize).boxtext}>
                    <View style={styles(reSize).inner3}>
                        <Text style={{ fontSize: reSize / 20, color: '#f2f2f2' }}> Your Guide to Becoming a </Text>
                        <Text style={{ fontSize: reSize / 20, color: '#D9A05B' }}> Sudoku Guru </Text>
                        <Pressable
                            style={({ pressed }) => [
                            { opacity: pressed ? 0.5 : 1.0, backgroundColor: '#D9A05B' }
                            ]}
                           onPress={() => navigation.navigate('Home')}>
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
        );
}

const styles = (size: any) => StyleSheet.create({
    container: {
        width: '100%',
        height: '85%',
        padding: 5,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    box: {
        width: '50%',
        height: '70%',
        padding: 5
    },
    boxtext: {
        flex: 2,
        width: '50%',
        height: '30%',
        padding: 5
    },
    box4: {
        width: '100%',
        height: '20%',
        padding: 5
    },
    menubox: {
        width: '30%',
        height: '13%',
        padding: 5
    },
    midbox: {
        width: '50%',
        height: '20%',
        padding: 5
    },
    box1: {
        width: '20%',
        height: '20%',
        paddingLeft: 5,
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
        padding: 5,
        marginRight: 5,
    },
    profileButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
})

export default Boxes;