import React from 'react';
import ThemeToggle from "../Components/Profile/ThemeToggle";
import {StyleSheet, View, TouchableOpacity, Image} from "react-native";
import SaveGamePreferencesToggle from "../Components/Profile/SaveGamePreferencesToggle";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from "../Components/Header";
import {Text, useTheme} from "react-native-paper";
import {getKeyString} from "../Functions/Auth0/token";
import jwtDecode, { JwtPayload } from "jwt-decode";


let token: string = '';
  getKeyString("id_token").then(result => {
  token = result!; });

const ProfilePage = () => {
  const theme = useTheme();

  const decoded = jwtDecode(token) as string;
  console.log(token)
  console.log(decoded)

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Header page={'Profile'}/>
                  <View style={styles.container}>
                    <View style={styles.header}></View>
                    <View style={styles.body}>
                      <View style={styles.bodyContent}>
                        <Text style={styles.name}>{decoded.nickname}</Text>
                        <Text style={styles.info}>Sudoku Player</Text>
                        <Text style={styles.email}>{decoded.name}</Text>
                          <ThemeToggle/>
                          <SaveGamePreferencesToggle/>
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
    profileButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    container: {
        flex: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: 'white',
    },
    header: {
        backgroundColor: '#D9A05B',
        height: 200,
      },
      avatar: {
        width: 180,
        height: 180,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: 'white',
        marginLeft: -400,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: -150,
      },
      name: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '600',
      },
      body: {
        marginTop: 40,
      },
      bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
      },
      nm: {
        fontSize: 28,
        color: '#D9A05B',
        fontWeight: '600',
      },
      info: {
        fontSize: 16,
        color: '#f2f2f2',
        marginTop: 10,
      },
      email: {
        fontSize: 12,
        color: '#f2f2f2',
        marginTop: 10,
      },
      description: {
        fontSize: 16,
        color: '#696969',
        marginTop: 10,
        textAlign: 'center',
      },
      buttonContainer: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
        backgroundColor: '#D9A05B',
      },
});

const homeScreenStyles = StyleSheet.create({
    home: {
        display: "flex",
        flexDirection: 'row',
    },
});

export default ProfilePage;