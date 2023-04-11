import React from 'react';
import ThemeToggle from "../Components/Profile/ThemeToggle";
import {StyleSheet, useWindowDimensions, View, TouchableOpacity, Image} from "react-native";
import SaveGamePreferencesToggle from "../Components/Profile/SaveGamePreferencesToggle";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from "../Components/Header";
import {Text, useTheme} from "react-native-paper";
import {getKeyString} from "../Functions/Auth0/token";
import jwtDecode, { JwtPayload } from "jwt-decode";
import {PreferencesContext} from "../Contexts/PreferencesContext";



let token: string = '';
  getKeyString("id_token").then(result => {
  token = result!; });

const ProfilePage = () => {
  const theme = useTheme();

  const decoded = jwtDecode(token) as string;
  console.log(token)
  console.log(decoded)

    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

    const { updateLearnedLessons, learnedLessons } = React.useContext(PreferencesContext);

    const formatLessonNameArray = (learnedLessons: string[]) => {
        if (!learnedLessons) return "Loading...";
        let formattedLessonArray = [];
        for (let i = 0; i < learnedLessons.length; i++)
        {
            formattedLessonArray.push(formatOneLessonName(learnedLessons[i]));
        }
        return formattedLessonArray.join('\r\n');
    }

    const formatOneLessonName = (lessonName: string) => {
        const words = lessonName.toLowerCase().replaceAll('_', ' ').split(" ");
        for (let i = 0; i < words.length; i++)
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        return words.join(" ");
    }

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
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 30 }}>
                        <Text style={{ fontSize: reSize/20, color: '#D9A05B', fontWeight: 'bold', marginBottom: 10 }}>Statistics</Text>
                        <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Strategies Learned:</Text>
                                <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{formatLessonNameArray(learnedLessons)}</Text>
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