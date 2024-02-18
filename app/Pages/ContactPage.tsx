import React from "react";
import { View, useWindowDimensions } from "react-native";
import {
  Card,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CARD_PADDING } from "../Components/Home/Cards";

const ContactPage = () => {
  const theme = useTheme();
  const size = useWindowDimensions();
  const [value, setValue] = React.useState("");
  const [text, setText] = React.useState("");
  const [label, setLabel] = React.useState("");

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
        </View>
        <View
          style={{
            alignSelf: "center",
            width: size.width > 800 ? "80%" : "100%",
            paddingVertical: CARD_PADDING / 2,
          }}
        >
          <Card mode="outlined">
            <View style={{ flexDirection: "column", padding: CARD_PADDING }}>
              <Text variant="headlineSmall">
                Why are you contacting us today?
              </Text>
              <SegmentedButtons
                value={value}
                onValueChange={setValue}
                style={{ width: "100%", paddingVertical: CARD_PADDING }}
                buttons={[
                  {
                    value: "feature",
                    icon: "lightbulb-on",
                    label: "Feature",
                  },
                  {
                    value: "bug",
                    icon: "bug",
                    label: "Bug",
                  },
                  { value: "other", icon: "note-text", label: "Other" },
                ]}
              />
              <TextInput
                label={label}
                value={text}
                style={{ backgroundColor: "white" }}
                textColor="black"
                multiline={true}
                onChangeText={(text) => {
                  setText(text.substring(0, 1000));
                  setLabel(text.substring(0, 1000).length + "/1000");
                }}
              />
            </View>
          </Card>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ContactPage;
