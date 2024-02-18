import React from "react";
import { View } from "react-native";
import { SegmentedButtons, Text, useTheme } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ContactPage = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState("");

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={{ alignItems: "center", alignSelf: "center" }}>
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: 50,
              lineHeight: 50,
              fontWeight: "bold",
            }}
          >
            Contact Us
          </Text>
          <Text variant="headlineSmall">Why are you contacting us today?</Text>
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            buttons={[
              {
                value: "walk",
                label: "Feature Request",
              },
              {
                value: "train",
                label: "Bug Report",
              },
              { value: "drive", label: "Other" },
            ]}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ContactPage;
