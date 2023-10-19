import React, { useState } from "react";
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
  difficulty,
  getDifficultyColor,
} from "./Cards";
import Alert from "react-native-awesome-alerts";
import { rgba } from "polished";

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

let learnedLessonImages: ImageURISource[] = [
  require("./CardImages/Learned/SUDOKU_101.png"),
  require("./CardImages/Learned/AMEND_NOTES.png"),
  require("./CardImages/Learned/NAKED_SINGLE.png"),
  require("./CardImages/Learned/SIMPLIFY_NOTES.png"),
  require("./CardImages/Learned/NAKED_SET.png"),
  require("./CardImages/Learned/HIDDEN_SINGLE.png"),
  require("./CardImages/Learned/HIDDEN_SET.png"),
  require("./CardImages/Learned/POINTING_SET.png"),
];

let lockedLessonImages: ImageURISource[] = [
  require("./CardImages/Locked/SUDOKU_101.png"),
  require("./CardImages/Locked/AMEND_NOTES.png"),
  require("./CardImages/Locked/NAKED_SINGLE.png"),
  require("./CardImages/Locked/SIMPLIFY_NOTES.png"),
  require("./CardImages/Locked/NAKED_SET.png"),
  require("./CardImages/Locked/HIDDEN_SINGLE.png"),
  require("./CardImages/Locked/HIDDEN_SET.png"),
  require("./CardImages/Locked/POINTING_SET.png"),
];

const LessonPanel = (props: any) => {
  const theme = useTheme();

  const navigation: any = useNavigation();

  const { learnedLessons } = React.useContext(PreferencesContext);

  const [availableLessons, setAvailableLessons] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [lockedWarningVisible, setLockedWarningVisible] = useState(false);
  const showLockedWarning = () => setLockedWarningVisible(true);
  const hideLockedWarning = () => setLockedWarningVisible(false);
  const [lockedLesson, setLockedLesson] = useState(-1);

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
      let img: ImageURISource;
      if (learnedLessons.includes(availableLessons[i])) {
        img = learnedLessonImages[i];
      } else if (lockedLessons.includes(availableLessons[i])) {
        img = lockedLessonImages[i];
      } else {
        img = lessonImages[i];
      }
      let difficulty: difficulty;
      switch (availableLessons[i]) {
        case "SUDOKU_101":
        case "AMEND_NOTES":
        case "NAKED_SINGLE":
        case "SIMPLIFY_NOTES":
          difficulty = "Very Easy";
          break;
        case "NAKED_SET":
          difficulty = "Easy";
          break;
        case "HIDDEN_SINGLE":
          difficulty = "Intermediate";
          break;
        case "HIDDEN_SET":
          difficulty = "Hard";
          break;
        default:
          difficulty = "Very Hard";
          break;
      }
      let difficultyColor: string = getDifficultyColor(difficulty);
      subArray.push(
        <View style={{ width: CARD_WIDTH, padding: CARD_PADDING }}>
          <TouchableOpacity
            onPress={() => {
              if (lockedLessons.includes(availableLessons[i])) {
                setLockedLesson(i);
                showLockedWarning();
              } else {
                navigation.navigate("Lesson", { params: availableLessons[i] });
              }
            }}
          >
            <Card
              mode="outlined"
              theme={{ colors: { surface: "#025E73", outline: "#D9A05B" } }}
            >
              <Text variant="headlineMedium" style={{ alignSelf: "center" }}>
                {formatOneLessonName(availableLessons[i])}
              </Text>
              <Text
                variant="headlineSmall"
                style={{ alignSelf: "center" }}
                theme={{ colors: { onSurface: difficultyColor } }}
              >
                {difficulty}
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
      );

      // Add row
      if ((i + 1) % columnCount === 0) {
        lessonButtonArray.push(subArray);
        subArray = [];
      }
    }
    // Add last row if not evenly divisible
    if (subArray.length > 0) {
      lessonButtonArray.push(subArray);
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
        <Alert
          show={lockedWarningVisible}
          title="Warning"
          message={
            `You have selected a lesson that is locked. \n\n` +
            `Locked lessons build on knowledge gained from previous lessons. \n\n` +
            `It is recommended that you complete the previous lessons before attempting this one. \n\n` +
            `Are you sure you want to continue?`
          }
          messageStyle={{ maxWidth: 500 }}
          alertContainerStyle={{
            backgroundColor: rgba(theme.colors.background, 0.3),
          }}
          showCancelButton={true}
          showConfirmButton={true}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          cancelText={"No"}
          confirmText={"Yes"}
          confirmButtonColor={theme.colors.primary}
          onCancelPressed={() => {
            hideLockedWarning();
          }}
          onConfirmPressed={() => {
            hideLockedWarning();
            navigation.navigate("Lesson", {
              params: availableLessons[lockedLesson],
            });
          }}
          overlayStyle={{ backgroundColor: "transparent" }}
        />
      </View>
    );
  }
};

export default LessonPanel;
