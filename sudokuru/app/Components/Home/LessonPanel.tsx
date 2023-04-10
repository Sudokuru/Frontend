import React from 'react';
import {
    View,
    useWindowDimensions,
} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import {PreferencesContext} from "../../Contexts/PreferencesContext";
import LessonButton from "./LessonButton";
import {useFocusEffect} from "@react-navigation/core";
import {getOneLessonPartialName} from "../../Functions/ContextParsing/learnedLessons";

const sudokuru = require("../../../node_modules/sudokuru/dist/bundle"); // -- What works for me
const Lessons = sudokuru.Lessons;

const LessonPanel = () => {

    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

    const theme = useTheme();

    const navigation: any = useNavigation();
    const { updateLearnedLessons, learnedLessons } = React.useContext(PreferencesContext);

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

        let lessonButtonArray = [];
        for (let i = 0; i < availableLessons.length; i++){
            lessonButtonArray.push(
                <View style={{flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center'}}>
                    <LessonButton
                        backgroundColor={(learnedLessons.includes(availableLessons[i])) ? "grey" : theme.colors.primary}
                        firstName={getOneLessonPartialName(availableLessons[i], 0)}
                        lastName={getOneLessonPartialName(availableLessons[i], 1)}
                        navigation={availableLessons[i]}
                    ></LessonButton>
                </View>
            )
        }

        console.log(lessonButtonArray);

        return(
            <View style={{flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center'}}>
                {lessonButtonArray}
            </View>
        );
    }
};

export default LessonPanel;