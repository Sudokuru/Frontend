import React, { useState } from 'react';
import {StyleSheet, View, Image, Platform} from "react-native";

import Header from "../Components/Header";
import { Text, Button } from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import {AntDesign} from "@expo/vector-icons";

const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js"); // -- What works for me
const Lessons = sudokuru.Lessons;

const Lesson = (props) => {
      //Brings in name of strategy from carousel
      let name = props.route.params ? props.route.params.params : "no props.route.params in LessonPage"
      const navigation: any = useNavigation();

      function getTitle(name):string {
            let lessonName: string;
            name == "AMEND_NOTES" ? lessonName = 'Amend Notes' :
                name == "SIMPLIFY_NOTES" ? lessonName = 'Simplify Notes' :
                    name == "NAKED_SINGLE" ? lessonName = 'Naked Single' :
                        name == "NAKED_SET" ? lessonName = 'Naked Set' :
                            name == "HIDDEN_SINGLE" ? lessonName = 'Hidden Single' :
                                name == "HIDDEN_SET" ? lessonName = 'Hidden Set' :
                                    name == "POINTING_PAIR" ? lessonName = 'Pointing Pair' : lessonName = 'Null';
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

      if(Platform.OS === 'web'){
      return (
          <View>
              <Header page={'Lesson'}/>
              <View>
                       <View style={styles.container1}>

                          <Text>
                          <Text>{title}</Text>
                          <Text>{" Lesson"}</Text>
                          </Text>

                          <Text>{" "}</Text>
                          <View style={{ justifyContent: 'center', flexDirection: 'row'}}>

                          <Button style={{right:25, height: 40, top:200}} mode="contained" disabled={count - 1 == -1} onPress={() => setCount(count - 1)}>
                            <AntDesign name="leftcircleo" size={18}/>
                          </Button>

                          <Image
                          style={{width: 400, height: 512}}
                          source={{uri:teach[count][1]}}
                          />

                          <Button style={{left:25, height: 40, top:200}} mode="contained" disabled={count + 1 == teach.length} onPress={() =>setCount(count + 1)}>
                            <AntDesign name="rightcircleo" size={18}/>
                          </Button>

                          </View>
                          <Text>{" "}</Text>

                          <Text>{teach[count][0]}</Text>
                  </View>
              </View>
          </View>
      );}
      else{
      return (
          <View>
              <Header page={'Lesson'}/>
              <View>
                       <View style={styles.container2}>


                          <Text>{" "}</Text>
                          <Text>
                          <Text>{title}</Text>
                          <Text>{" Lesson"}</Text>
                          </Text>

                          <Text>{" "}</Text>
                          <Image
                          style={{width: 350, height: 448}}
                          source={{uri:teach[count][1]}}
                          />
                          <Text>{" "}</Text>
                          <Text>{teach[count][0]}</Text>

                          <View style={{ justifyContent: 'center', flexDirection: 'row', top:50}}>

                          <Button style={{right:80}} mode="contained" disabled={count - 1 == -1} onPress={() => setCount(count - 1)}>
                            <AntDesign name="leftcircleo" size={20}/>
                          </Button>
                          <Button style={{left:80}} mode="contained" disabled={count + 1 == teach.length} onPress={() =>setCount(count + 1)}>
                            <AntDesign name="rightcircleo" size={20}/>
                          </Button>

                          </View>

                  </View>
              </View>
          </View>
      );}

};

const styles = StyleSheet.create({
      container1: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
      },
      container2: {
          alignItems: 'center',
          justifyContent: 'center',
      },
});

const homeScreenStyles = StyleSheet.create({
      home: {
          display: "flex",
          flexDirection: 'row',
          //backgroundColor: 'red',
      },
      homeMenu: {
          //backgroundColor: 'red',
          width: "15%",
      },
      lessons: {
          //backgroundColor: 'blue',
          width: "85%",
          alignContent: "flex-start",
          flexDirection: 'row',
          flexWrap: "wrap",
      },
});

export default Lesson;