import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, Platform, useWindowDimensions, Pressable} from "react-native";

import Header from "../Components/Header";
import {Text, Button, useTheme, ActivityIndicator} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import {AntDesign, MaterialCommunityIcons} from "@expo/vector-icons";
import Alert from "react-native-awesome-alerts";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useFocusEffect} from "@react-navigation/core";
import {PreferencesContext} from "../Contexts/PreferencesContext";
import {getKeyString} from "../Functions/Auth0/token";
import {USERGAMESTATISTICSBFFURL} from "@env";

const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js"); // -- What works for me
const Lessons = sudokuru.Lessons;
const Statistics = sudokuru.Statistics;

const Lesson = (props: { route: { params: { params: any; }; }; }) => {
    //Brings in name of strategy from carousel
    let name = props.route.params ? props.route.params.params : "no props.route.params in LessonPage"

    const navigation: any = useNavigation();

    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

    const { updateLearnedLessons, learnedLessons } = React.useContext(PreferencesContext);

    const [learnHelpVisible, setLearnHelpVisible] = React.useState(false);
    const showLearnHelp = () => setLearnHelpVisible(true);
    const hideLearnHelp = () => setLearnHelpVisible(false);

    const [steps, setSteps] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);


    const theme = useTheme();

    function getTitle(name: string):string {
        let lessonName: string;
        name == "AMEND_NOTES" ? lessonName = 'Amend Notes' :
            name == "NAKED_SINGLE" ? lessonName = 'Naked Single' :
                name == "NAKED_SET" ? lessonName = 'Naked Set' :
                    name == "HIDDEN_SINGLE" ? lessonName = 'Hidden Single' :
                        name == "HIDDEN_SET" ? lessonName = 'Hidden Set' :
                            name == "SUDOKU_101" ? lessonName = 'Sudoku 101' :
                                name == "SIMPLIFY_NOTES" ? lessonName = 'Simplify Notes' : lessonName = 'Null';
        return lessonName;
    }

      let title = getTitle(name);

      if (Lessons == null){
          return;
      }

      //2d array - [[],[]]. 1st array indicates which step, 2nd array indicates text or image.
    // This useFocusEffect stores the steps in state when page is loaded in.
    useFocusEffect(
        React.useCallback(() => {
            Lessons.getSteps(name).then((result: any) => {
                setSteps(result);
                setIsLoading(false);
            });
        }, []))

    async function saveUserLearnedLessons(url: string) {

        let token = null;
        await getKeyString("access_token").then(result => {
            token = result;
        });

        let jsonBody = {
            "strategiesLearned": learnedLessons
        }

        await Statistics.saveLearnedLessons(url, jsonBody, token).then((res: any) => {
            if (res) {
                console.log("Lessons save successfully!")
            }
            else {
                console.log("Lesson not saved");
            }
        });
    }

    const clickCheckMark = () => {
        if (!learnedLessons.includes(name))
        {
          learnedLessons.push(name);
          updateLearnedLessons(learnedLessons);
          saveUserLearnedLessons(USERGAMESTATISTICSBFFURL);
        }
        navigation.navigate("Home")
    }

      const [count, setCount]  = useState(0);

      //Separate view for mobile and web
      const Page = () => {
          // Wait for page to load the stuff
          if (isLoading){
              return (
                  <ActivityIndicator animating={true} color={theme.colors.primary} />
              )
          }
          //web view
          else if(Platform.OS === 'web'){
            return(
            <View style={styles.container1}>
                  <View style={{ justifyContent: 'center', flexDirection: 'row'}}>

                      <Pressable style={{top: reSize/4.5, height: reSize/10, right: reSize/25}} disabled={count - 1 == -1} onPress={() => setCount(count - 1)}>
                          <AntDesign color= {(count - 1 == -1) ? theme.colors.background : theme.colors.onBackground} name="leftcircleo" size={reSize/15}/>
                      </Pressable>

                      {
                          (steps[count][1] != null) ?
                              <Image
                                  style={{width: reSize/2, height: reSize/2}}
                                  source={{uri:steps[count][1]}}
                              /> : <></>
                      }

                      <Pressable style={{top: reSize/4.5, height: reSize/10, left: reSize/25}} onPress={() => (count + 1 == steps.length) ? clickCheckMark() : setCount(count + 1)} >
                          <AntDesign color={theme.colors.onBackground} name={(count + 1 == steps.length) ? "checkcircleo" : "rightcircleo"} size={reSize/15}/>
                      </Pressable>
                  </View>
                  <Text>{" "}</Text>
                  <View style={{width: reSize/1.5}}>
                      {
                          (steps[count][0] != null) ?
                              <Text style={{color: theme.colors.onBackground, textAlign: 'justify', fontSize: size.height/50}}>{steps[count][0]}</Text>
                              : <></>
                      }
                  </View>
            </View>
            )
          }

          //mobile view
          else{
              return(
                <View style={styles.container1}>
                      {
                          (steps[count][1] != null) ?
                              <Image
                                  style={{width: reSize/1.3, height: reSize/1.3}}
                                  source={{uri:steps[count][1]}}
                              /> : <></>
                      }

                      <Text>{" "}</Text>

                      <View style={{ justifyContent:'center', flexDirection: 'row'}}>

                          <Pressable style={{top: reSize/2, height: reSize/8, left: reSize/10}} disabled={count - 1 == -1} onPress={() => setCount(count - 1)}>
                              <AntDesign color= {(count - 1 == -1) ? theme.colors.background : theme.colors.onBackground} name="leftcircleo" size={reSize/10}/>
                          </Pressable>

                            <View style={{width: reSize/1.2}}>
                                {
                                    (steps[count][0] != null) ?
                                        <Text style={{color: theme.colors.onBackground, textAlign: 'justify', fontSize: size.height/50}}>{steps[count][0]}</Text>
                                        : <></>
                                }

                            </View>

                          <Pressable style={{top: reSize/2, height: reSize/8, right: reSize/10}} onPress={() => (count + 1 == steps.length) ? clickCheckMark() : setCount(count + 1)} >
                              <AntDesign color={theme.colors.onBackground} name={(count + 1 == steps.length) ? "checkcircleo" : "rightcircleo"} size={reSize/10}/>
                          </Pressable>
                      </View>

                </View>
              )
          }
      }


      return (
          <SafeAreaProvider>
              <SafeAreaView style={{height: '100%', width: '100%'}}>
                  <Header page={'Lesson'}/>
                  <View>
                      <View style={styles.container1}>

                          <View style={{flexDirection: 'row'}}>
                              <Text style={{color: theme.colors.primary, fontSize: reSize/25,  fontWeight: 'bold'}}>{title + " Lesson"}</Text>
                              <Pressable onPress={() => showLearnHelp()}>
                                  <MaterialCommunityIcons color={theme.colors.onBackground} name="help"/>
                              </Pressable>
                          </View>

                          <Page/>

                      </View>
                  </View>
                  <Alert
                      show={learnHelpVisible}
                      title="Learning Help"
                      message=
                      {`This is the `+ title + ' lesson page.\n\n' +
                       'Navigate through the lesson by using the left and right arrows.\n\n' +
                       'Each page of the lesson will contain a board as well as a description to help you understand the process for using the ' + title + ' strategy'
                      }
                      messageStyle={{maxWidth: 500}}
                      showConfirmButton={true}
                      closeOnTouchOutside={false}
                      closeOnHardwareBackPress={false}
                      confirmText={"OK"}
                      confirmButtonColor={theme.colors.primary}
                      onConfirmPressed={() => {
                          hideLearnHelp();
                      }}
                  />
              </SafeAreaView>
          </SafeAreaProvider>
      );
};

const styles = StyleSheet.create({
      container1: {
          alignItems: 'center',
          justifyContent: 'center'
      },
});

export default Lesson;