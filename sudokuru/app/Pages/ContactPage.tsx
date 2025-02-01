import React from "react";
import { Modal, ScrollView, View, useWindowDimensions } from "react-native";
import {
  Button,
  Card,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import {
  CARD_IMAGE_HEIGHT,
  CARD_PADDING,
  CARD_WIDTH,
} from "../Components/Home/Cards";
import { useNavigation } from "@react-navigation/native";
import { PreferencesContext } from "../Contexts/PreferencesContext";

const ContactPage = () => {
  const theme = useTheme();
  const navigation: any = useNavigation();
  const { updateCurrentPage } = React.useContext(PreferencesContext);
  const size = useWindowDimensions();
  interface ContactPageState {
    value: string;
    text: string;
    label: string;
    placeholder: string;
    buttonText: string;
    buttonDisabled: boolean;
    thankYouVisible: boolean;
    errorVisible: boolean;
  }
  const [contactPage, setContactPage] = React.useState<ContactPageState>({
    buttonDisabled: true,
    buttonText: "Submit*",
    label: "0/1000",
    text: "",
    placeholder: "",
    value: "",
    thankYouVisible: false,
    errorVisible: false,
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
        setContactPage({ ...contactPage, thankYouVisible: true });
      } else {
        throw new Error();
      }
    } catch (error) {
      setContactPage({ ...contactPage, errorVisible: true });
    }
  };

  const closeThankYouModal = async () => {
    setContactPage({
      ...contactPage,
      value: "",
      text: "",
      label: "0/1000",
      thankYouVisible: false,
      buttonText: "Submit*",
    });
    updateCurrentPage("HomePage");
    navigation.navigate("HomePage");
  };

  const closeThankYouErrorModal = async () => {
    setContactPage({
      ...contactPage,
      buttonDisabled: false,
      buttonText: "Submit*",
      errorVisible: false,
    });
  };

  return (
    <ScrollView>
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
                let placeholder: string = "";
                if (contactPage.text.length > 0) {
                  disableButton = false;
                }
                if (value === "feature") {
                  placeholder =
                    "What feature would you like to see added or improved upon?";
                } else if (value === "bug") {
                  placeholder = "What bug did you encounter?";
                } else {
                  placeholder = "What would you like to tell us?";
                }
                setContactPage({
                  ...contactPage,
                  value: value,
                  buttonDisabled: disableButton,
                  placeholder: placeholder,
                });
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
              placeholder={contactPage.placeholder}
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
                setContactPage({
                  ...contactPage,
                  buttonDisabled: true,
                  buttonText: "Submitting...",
                });
                submit();
              }}
              disabled={contactPage.buttonDisabled}
              mode="contained"
              style={{
                marginVertical: "2%",
                marginHorizontal: size.width > 800 ? "30%" : "10%",
              }}
              testID={"SubmitFeedbackButton"}
            >
              <Text variant="headlineSmall">{contactPage.buttonText}</Text>
            </Button>
            <Text variant="titleMedium">
              *Please help us respect your privacy by not including any
              personally identifiable information in your feedback.
            </Text>
          </View>
        </Card>
      </View>
      <Modal
        visible={contactPage.thankYouVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeThankYouModal}
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
              backgroundColor: theme.colors.onSurface,
              alignSelf: "center",
              width: CARD_WIDTH * 1.08,
              height: CARD_IMAGE_HEIGHT * 0.9,
              padding: CARD_WIDTH / 10,
              borderRadius: CARD_WIDTH / 8,
              borderWidth: CARD_WIDTH / 80,
              borderColor: theme.colors.primary,
            }}
          >
            <Text
              variant="headlineSmall"
              style={{ alignSelf: "center" }}
              theme={{ colors: { onSurface: theme.colors.onPrimary } }}
            >
              Thank You!
            </Text>
            <Text
              variant="bodyLarge"
              style={{ alignSelf: "center", textAlign: "center" }}
              theme={{ colors: { onSurface: theme.colors.onPrimary } }}
            >
              Your feedback has been submitted.{"\n"}
              We appreciate the time you took to help us improve our app.{"\n"}
              Your feedback will be taken into consideration.
            </Text>
            <Button
              onPress={closeThankYouModal}
              labelStyle={{
                fontSize: 20,
                color: theme.colors.surface,
                fontWeight: "bold",
              }}
              testID="confirmSubmitButton"
            >
              Ok
            </Button>
          </View>
        </View>
      </Modal>
      <Modal
        visible={contactPage.errorVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeThankYouErrorModal}
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
              backgroundColor: theme.colors.onSurface,
              alignSelf: "center",
              width: CARD_WIDTH * 1.08,
              height: CARD_IMAGE_HEIGHT * 0.7,
              padding: CARD_WIDTH / 10,
              borderRadius: CARD_WIDTH / 8,
              borderWidth: CARD_WIDTH / 80,
              borderColor: theme.colors.primary,
            }}
          >
            <Text
              variant="headlineSmall"
              style={{ alignSelf: "center" }}
              theme={{ colors: { onSurface: theme.colors.onPrimary } }}
            >
              Error
            </Text>
            <Text
              variant="bodyLarge"
              style={{ alignSelf: "center" }}
              theme={{ colors: { onSurface: theme.colors.onPrimary } }}
            >
              There was an error submitting your feedback.{"\n"}
              Please try again later.
            </Text>
            <Button
              onPress={closeThankYouErrorModal}
              labelStyle={{
                fontSize: 20,
                color: theme.colors.surface,
                fontWeight: "bold",
              }}
              testID="confirmErrorButton"
            >
              Ok
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ContactPage;
