import React, { useState } from "react";
import {
  ImageURISource,
  Image,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import {
  ActivityIndicator,
  Text,
  Card,
  useTheme,
  Button,
} from "react-native-paper";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import { useFocusEffect } from "@react-navigation/core";
import {
  formatOneLessonName,
  getLockedLessons,
} from "../../Functions/learnedLessons";
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
import { getStrategies } from "../../Api/Lessons";

let lessonImages: ImageURISource[] = [
  require("../../../.assets/CardImages/SUDOKU_101.png"),
  require("./../../../.assets/CardImages/AMEND_NOTES.png"),
  require("./../../../.assets/CardImages/OBVIOUS_SINGLE.png"),
  require("./../../../.assets/CardImages/SIMPLIFY_NOTES.png"),
  require("./../../../.assets/CardImages/OBVIOUS_PAIR.png"),
  require("./../../../.assets/CardImages/HIDDEN_SINGLE.png"),
  require("./../../../.assets/CardImages/HIDDEN_PAIR.png"),
  require("./../../../.assets/CardImages/POINTING_PAIR.png"),
];

let learnedLessonImages: ImageURISource[] = [
  require("./../../../.assets/CardImages/Learned/SUDOKU_101.png"),
  require("./../../../.assets/CardImages/Learned/AMEND_NOTES.png"),
  require("./../../../.assets/CardImages/Learned/OBVIOUS_SINGLE.png"),
  require("./../../../.assets/CardImages/Learned/SIMPLIFY_NOTES.png"),
  require("./../../../.assets/CardImages/Learned/OBVIOUS_SET.png"),
  require("./../../../.assets/CardImages/Learned/HIDDEN_SINGLE.png"),
  require("./../../../.assets/CardImages/Learned/HIDDEN_SET.png"),
  require("./../../../.assets/CardImages/Learned/POINTING_SET.png"),
];

let lockedLessonImages: ImageURISource[] = [
  require("./../../../.assets/CardImages/Locked/SUDOKU_101.png"),
  require("./../../../.assets/CardImages/Locked/AMEND_NOTES.png"),
  require("./../../../.assets/CardImages/Locked/OBVIOUS_SINGLE.png"),
  require("./../../../.assets/CardImages/Locked/SIMPLIFY_NOTES.png"),
  require("./../../../.assets/CardImages/Locked/OBVIOUS_SET.png"),
  require("./../../../.assets/CardImages/Locked/HIDDEN_SINGLE.png"),
  require("./../../../.assets/CardImages/Locked/HIDDEN_SET.png"),
  require("./../../../.assets/CardImages/Locked/POINTING_SET.png"),
];

const LessonPanel = (props: any) => {
  const theme = useTheme();

  const navigation: any = useNavigation();

  const { learnedLessons } = React.useContext(PreferencesContext);

  const [availableLessons, setAvailableLessons] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [lockedWarningVisible, setLockedWarningVisible] = useState(false);
  const showLockedWarning = () => setLockedWarningVisible(true);
  const hideLockedWarning = () => setLockedWarningVisible(false);
  const [lockedLesson, setLockedLesson] = useState(-1);

  useFocusEffect(
    React.useCallback(() => {
      setAvailableLessons(getStrategies());
      setIsLoading(false);
    }, [])
  );

  if (isLoading) {
    return <ActivityIndicator animating={true} color={theme.colors.primary} />;
  } else {
    // dynamically render in lesson buttons based on criteria
    let lessonButtonArray = [];
    let lockedLessons = getLockedLessons(learnedLessons, availableLessons);

    let subArray = [];
    let columnCount: number = calculateCardsPerRow(
      props.width,
      availableLessons.length
    );
    for (let i = 0; i < availableLessons.length; i++) {
      let img: ImageURISource;
      let id: string = i.toString();
      if (learnedLessons.includes(availableLessons[i])) {
        img = learnedLessonImages[i];
        id = "learned" + id;
      } else if (lockedLessons.includes(availableLessons[i])) {
        img = lockedLessonImages[i];
        id = "locked" + id;
      } else {
        img = lessonImages[i];
        id = "lesson" + id;
      }
      let difficulty: difficulty;
      switch (availableLessons[i]) {
        case "SUDOKU_101":
        case "AMEND_NOTES":
        case "OBVIOUS_SINGLE":
        case "SIMPLIFY_NOTES":
          difficulty = "Very Easy";
          break;
        case "OBVIOUS_SET":
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
        <View
          key={availableLessons[i]}
          testID={id}
          style={{ width: CARD_WIDTH, padding: CARD_PADDING }}
        >
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
            <Card mode="outlined">
              <Text
                variant="headlineMedium"
                testID="lessonName"
                style={{ alignSelf: "center" }}
              >
                {formatOneLessonName(availableLessons[i])}
              </Text>
              <Text
                testID={"difficulty"}
                variant="headlineSmall"
                style={{ alignSelf: "center" }}
                theme={{ colors: { onSurface: difficultyColor } }}
              >
                {difficulty}
              </Text>
              <Image
                source={img}
                defaultSource={img}
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
        <Modal
          visible={lockedWarningVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={hideLockedWarning}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: theme.colors.onSurface,
                alignSelf: "center",
                width: CARD_WIDTH * 1.08,
                height: CARD_IMAGE_HEIGHT * 1.15,
                padding: CARD_WIDTH / 10,
                borderRadius: CARD_WIDTH / 8,
                borderWidth: CARD_WIDTH / 80,
                borderColor: theme.colors.primary,
              }}
            >
              <Text
                variant="headlineLarge"
                style={{ alignSelf: "center" }}
                theme={{ colors: { onSurface: theme.colors.onPrimary } }}
              >
                Warning
              </Text>
              <Text
                variant="bodyLarge"
                style={{ alignSelf: "center" }}
                theme={{ colors: { onSurface: theme.colors.onPrimary } }}
              >
                You have selected a lesson that is locked. Locked lessons build
                on knowledge gained from previous lessons. It is recommended
                that you complete the previous lessons before attempting this
                one.
              </Text>
              <Text
                variant="headlineSmall"
                style={{ alignSelf: "center", margin: CARD_IMAGE_HEIGHT / 50 }}
                theme={{ colors: { onSurface: theme.colors.onPrimary } }}
              >
                Continue?
              </Text>
              <View
                style={{
                  flexWrap: "wrap",
                  flexDirection: "row",
                  alignSelf: "center",
                }}
              >
                <Button
                  onPress={() => {
                    hideLockedWarning;
                    navigation.navigate("Lesson", {
                      params: availableLessons[lockedLesson],
                    });
                  }}
                  labelStyle={{
                    fontSize: 20,
                    color: theme.colors.surface,
                    fontWeight: "bold",
                  }}
                  testID="confirmContinueButton"
                >
                  Yes
                </Button>
                <Button
                  onPress={hideLockedWarning}
                  labelStyle={{
                    fontSize: 20,
                    color: theme.colors.surface,
                    fontWeight: "bold",
                  }}
                  testID="cancelContinueButton"
                >
                  No
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
};

export default LessonPanel;
