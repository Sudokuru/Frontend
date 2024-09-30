import React from "react";
import { ScrollView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const AboutUsPage = () => {
  const theme = useTheme();

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
        <Text variant="headlineSmall">Mission</Text>
        <Text variant="bodyLarge">
          {/* Note: The following text is duplicated in the README.md file */}
          Sudokuru is an open-source project focused on developing a
          world-class, cross-platform Sudoku app. We aim to provide a delightful
          user experience while also contributing to the community by building a
          collection of reusable software modules. These modules are designed to
          be free, well-documented, modern, and interoperable, allowing
          developers to easily incorporate them into their own Sudoku-related
          projects.
        </Text>
        <Text variant="headlineSmall">History</Text>
        <Text variant="bodyLarge">
          Sudokuru was founded in 2022 by a group of computer science students
          at the University of Central Florida for a senior design project.
          Members of this original team have continued developing the app after
          graduation with a current goal of launching the official production
          website in early 2025 and on mobile appstores later that year.
        </Text>
      </View>
    </ScrollView>
  );
};

export default AboutUsPage;
