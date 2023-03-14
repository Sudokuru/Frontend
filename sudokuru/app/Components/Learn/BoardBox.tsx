import React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import LoginButton from '../Auth0/LoginButton';
import SudokuBoard from "../Sudoku Board/SudokuBoard";

export default class BoardBox extends React.Component {
    render() {
        return(
            <View style={styles.container}>
                <View style={styles.box1}>
                <Image style={{
            resizeMode: 'cover',
            height: 100,
            width: 200,
          }} source={require('../Landing/goldLogoText.png')} />
                </View>
            
                <View style={styles.midbox}>
                    <Text></Text>
                </View>

                <View style={styles.menubox}>
                    <View style={styles.inner2}>
                        <LoginButton/>
                    </View>
                </View>
                <View style={styles.puzzlebox}>
                    <View style={styles.inner}>
                        <Text> Sudoku Board hereee </Text>
                        <SudokuBoard></SudokuBoard>
                    </View>
                </View>
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
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
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
    },
    inner2: {
        flex: 1,
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
    puzzlebox: {
        flex: 2,
        width: '40%',
        height: '80%',
        padding: 5
    },
})