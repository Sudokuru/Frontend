import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Image,
  useWindowDimensions,
  Pressable,
  ScrollView,
} from "react-native";
import Alert from "react-native-awesome-alerts";
import { Text, useTheme, Button, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Lessons,
  getLessonMode,
  lessonOfflineMode,
  lessonOnlineMode,
} from "../Api/Lessons";
import { Statistics } from "../Api/Statistics";
import { CARD_PADDING } from "../Components/Home/Cards";
import { toTitle } from "../Components/Sudoku Board/sudoku";
import { PreferencesContext } from "../Contexts/PreferencesContext";

const Lesson = (props: { route: { params: { params: any } } }) => {
  //Brings in name of strategy from carousel
  const name = props.route.params
    ? props.route.params.params
    : "no props.route.params in LessonPage";

  const navigation: any = useNavigation();

  const size = useWindowDimensions();

  const { updateLearnedLessons, learnedLessons } =
    React.useContext(PreferencesContext);

  const [learnHelpVisible, setLearnHelpVisible] = React.useState(false);
  const showLearnHelp = () => setLearnHelpVisible(true);
  const hideLearnHelp = () => setLearnHelpVisible(false);

  const [steps, setSteps] = React.useState([]);

  const theme = useTheme();

  const title = toTitle(name);

  // setting lesson mode to offline
  const LESSON_MODE = getLessonMode.Offline;
  const getlessonArgs: lessonOfflineMode | lessonOnlineMode = {
    mode: LESSON_MODE,
  };

  //2d array - [[],[]]. 1st array indicates which step, 2nd array indicates text or image.
  // This useFocusEffect stores the steps in state when page is loaded in.
  useFocusEffect(
    React.useCallback(() => {
      if (Lessons == null) {
        return;
      }
      Lessons.getSteps(name, getlessonArgs).then((result: any) => {
        setSteps(result);
      });
    }, []),
  );

  if (Lessons == null) {
    return;
  }

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

  // Create lesson content cards
  const cards = [];
  for (let i: number = 0; i < steps.length; i++) {
    cards.push(
      <View
        key={i}
        testID={i.toString()}
        style={{
          alignSelf: "center",
          width: size.width > 800 ? "80%" : "100%",
          paddingVertical: CARD_PADDING / 2,
        }}
      >
        <Card mode="outlined">
          <View
            style={{
              flexDirection: size.width > 800 ? "row" : "column",
              alignItems: "center",
            }}
          >
            <Image
              source={steps[i][1]}
              style={{
                width:
                  size.width > 800
                    ? size.width * 0.4
                    : Math.min(600, size.width),
                height:
                  size.width > 800
                    ? size.width * 0.4
                    : Math.min(600, size.width),
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
            <Text variant="headlineSmall">{steps[i][0]}</Text>
          </View>
        </Card>
      </View>,
    );
  }

  return (
    <ScrollView>
      <SafeAreaView
        style={{
          height: "100%",
          width: "100%",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "column" }}>
          <View style={{ alignSelf: "center", flexDirection: "row" }}>
            <Text
              variant="headlineLarge"
              style={{ color: theme.colors.primary, fontWeight: "bold" }}
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

          {cards}

          <Button
            onPress={() => clickCheckMark()}
            mode="contained"
            testID="finishLesson"
            style={{
              marginVertical: "2%",
              marginHorizontal: size.width > 800 ? "30%" : "10%",
            }}
          >
            <Text variant="headlineMedium">Finish Lesson</Text>
          </Button>
        </View>
        <Alert
          show={learnHelpVisible}
          title="Learning Help"
          message={
            `This is the ` +
            title +
            " lesson page.\n\n" +
            "Navigate through the lesson by scrolling up and down.\n\n" +
            "Each page of the lesson will contain a board as well as a description to help you understand the process for using the " +
            title +
            " strategy"
          }
          messageStyle={{ maxWidth: 500 }}
          showConfirmButton
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          confirmText="OK"
          confirmButtonColor={theme.colors.primary}
          onConfirmPressed={() => {
            hideLearnHelp();
          }}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default Lesson;
