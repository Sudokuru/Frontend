import React from 'react';
import {
    View,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {PreferencesContext} from "../../Contexts/PreferencesContext";
import LessonButton from "./LessonButton";
import {useFocusEffect} from "@react-navigation/core";
import {
    getLockedLessons,
    getOneLessonPartialName
} from "../../Functions/ContextParsing/learnedLessons";

const sudokuru = require("../../../node_modules/sudokuru/dist/bundle"); // -- What works for me
const Lessons = sudokuru.Lessons;

const LessonPanel = () => {

  const theme = useTheme();

  const { learnedLessons } = React.useContext(PreferencesContext);

  const [availableLessons, setAvailableLessons] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      Lessons.getStrategies().then((result: any) => {
        setAvailableLessons(result);
          setIsLoading(false);
      });
    }, []))

    if (isLoading){
      return (
        <View>
          <Text>Loading</Text>
        </View>
      )
    } else {

    // dynamically render in lesson buttons based on criteria
    let lessonButtonArray = [];
    let lockedLessons = getLockedLessons(learnedLessons, availableLessons);

    for (let i = 0; i < availableLessons.length; i++){
      lessonButtonArray.push(
        <View style={{flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center'}}
        key={availableLessons[i]}
        >
          <LessonButton
            backgroundColor={
              (learnedLessons.includes(availableLessons[i]) ||
                (lockedLessons.includes(availableLessons[i]))) ? "grey" : theme.colors.primary}
            firstName={getOneLessonPartialName(availableLessons[i], 0)}
            lastName={getOneLessonPartialName(availableLessons[i], 1)}
            navigation={availableLessons[i]}
            disabled={lockedLessons.includes(availableLessons[i])}
          ></LessonButton>
        </View>
      )
    }

    return(
      <View style={{flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center'}}>
        {lessonButtonArray}
      </View>
    );
  }
};

export default LessonPanel;