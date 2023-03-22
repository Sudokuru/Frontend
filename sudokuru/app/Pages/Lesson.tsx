import React, { useState } from 'react';
import {StyleSheet, View, Image, FlatList} from "react-native";
import {StatusBar} from "expo-status-bar";

import Header from "../Components/Header";
import { Text, Button } from 'react-native-paper';

const sudokuru = require("../../node_modules/sudokuru/dist/bundle.js"); // -- What works for me
const Lessons = sudokuru.Lessons;

const Lesson = (props) => {
      //Brings in name of strategy from carousel
      let name = props.route.params ? props.route.params.params : "no props.route.params in LessonPage"
      console.log(name);

      let arr = Lessons.strategies;

      //2d array that has text and image urls ---- 1st array - text, 2nd array - image url
      let teach = [[],[]]
      teach = Lessons.getSteps(name);

      const [count, setCount]  = useState(0);

      return (
          <View>
              <Header page={'Lesson'}/>
              <View style={homeScreenStyles.home}>
                  <View style={homeScreenStyles.lessons}>
                       <View style={styles.container1}>

                          {/*Shifts teach array*/}
                          <Button style={{right:150, top:40}} mode="contained" onPress={() => setCount(count - 1)}>
                            left
                          </Button>
                          <Button style={{left:150}} mode="contained" onPress={() =>setCount(count + 1)}>
                            right
                          </Button>

                          <Text>
                          <Text>{name}</Text>
                          <Text>{" Lesson"}</Text>
                          </Text>
                          <Image
                          style={{width: 400, height: 512}}
                          source={{uri:teach[count][1]}}
                          />
                          <Text>{teach[count][0]}</Text>
                      </View>
                  </View>
              </View>
          </View>
      );
};

const styles = StyleSheet.create({
      container1: {
          flex: 1,
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