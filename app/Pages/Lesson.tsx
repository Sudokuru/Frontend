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
import {
  Text,
  useTheme,
  ActivityIndicator,
  Button,
  Card,
} from "react-native-paper";
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
  const [isLoading, setIsLoading] = React.useState(true);

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
        setIsLoading(false);
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

  //Separate view for mobile and web
  const Page = () => {
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
    // Wait for page to load the stuff
    if (isLoading) {
      return (
        <ActivityIndicator animating={true} color={theme.colors.primary} />
      );
    }
    //web view
    else if (Platform.OS === "web") {
      return (
        <View style={styles.container1}>
          {cards}
          <Button onPress={() => clickCheckMark()}>
            Mark Lesson as Complete
          </Button>
        </View>
      );
    }

    //mobile view
    else {
      return (
        <View style={styles.container1}>
          {steps[count][1] != null ? (
            <Image
              style={{ width: reSize / 1.3, height: reSize / 1.3 }}
              source={
                LESSON_MODE === getLessonMode.Online
                  ? { uri: steps[count][1] }
                  : steps[count][1]
              }
            />
          ) : (
            <></>
          )}

          <Text> </Text>

          <View style={{ justifyContent: "center", flexDirection: "row" }}>
            <Pressable
              style={{ top: reSize / 2, height: reSize / 8, left: reSize / 10 }}
              disabled={count - 1 == -1}
              onPress={() => setCount(count - 1)}
            >
              <AntDesign
                color={
                  count - 1 == -1
                    ? theme.colors.background
                    : theme.colors.onBackground
                }
                name="leftcircleo"
                size={reSize / 10}
              />
            </Pressable>

            <View style={{ width: reSize / 1.2 }}>
              {steps[count][0] != null ? (
                <Text
                  style={{
                    color: theme.colors.onBackground,
                    textAlign: "justify",
                    fontSize: size.height / 50,
                  }}
                >
                  {steps[count][0]}
                </Text>
              ) : (
                <></>
              )}
            </View>

            <Pressable
              style={{
                top: reSize / 2,
                height: reSize / 8,
                right: reSize / 10,
              }}
              onPress={() =>
                count + 1 == steps.length
                  ? clickCheckMark()
                  : setCount(count + 1)
              }
            >
              <AntDesign
                color={theme.colors.onBackground}
                name={
                  count + 1 == steps.length ? "checkcircleo" : "rightcircleo"
                }
                size={reSize / 10}
              />
            </Pressable>
          </View>
        </View>
      );
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ height: "100%", width: "100%" }}>
        <View>
          <View style={styles.container1}>
            <View style={{ flexDirection: "row" }}>
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
            </View>

            <Page />
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
