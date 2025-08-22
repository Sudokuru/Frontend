import React from "react";
import {
  View,
  Image,
  useWindowDimensions,
  ScrollView,
  ImageURISource,
} from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/core";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { CARD_PADDING } from "../Components/Home/Cards";
import { toTitle } from "../Functions/Utils";
import { getLessonSteps } from "../Api/Lessons";
import { saveLearnedLessons } from "../Api/Statistics";
import { useTheme } from "../Contexts/ThemeContext";

const Lesson = (props: { route: { params: { params: any } } }) => {
  //Brings in name of strategy from carousel
  let name = props.route.params
    ? props.route.params.params
    : "no props.route.params in LessonPage";

  const navigation: any = useNavigation();

  const size = useWindowDimensions();

  const { updateLearnedLessons, learnedLessons } =
    React.useContext(PreferencesContext);

  const [steps, setSteps] = React.useState<[string, ImageURISource][]>([]);

  const { theme } = useTheme();

  let title = toTitle(name);

  //2d array - [[],[]]. 1st array indicates which step, 2nd array indicates text or image.
  // This useFocusEffect stores the steps in state when page is loaded in.
  useFocusEffect(
    React.useCallback(() => {
      setSteps(getLessonSteps(name));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const clickCheckMark = () => {
    if (!learnedLessons.includes(name)) {
      learnedLessons.push(name);
      updateLearnedLessons(learnedLessons);
      saveLearnedLessons(learnedLessons);
    }
    navigation.navigate("LearnPage");
  };

  // Create lesson content cards
  let cards = [];
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
        <Card
          mode="outlined"
          theme={{
            colors: {
              surface: theme.colors.surfaceAlt,
            },
          }}
        >
          <View
            style={{
              flexDirection: size.width > 800 ? "row" : "column",
              alignItems: "center",
            }}
          >
            <Image
              source={steps[i][1]}
              defaultSource={steps[i][1]}
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
            <Text
              variant="headlineSmall"
              style={{ color: theme.semantic.text.inverse }}
            >
              {steps[i][0]}
            </Text>
          </View>
        </Card>
      </View>,
    );
  }

  return (
    <ScrollView>
      <View
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
              style={{ color: theme.semantic.text.primary, fontWeight: "bold" }}
            >
              {title + " Lesson"}
            </Text>
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
            <Text
              variant="headlineMedium"
              style={{ color: theme.semantic.text.inverse }}
            >
              Finish Lesson
            </Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default Lesson;
