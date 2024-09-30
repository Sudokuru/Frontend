import React from "react";
import { ScrollView } from "react-native";
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
    </ScrollView>
  );
};

export default AboutUsPage;
