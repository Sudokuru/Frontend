import React, { useCallback, useContext, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, useTheme, ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/core";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import LessonPanel from "../Components/Home/LessonPanel";
import { getLearnedLessons } from "../Api/Statistics";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";

const LearnPage = () => {
  const windowSize = useNewWindowDimensions();

  const theme = useTheme();

  const { updateLearnedLessons, learnedLessons } =
    useContext(PreferencesContext);

  const [areLessonsLoaded, setLessonsLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // This determines what lessons the user has learned and conditionally displays everything.
      async function getUserLearnedLessons() {
        await getLearnedLessons().then((lessons: any) => {
          if (lessons !== null) {
            // prevent the infinite loop
            if (learnedLessons !== lessons && !areLessonsLoaded) {
              updateLearnedLessons(lessons);
            }
            setLessonsLoaded(true);
          }
        });
      }
      getUserLearnedLessons();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [learnedLessons]),
  );

  return (
    <ScrollView>
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
          </View>
          <View style={{ alignItems: "center", alignSelf: "center" }}>
            {areLessonsLoaded ? (
              <LessonPanel width={windowSize.width} />
            ) : (
              <ActivityIndicator
                animating={true}
                color={theme.colors.primary}
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LearnPage;
