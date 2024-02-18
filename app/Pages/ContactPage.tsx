import React from "react";
import { View, useWindowDimensions } from "react-native";
import {
  Button,
  Card,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CARD_IMAGE_HEIGHT, CARD_PADDING } from "../Components/Home/Cards";

const ContactPage = () => {
  const theme = useTheme();
  const size = useWindowDimensions();
  const [value, setValue] = React.useState("");
  const [text, setText] = React.useState("");
  const [label, setLabel] = React.useState("0/1000");
  const [disabled, setDisabled] = React.useState(true);
  const [placeholder, setPlaceholder] = React.useState("");

  const submit = async () => {
    var feedbackType = "Other";
    if (value === "feature") {
      feedbackType = "Feature Request";
    } else if (value === "bug") {
      feedbackType = "Bug Report";
    }

    const submission = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    };

    const url = `https://script.google.com/macros/s/AKfycbzclUldypFOsRj9hdp1AmDugHG_QOZQhWGE_ryL61eP7Au63XmaocCklO226b7CPM_Fcg/exec?feedbackType=${feedbackType}&feedbackText=${text}`;
    console.log(url);
  };

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
                onValueChange={(value) => {
                  setValue(value);
                  setDisabled(false);
                  if (value === "feature") {
                    setPlaceholder(
                      "What feature would you like to see added or improved upon?"
                    );
                  } else if (value === "bug") {
                    setPlaceholder("What bug did you encounter?");
                  } else {
                    setPlaceholder("What would you like to tell us?");
                  }
                }}
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
                placeholder={placeholder}
                style={{ backgroundColor: "white", height: CARD_IMAGE_HEIGHT }}
                textColor="black"
                multiline={true}
                onChangeText={(text) => {
                  setText(text.substring(0, 1000));
                  setLabel(text.substring(0, 1000).length + "/1000");
                }}
              />
              <Button
                onPress={() => {
                  submit();
                }}
                disabled={disabled}
                mode="contained"
                style={{
                  marginVertical: "2%",
                  marginHorizontal: size.width > 800 ? "35%" : "12%",
                }}
              >
                <Text variant="headlineSmall">Submit Feedback</Text>
              </Button>
            </View>
          </Card>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ContactPage;
