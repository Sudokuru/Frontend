import React from "react";
import { Linking, ScrollView, TouchableOpacity, View } from "react-native";
import { Button, Icon, Text } from "react-native-paper";
import { calculateCardsPerRow, CARD_WIDTH } from "../Components/Home/Cards";
import { useNewWindowDimensions } from "../Functions/WindowDimensions";
import { Member, contributors, teamMembers } from "../Data/members";
import { useTheme } from "../Contexts/ThemeContext";
import { Theme } from "../Styling/theme";
import { useIsFocused } from "@react-navigation/native";

const openLink = (url: string) => {
  Linking.openURL(url);
};

function getCardArray(
  teamMembers: Member[],
  columnCount: number,
  theme: Theme,
): any[] {
  let teamCards = [];
  let subArray = [];

  for (let i = 0; i < teamMembers.length; i++) {
    subArray.push(
      <View
        key={teamMembers[i].name}
        testID={teamMembers[i].name}
        style={{
          width: CARD_WIDTH,
          borderWidth: 1,
          borderColor: theme.colors.surface,
          padding: 5,
          margin: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => openLink(teamMembers[i].github)}
          testID={`button-${teamMembers[i].name}`}
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
            marginBottom: "1%",
          }}
        >
          <Icon source="github" size={30} color={theme.semantic.text.primary} />
          <Text
            variant="bodyLarge"
            style={{ color: theme.semantic.text.primary }}
          >
            {teamMembers[i].name}
          </Text>
        </TouchableOpacity>
        {teamMembers[i].activeSince && (
          <Text
            variant="bodyMedium"
            style={{ color: theme.semantic.text.tertiary }}
          >
            Active Since: {teamMembers[i].activeSince}
          </Text>
        )}
        {teamMembers[i].specialty && (
          <Text
            variant="bodyMedium"
            style={{ color: theme.semantic.text.tertiary }}
          >
            Specialty: {teamMembers[i].specialty}
          </Text>
        )}
      </View>,
    );

    // Add row
    if ((i + 1) % columnCount === 0) {
      teamCards.push(subArray);
      subArray = [];
    }
  }
  // Add last row if not evenly divisible
  if (subArray.length > 0) {
    teamCards.push(subArray);
  }

  return teamCards;
}

const AboutUsPage = () => {
  const { theme } = useTheme();
  const windowSize = useNewWindowDimensions();

  let columnCount: number = calculateCardsPerRow(
    windowSize.width,
    windowSize.height,
    teamMembers.length,
  );

  let teamCards = getCardArray(teamMembers, columnCount, theme);
  let contributorCards = getCardArray(contributors, columnCount, theme);

  const isFocused = useIsFocused();
  if (!isFocused) return <Text>Error Loading Page</Text>;

  return (
    <ScrollView>
      <Text
        style={{
          color: theme.colors.primary,
          fontSize: 50,
          lineHeight: 50,
          fontWeight: "bold",
          alignSelf: "center",
        }}
      >
        About Us
      </Text>
      <View style={{ marginHorizontal: "1%" }}>
        <Text
          variant="headlineSmall"
          style={{ color: theme.semantic.text.tertiary }}
        >
          Mission
        </Text>
        <Text
          variant="bodyLarge"
          style={{ color: theme.semantic.text.tertiary }}
        >
          {/* Note: The following text is duplicated in the README.md file */}
          Sudokuru is an open-source project focused on developing a
          world-class, cross-platform Sudoku app. We aim to provide a delightful
          user experience while also contributing to the community by building a
          collection of reusable software modules. These modules are designed to
          be free, well-documented, modern, and interoperable, allowing the open
          source community to easily incorporate them into their own
          Sudoku-related projects.
        </Text>
        <Text
          variant="headlineSmall"
          style={{ color: theme.semantic.text.tertiary }}
        >
          History
        </Text>
        <Text
          variant="bodyLarge"
          style={{ color: theme.semantic.text.tertiary }}
        >
          Sudokuru was founded in 2022 by a group of computer science students
          at the University of Central Florida for a senior design project.
          Members of this original team have continued developing the app after
          graduation with a current goal of launching the official production
          website in early 2025 and on mobile appstores later that year.
        </Text>
        <Text
          variant="headlineSmall"
          style={{ alignSelf: "center", color: theme.semantic.text.tertiary }}
        >
          Team
        </Text>
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {teamCards.map((subArray, index) => (
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
        <Text
          variant="headlineSmall"
          style={{ alignSelf: "center", color: theme.semantic.text.tertiary }}
        >
          Contributors
        </Text>
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {contributorCards.map((subArray, index) => (
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
        <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
          <Button
            icon="github"
            onPress={() => openLink("https://github.com/Sudokuru/Frontend")}
            labelStyle={{ fontSize: 20 }}
            testID="button-source-code"
          >
            Source Code
          </Button>
          <Button
            icon="youtube"
            onPress={() => openLink("https://www.youtube.com/@SudoKuru")}
            labelStyle={{ fontSize: 20 }}
            testID="button-youtube"
          >
            YouTube
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutUsPage;
