import React from 'react';
import PreferencesToggles from "../Components/Profile/PreferencesToggles";
import {StyleSheet, useWindowDimensions, View, TouchableOpacity, Image, ScrollView} from "react-native";
import SaveGamePreferencesToggle from "../Components/Profile/SaveGamePreferencesToggle";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from "../Components/Header";
import {Switch, Text, useTheme} from "react-native-paper";
import {getKeyString} from "../Functions/Auth0/token";
import jwtDecode, { JwtPayload } from "jwt-decode";
import {PreferencesContext} from "../Contexts/PreferencesContext";
import {formatLessonNameArray} from "../Functions/ContextParsing/learnedLessons";



let token: string = '';
  getKeyString("id_token").then(result => {
  token = result!; });

const ProfilePage = () => {
  const theme = useTheme();

  const decoded = jwtDecode(token) as string;

    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

    const { learnedLessons, toggleTheme, isThemeDark, toggleHighlightPeers, isHighlightPeers,
        isHighlightBox, toggleHighlightBox, toggleHighlightColumn, isHighlightColumn, toggleHighlightRow, isHighlightRow
    } = React.useContext(PreferencesContext);

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Header page={'Profile'}/>
                <ScrollView>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 30 }}>
                        <Text style={{ fontSize: reSize/20, color: '#D9A05B', fontWeight: 'bold', marginBottom: 10 }}>Profile</Text>
                        <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
                            <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Name: </Text>
                                <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{decoded.nickname}</Text>
                            </View>
                            <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Email: </Text>
                                <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{decoded.name}</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Strategies Learned:</Text>
                                <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{formatLessonNameArray(learnedLessons)}</Text>
                            </View>
                            <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Theme: </Text>
                                <View style={{justifyContent: "flex-end", flexDirection: "row", flex: 1}}>
                                    <Switch
                                        color={'#025E73'}
                                        value={isThemeDark}
                                        onValueChange={toggleTheme}
                                        testID={isThemeDark ? "DarkThemeEnabled" : "DarkThemeDisabled"}
                                        style={{alignSelf: 'center', flexDirection: 'column'}}
                                    />
                                </View>
                            </View>
                            <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Highlight Peers: </Text>
                                <View style={{justifyContent: "flex-end", flexDirection: "row", flex: 1}}>
                                    <Switch
                                        color={'#025E73'}
                                        value={isHighlightPeers}
                                        onValueChange={toggleHighlightPeers}
                                        testID={isHighlightPeers ? "HighlightPeersEnabled" : "HighlightPeersDisabled"}
                                        style={{alignSelf: 'center', flexDirection: 'column'}}
                                    />
                                </View>
                            </View>
                            <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Highlight Box: </Text>
                                <View style={{justifyContent: "flex-end", flexDirection: "row", flex: 1}}>
                                    <Switch
                                        color={'#025E73'}
                                        value={isHighlightBox}
                                        onValueChange={toggleHighlightBox}
                                        testID={isHighlightBox ? "HighlightBoxEnabled" : "HighlightBoxDisabled"}
                                        style={{alignSelf: 'center', flexDirection: 'column'}}
                                    />
                                </View>
                            </View>
                            <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Highlight Row: </Text>
                                <View style={{justifyContent: "flex-end", flexDirection: "row", flex: 1}}>
                                    <Switch
                                        color={'#025E73'}
                                        value={isHighlightRow}
                                        onValueChange={toggleHighlightRow}
                                        testID={isHighlightRow ? "HighlightRowEnabled" : "HighlightRowDisabled"}
                                        style={{alignSelf: 'center', flexDirection: 'column'}}
                                    />
                                </View>
                            </View>
                            <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Highlight Column: </Text>
                                <View style={{justifyContent: "flex-end", flexDirection: "row", flex: 1}}>
                                    <Switch
                                        color={'#025E73'}
                                        value={isHighlightColumn}
                                        onValueChange={toggleHighlightColumn}
                                        testID={isHighlightColumn ? "HighlightColumnEnabled" : "HighlightColumnDisabled"}
                                        style={{alignSelf: 'center', flexDirection: 'column'}}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
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