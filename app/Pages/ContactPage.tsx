import React from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import {
  Button,
  Card,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CARD_IMAGE_HEIGHT, CARD_PADDING } from "../Components/Home/Cards";
import Alert from "react-native-awesome-alerts";
import { rgba } from "polished";
import { useNavigation } from "@react-navigation/native";

const ContactPage = () => {
  const theme = useTheme();
  const navigation: any = useNavigation();
  const size = useWindowDimensions();
  const [placeholder, setPlaceholder] = React.useState("");
  const [thankYouVisible, setThankYouVisible] = React.useState(false);
  const [buttonText, setButtonText] = React.useState("Submit Feedback*");
  const [errorVisible, setErrorVisible] = React.useState(false);
  interface contactPageState {
    value: string;
    text: string;
    label: string;
    placeholder: string;
    buttonText: string;
    buttonDisabled: boolean;
  }
  const [contactPage, setContactPage] = React.useState<contactPageState>({
    buttonDisabled: true,
    buttonText: "Submit Feedback*",
    label: "0/1000",
    text: "",
    placeholder: "",
    value: "",
  });

  const submit = async () => {
    var feedbackType = "Other";
    if (contactPage.value === "feature") {
      feedbackType = "Feature Request";
    } else if (contactPage.value === "bug") {
      feedbackType = "Bug Report";
    }

    const submission: RequestInit = {
      redirect: "follow" as RequestRedirect,
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: "{}",
    };

    const url = `https://script.google.com/macros/s/AKfycbzclUldypFOsRj9hdp1AmDugHG_QOZQhWGE_ryL61eP7Au63XmaocCklO226b7CPM_Fcg/exec?feedbackType=${feedbackType}&feedbackText=${contactPage.text}`;

    try {
      const response = await fetch(url, submission);
      const body = await response.json();
      if (body.status === 200) {
        setThankYouVisible(true);
      } else {
        throw new Error();
      }
    } catch (error) {
      setErrorVisible(true);
    }
  };

  return (
    <ScrollView>
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
                value={contactPage.value}
                onValueChange={(value) => {
                  let disableButton: boolean = true;
                  if (contactPage.text.length > 0) {
                    disableButton = false;
                  }
                  setContactPage({
                    ...contactPage,
                    value: value,
                    buttonDisabled: disableButton,
                  });
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
                label={contactPage.label}
                value={contactPage.text}
                placeholder={placeholder}
                style={{ backgroundColor: "white", height: CARD_IMAGE_HEIGHT }}
                textColor="black"
                multiline={true}
                onChangeText={(text) => {
                  let disableButton: boolean = true;
                  if (text.length > 0 && contactPage.value !== "") {
                    disableButton = false;
                  }
                  setContactPage({
                    ...contactPage,
                    text: text.substring(0, 1000),
                    label: text.substring(0, 1000).length + "/1000",
                    buttonDisabled: disableButton,
                  });
                }}
                testID={"FeedbackTextInput"}
              />
              <Button
                onPress={() => {
                  setContactPage({ ...contactPage, buttonDisabled: true });
                  setButtonText("Submitting...");
                  submit();
                }}
                disabled={contactPage.buttonDisabled}
                mode="contained"
                style={{
                  marginVertical: "2%",
                  marginHorizontal: size.width > 800 ? "35%" : "12%",
                }}
                testID={"SubmitFeedbackButton"}
              >
                <Text variant="headlineSmall">{buttonText}</Text>
              </Button>
              <Text variant="titleMedium">
                *Please help us respect your privacy by not including any
                personally identifiable information in your feedback.
              </Text>
            </View>
          </Card>
        </View>
        <Alert
          show={thankYouVisible}
          title="Thank You!"
          message={
            `Your feedback has been submitted.\n\n` +
            `We appreciate the time you took to help us improve our app.\n\n` +
            `Your feeback will be taken into consideration.`
          }
          messageStyle={{ maxWidth: 500 }}
          showConfirmButton={true}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          confirmText={"OK"}
          confirmButtonColor={theme.colors.primary}
          onConfirmPressed={() => {
            setThankYouVisible(false);
            setButtonText("Submit Feedback*");
            setContactPage({
              ...contactPage,
              value: "",
              text: "",
              label: "0/1000",
            });
            navigation.navigate("LandingPage");
          }}
          overlayStyle={{ backgroundColor: "transparent" }}
          alertContainerStyle={{
            backgroundColor: rgba(theme.colors.background, 0.3),
          }}
        />
        <Alert
          show={errorVisible}
          title="Error"
          message={
            `There was an error submitting your feedback.\n\n` +
            `Please try again later.`
          }
          messageStyle={{ maxWidth: 500 }}
          showConfirmButton={true}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          confirmText={"OK"}
          confirmButtonColor={theme.colors.primary}
          onConfirmPressed={() => {
            setErrorVisible(false);
            setButtonText("Submit Feedback*");
            setContactPage({ ...contactPage, buttonDisabled: false });
          }}
          overlayStyle={{ backgroundColor: "transparent" }}
          alertContainerStyle={{
            backgroundColor: rgba(theme.colors.background, 0.3),
          }}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default ContactPage;
