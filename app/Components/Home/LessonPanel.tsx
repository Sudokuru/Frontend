import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import LessonButton from "./LessonButton";
import { useFocusEffect } from "@react-navigation/core";
import {
  formatOneLessonName,
  getLockedLessons,
} from "../../Functions/ContextParsing/learnedLessons";
import { Lessons } from "../../Functions/Api/Lessons";

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
    }, [])
  );

  if (isLoading) {
    return <ActivityIndicator animating={true} color={theme.colors.primary} />;
  } else {
    // dynamically render in lesson buttons based on criteria
    let lessonButtonArray = [];
    let lockedLessons = getLockedLessons(learnedLessons, availableLessons);
    let NUM_LESSONS_PER_ROW = 4;

    let subArray = [];
    for (let i = 0; i < availableLessons.length; i++) {
      subArray.push(
        <LessonButton
          key={availableLessons[i]}
          backgroundColor={
            learnedLessons.includes(availableLessons[i]) ||
            lockedLessons.includes(availableLessons[i])
              ? "grey"
              : theme.colors.primary
          }
          name={formatOneLessonName(availableLessons[i])}
          navigation={availableLessons[i]}
          disabled={lockedLessons.includes(availableLessons[i])}
        ></LessonButton>
      );

      // push sub-array to main array after every NUM_LESSONS_PER_ROW elements
      if (
        (i + 1) % NUM_LESSONS_PER_ROW === 0 ||
        i === availableLessons.length - 1
      ) {
        lessonButtonArray.push(subArray);
        subArray = [];
      }
    }

    // render each sub-array as a row
    return (
      <View style={{ flexWrap: "wrap", flexDirection: "column" }}>
        {lessonButtonArray.map((subArray, index) => (
          <View
            style={{
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "center",
            }}
            key={index}
          >
            {subArray}
          </View>
        ))}
      </View>
    );
  }
};

export default LessonPanel;
