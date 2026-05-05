import React, { useState } from "react";
import { View, Modal } from "react-native";
import { ActivityIndicator, Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  formatOneLessonName,
  getLockedLessons,
} from "../../Functions/learnedLessons";

import {
  CARD_IMAGE_HEIGHT,
  CARD_WIDTH,
  difficulty,
  getDifficultyColor,
} from "./Cards";
import { getStrategies } from "../../Api/Lessons";
import { useTheme } from "../../Contexts/ThemeContext";
import ListPanel from "./ListPanel";

function getLessonDifficulty(lesson: string): difficulty {
  switch (lesson) {
    case "SUDOKU_101":
    case "AMEND_NOTES":
    case "OBVIOUS_SINGLE":
    case "SIMPLIFY_NOTES":
      return "Very Easy";
    case "OBVIOUS_SET":
      return "Easy";
    case "HIDDEN_SINGLE":
      return "Intermediate";
    case "HIDDEN_SET":
      return "Hard";
    default:
      return "Very Hard";
  }
}

interface LessonPanelProps {
  width: number;
  height: number;
}

const LessonPanel = ({ width, height }: LessonPanelProps) => {
  const { theme } = useTheme();
  const cardTitleColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.quaternary;

  const navigation: any = useNavigation();

  const { learnedLessons } = React.useContext(PreferencesContext);

  const [availableLessons, setAvailableLessons] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [lockedWarningVisible, setLockedWarningVisible] = useState(false);
  const showLockedWarning = () => setLockedWarningVisible(true);
  const [lockedLesson, setLockedLesson] = useState(-1);
  const hideLockedWarning = () => {
    setLockedWarningVisible(false);
    setLockedLesson(-1);
  };

  useFocusEffect(
    React.useCallback(() => {
      setAvailableLessons(getStrategies());
      setIsLoading(false);
    }, []),
  );

  const lockedLessons = getLockedLessons(learnedLessons, availableLessons);

  if (isLoading) {
    return <ActivityIndicator animating={true} color={theme.colors.primary} />;
  }

  function getLessonIconName(
    lesson: string,
  ): React.ComponentProps<typeof MaterialCommunityIcons>["name"] {
    if (learnedLessons.includes(lesson)) return "check-circle";
    if (lockedLessons.includes(lesson)) return "lock";
    return "play-circle";
  }

  function getLessonIconColor(lesson: string): string {
    if (learnedLessons.includes(lesson)) return "green";
    if (lockedLessons.includes(lesson)) return theme.semantic.text.inverse;
    return theme.semantic.text.primary;
  }

  return (
    <View style={{ flexWrap: "wrap", flexDirection: "column" }}>
      <ListPanel
        width={width}
        height={height}
        items={availableLessons}
        getKey={(lesson) => lesson}
        getTestID={(lesson, index) => {
          if (learnedLessons.includes(lesson)) {
            return "learned" + index;
          }
          if (lockedLessons.includes(lesson)) {
            return "locked" + index;
          }
          return "lesson" + index;
        }}
        getTitle={(lesson) => formatOneLessonName(lesson)}
        getTitleTestID={() => "lessonName"}
        getSubtitle={(lesson) => getLessonDifficulty(lesson)}
        getSubtitleTestID={() => "difficulty"}
        getSubtitleColor={(lesson) =>
          getDifficultyColor(getLessonDifficulty(lesson))
        }
        renderImageContent={(lesson, _, shrinkage) => (
          <MaterialCommunityIcons
            name={getLessonIconName(lesson)}
            size={Math.max(30, 75 * (1 - shrinkage))}
            color={getLessonIconColor(lesson)}
            style={{ alignSelf: "center" }}
          />
        )}
        onPress={(lesson, index) => {
          if (lockedLessons.includes(lesson)) {
            setLockedLesson(index);
            showLockedWarning();
          } else {
            navigation.navigate("Lesson", {
              params: lesson,
            });
          }
        }}
        renderCompactContent={(lesson) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: 10,
            }}
          >
            <MaterialCommunityIcons
              name={getLessonIconName(lesson)}
              size={30}
              color={getLessonIconColor(lesson)}
            />
            <Text
              variant="headlineMedium"
              testID="lessonName"
              style={{
                flex: 1,
                textAlign: "center",
                color: theme.semantic.text.inverse,
              }}
            >
              {formatOneLessonName(lesson)}
            </Text>
          </View>
        )}
      />
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
              backgroundColor: theme.colors.surface,
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
              style={{
                alignSelf: "center",
                color: theme.semantic.text.quaternary,
              }}
              theme={{ colors: { onSurface: theme.semantic.text.info } }}
            >
              Warning
            </Text>
            <Text
              variant="bodyLarge"
              style={{
                alignSelf: "center",
                color: theme.semantic.text.quaternary,
              }}
              theme={{ colors: { onSurface: theme.semantic.text.info } }}
            >
              You have selected a lesson that is locked. Locked lessons build on
              knowledge gained from previous lessons. It is recommended that you
              complete the previous lessons before attempting this one.
            </Text>
            <Text
              variant="headlineSmall"
              style={{
                alignSelf: "center",
                color: theme.semantic.text.quaternary,
                margin: CARD_IMAGE_HEIGHT / 50,
              }}
              theme={{ colors: { onSurface: theme.semantic.text.info } }}
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
                  const isValidLockedLesson =
                    lockedLesson >= 0 && lockedLesson < availableLessons.length;

                  if (!isValidLockedLesson) {
                    hideLockedWarning();
                    return;
                  }

                  const selectedLesson = availableLessons[lockedLesson];
                  hideLockedWarning();
                  navigation.navigate("Lesson", {
                    params: selectedLesson,
                  });
                }}
                labelStyle={{
                  fontSize: 20,
                  color: theme.semantic.text.quaternary,
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
                  color: theme.semantic.text.quaternary,
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
};

export default LessonPanel;
