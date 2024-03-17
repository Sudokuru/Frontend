import { useFocusEffect } from "@react-navigation/core";
import { rgba } from "polished";
import React, { useCallback, useContext, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import Alert from "react-native-awesome-alerts";
import { Text, useTheme, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { Statistics } from "../Api/Statistics";
import LessonPanel from "../Components/Home/LessonPanel";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";

const LearnPage = () => {
  const windowSize = useNewWindowDimensions();

  const theme = useTheme();

  const { updateLearnedLessons, learnedLessons } =
    useContext(PreferencesContext);

  const [areLessonsLoaded, setLessonsLoaded] = useState(false);

  const [learnHelpVisible, setLearnHelpVisible] = useState(false);
  const showLearnHelp = () => setLearnHelpVisible(true);
  const hideLearnHelp = () => setLearnHelpVisible(false);

  useFocusEffect(
    useCallback(() => {
      // This determines what lessons the user has learned and conditionally displays everything.
      async function getUserLearnedLessons() {
        await Statistics.getLearnedLessons().then((lessons: any) => {
          if (lessons !== null) {
            // prevent the infinite loop
            if (learnedLessons !== lessons && !areLessonsLoaded) {
              updateLearnedLessons(lessons);
            }

            setLessonsLoaded(true);
          } else {
            console.log("User has not learned any lessons!");
            setLessonsLoaded(true);
          }
        });
      }
      getUserLearnedLessons();
    }, [learnedLessons]),
  );

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 50,
                  lineHeight: 50,
                  fontWeight: "bold",
                }}
              >
                Learn{" "}
                <Text style={{ color: theme.colors.onBackground }}>
                  new strategies
                </Text>
              </Text>
              <Pressable
                onPress={() => showLearnHelp()}
                style={{ alignSelf: "flex-start" }}
              >
                <Text
                  style={{
                    color: theme.colors.onBackground,
                    lineHeight: 16,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  ?
                </Text>
              </Pressable>
            </View>
            <View style={{ alignItems: "center", alignSelf: "center" }}>
              {areLessonsLoaded ? (
                <LessonPanel width={windowSize.width} />
              ) : (
                <ActivityIndicator animating color={theme.colors.primary} />
              )}
            </View>
          </View>
        </View>
        <Alert
          show={learnHelpVisible}
          title="Learning Help"
          message={
            `Select a strategy to learn by clicking on a lesson card.\n\n` +
            `It is recommended you do unlocked lessons first as locked lessons build upon the knowledge gained from prior ones.\n\n` +
            `Strategies you have already learned will be greyed out, but you will still have access to them.`
          }
          messageStyle={{ maxWidth: 500 }}
          alertContainerStyle={{
            backgroundColor: rgba(theme.colors.background, 0.3),
          }}
          showConfirmButton
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          confirmText="OK"
          confirmButtonColor={theme.colors.primary}
          onConfirmPressed={() => {
            hideLearnHelp();
          }}
          overlayStyle={{ backgroundColor: "transparent" }}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default LearnPage;
