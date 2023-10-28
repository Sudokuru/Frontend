import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Platform,
  useWindowDimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { Text, useTheme, Button, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Alert from "react-native-awesome-alerts";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/core";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import {
  Lessons,
  getLessonMode,
  lessonOfflineMode,
  lessonOnlineMode,
} from "../Functions/Api/Lessons";
import { Statistics } from "../Functions/Api/Statistics";
import { CARD_PADDING, CARD_WIDTH } from "../Components/Home/Cards";

const Lesson = (props: { route: { params: { params: any } } }) => {
  //Brings in name of strategy from carousel
  let name = props.route.params
    ? props.route.params.params
    : "no props.route.params in LessonPage";

  const navigation: any = useNavigation();

  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const { updateLearnedLessons, learnedLessons } =
    React.useContext(PreferencesContext);

  const [learnHelpVisible, setLearnHelpVisible] = React.useState(false);
  const showLearnHelp = () => setLearnHelpVisible(true);
  const hideLearnHelp = () => setLearnHelpVisible(false);

  const [steps, setSteps] = React.useState([]);

  const theme = useTheme();

  function getTitle(name: string): string {
    let lessonName: string;
    name == "AMEND_NOTES"
      ? (lessonName = "Amend Notes")
      : name == "NAKED_SINGLE"
      ? (lessonName = "Naked Single")
      : name == "NAKED_SET"
      ? (lessonName = "Naked Set")
      : name == "HIDDEN_SINGLE"
      ? (lessonName = "Hidden Single")
      : name == "HIDDEN_SET"
      ? (lessonName = "Hidden Set")
      : name == "SUDOKU_101"
      ? (lessonName = "Sudoku 101")
      : name == "SIMPLIFY_NOTES"
      ? (lessonName = "Simplify Notes")
      : name == "POINTING_SET"
      ? (lessonName = "Pointing Set")
      : (lessonName = "Null");
    return lessonName;
  }

  let title = getTitle(name);

  if (Lessons == null) {
    return;
  }

  // setting lesson mode to offline
  let LESSON_MODE = getLessonMode.Offline;
  let getlessonArgs: lessonOfflineMode | lessonOnlineMode = {
    mode: LESSON_MODE,
  };

  //2d array - [[],[]]. 1st array indicates which step, 2nd array indicates text or image.
  // This useFocusEffect stores the steps in state when page is loaded in.
  useFocusEffect(
    React.useCallback(() => {
      Lessons.getSteps(name, getlessonArgs).then((result: any) => {
        setSteps(result);
      });
    }, [])
  );

  async function saveUserLearnedLessons(learnedLessons: string[]) {
    await Statistics.saveLearnedLessons(learnedLessons).then((res: any) => {
      if (res) {
        console.log("Lessons save successfully!");
      } else {
        console.log("Lesson not saved");
      }
    });
  }

  const clickCheckMark = () => {
    if (!learnedLessons.includes(name)) {
      learnedLessons.push(name);
      updateLearnedLessons(learnedLessons);
      saveUserLearnedLessons(learnedLessons);
    }
    navigation.navigate("LearnPage");
  };

  const [count, setCount] = useState(0);

  // Create lesson content cards
  let cards = [];
  for (let i: number = 0; i < steps.length; i++) {
    cards.push(
      <View
        key={i}
        testID={i.toString()}
        style={{ width: CARD_WIDTH, padding: CARD_PADDING }}
      >
        <Card mode="outlined">
          <Image
            source={steps[i][1]}
            style={{
              width: CARD_WIDTH,
              height: CARD_WIDTH,
              resizeMode: "contain",
              alignSelf: "center",
            }}
          />
          <Text>{steps[i][0]}</Text>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView>
      <SafeAreaView
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <View style={styles.container1}>
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: reSize / 25,
              fontWeight: "bold",
            }}
          >
            {title + " Lesson"}
          </Text>
          <Pressable onPress={() => showLearnHelp()}>
            <MaterialCommunityIcons
              color={theme.colors.onBackground}
              name="help"
            />
          </Pressable>

          <View style={styles.container1}>
            {cards}
            <Button onPress={() => clickCheckMark()}>
              Mark Lesson as Complete
            </Button>
          </View>
        </View>
        <Alert
          show={learnHelpVisible}
          title="Learning Help"
          message={
            `This is the ` +
            title +
            " lesson page.\n\n" +
            "Navigate through the lesson by using the left and right arrows.\n\n" +
            "Each page of the lesson will contain a board as well as a description to help you understand the process for using the " +
            title +
            " strategy"
          }
          messageStyle={{ maxWidth: 500 }}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container1: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Lesson;
