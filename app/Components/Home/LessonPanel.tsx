import React from "react";
import { ImageURISource, Image, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Text, Card, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import { useFocusEffect } from "@react-navigation/core";
import {
  formatOneLessonName,
  getLockedLessons,
} from "../../Functions/ContextParsing/learnedLessons";
import {
  Lessons,
  getLessonMode,
  lessonOfflineMode,
  lessonOnlineMode,
} from "../../Functions/Api/Lessons";
import { useNavigation } from "@react-navigation/native";
import {
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  CARD_PADDING,
  CARD_WIDTH,
  calculateCardsPerRow,
} from "./Cards";

let lessonImages: ImageURISource[] = [
  require("./CardImages/SUDOKU_101.png"),
  require("./CardImages/AMEND_NOTES.png"),
  require("./CardImages/NAKED_SINGLE.png"),
  require("./CardImages/SIMPLIFY_NOTES.png"),
  require("./CardImages/NAKED_PAIR.png"),
  require("./CardImages/HIDDEN_SINGLE.png"),
  require("./CardImages/HIDDEN_PAIR.png"),
  require("./CardImages/POINTING_PAIR.png"),
];

const LessonPanel = (props: any) => {
  const theme = useTheme();

  const navigation: any = useNavigation();

  const { learnedLessons } = React.useContext(PreferencesContext);

  const [availableLessons, setAvailableLessons] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // setting lesson mode to offline
  let LESSON_MODE = getLessonMode.Offline;
  let getlessonArgs: lessonOfflineMode | lessonOnlineMode = {
    mode: LESSON_MODE,
  };

  useFocusEffect(
    React.useCallback(() => {
      Lessons.getStrategies(getlessonArgs).then((result: any) => {
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
    let NUM_LESSONS_PER_ROW = 2;

    let subArray = [];
    let columnCount: number = calculateCardsPerRow(
      props.width,
      availableLessons.length
    );
    for (let i = 0; i < availableLessons.length; i++) {
      let img: ImageURISource = lessonImages[i];
      subArray.push(
        <View style={{ width: CARD_WIDTH, padding: CARD_PADDING }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Lesson", { params: availableLessons[i] });
            }}
          >
            <Card
              mode="outlined"
              theme={{ colors: { surface: "#025E73", outline: "#D9A05B" } }}
            >
              <Text variant="headlineMedium" style={{ alignSelf: "center" }}>
                {formatOneLessonName(availableLessons[i])}
              </Text>
              <Image
                source={img}
                style={{
                  width: CARD_IMAGE_WIDTH,
                  height: CARD_IMAGE_HEIGHT,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />
            </Card>
          </TouchableOpacity>
        </View>
        /*<LessonButton
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
        ></LessonButton>*/
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
