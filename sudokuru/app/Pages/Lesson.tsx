import React, { useState } from 'react';
import {StyleSheet, View, Image, Platform, useWindowDimensions, Pressable} from "react-native";

import Header from "../Components/Header";
import {Text, Button, useTheme} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import {AntDesign, MaterialCommunityIcons} from "@expo/vector-icons";
import Alert from "react-native-awesome-alerts";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js"); // -- What works for me
const Lessons = sudokuru.Lessons;

const Lesson = (props: { route: { params: { params: any; }; }; }) => {
    //Brings in name of strategy from carousel
    let name = props.route.params ? props.route.params.params : "no props.route.params in LessonPage"
    const navigation: any = useNavigation();

    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

    const [learnHelpVisible, setLearnHelpVisible] = React.useState(false);
    const showLearnHelp = () => setLearnHelpVisible(true);
    const hideLearnHelp = () => setLearnHelpVisible(false);

    const theme = useTheme();

    function getTitle(name: string):string {
        let lessonName: string;
        name == "AMEND_NOTES" ? lessonName = 'Amend Notes' :
            name == "NAKED_SINGLE" ? lessonName = 'Naked Single' :
                name == "NAKED_SET" ? lessonName = 'Naked Set' :
                    name == "HIDDEN_SINGLE" ? lessonName = 'Hidden Single' :
                        name == "HIDDEN_SET" ? lessonName = 'Hidden Set' : lessonName = 'Null';
        return lessonName;
    }

      let title = getTitle(name);

      if (Lessons == null){
          console.log("Cannot connect to Lessons API!");
          navigation.navigate("Home");
          return;
      }

      let arr = Lessons.strategies;

      if (arr == null){
          console.log("Lessons.strategies is null");
          navigation.navigate("Home");
          return;
      }

      //2d array - [[],[]]. 1st array indicates which step, 2nd array indicates text or image.
      let teach = Lessons.getSteps(name);

      if (teach == null){
          console.log("Lessons.getSteps ", name, " is null");
          navigation.navigate("Home");
          return;
      }

      const [count, setCount]  = useState(0);

      if(count + 1 == teach.length){
         console.log("FINISHED LESSON")
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
                                  <MaterialCommunityIcons color={theme.colors.onPrimary} name="help"/>
                              </Pressable>
                          </View>

                          <View style={{ justifyContent: 'center', flexDirection: 'row'}}>

                              <Pressable style={{top: reSize/4.5, height: reSize/10, right: reSize/25}} disabled={count - 1 == -1} onPress={() => setCount(count - 1)}>
                                  <AntDesign color= {(count - 1 == -1) ? theme.colors.background : theme.colors.onPrimary} name="leftcircleo" size={reSize/15}/>
                              </Pressable>

                              {
                                  (teach[count][1] != null) ?
                                      <Image
                                          style={{width: reSize/2, height: reSize/2}}
                                          source={{uri:teach[count][1]}}
                                      /> : <></>
                              }

                              <Pressable style={{top: reSize/4.5, height: reSize/10, left: reSize/25}} onPress={() => setCount(count + 1)} disabled={count + 1 == teach.length}>
                                  <AntDesign color={(count + 1 == teach.length) ? theme.colors.background : theme.colors.onPrimary} name="rightcircleo" size={reSize/15}/>
                              </Pressable>

                          </View>
                          <Text>{" "}</Text>
                          <View style={{width: reSize/1.5}}>
                              {
                                  (teach[count][0] != null) ?
                                      <Text style={{color: theme.colors.onPrimary, textAlign: 'justify', fontSize: size.height/50}}>{teach[count][0]}</Text>
                                      : <></>
                              }
                          </View>
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
                      confirmButtonColor={theme.colors.background}
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