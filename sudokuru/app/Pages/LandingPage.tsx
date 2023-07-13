import React from "react";
import {
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Header from "../Components/Header";
import { getTokenName } from "../Functions/Auth0/token";
import Alert from "react-native-awesome-alerts";
import { useTheme } from "react-native-paper";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import { rgba } from "polished";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import NavigationBar from "../Components/NavigationBar";

const LandingPage = () => {
  const theme = useTheme();

  const isWeb = Platform.OS === "web";

  const navigation: any = useNavigation();
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const newUser = 1;

  let strategies = [
    "AMEND_NOTES",
    "SIMPLIFY_NOTES",
    "NAKED_SINGLE",
    "NAKED_PAIR",
    "NAKED_TRIPLET",
    "NAKED_QUADRUPLET",
    "HIDDEN_SINGLE",
    "HIDDEN_PAIR",
    "HIDDEN_TRIPLET",
    "HIDDEN_QUADRUPLET",
  ];

  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  async function canProceed() {
    await getTokenName().then((result) => {
      if (result != "") {
        if (newUser == 1) {
          navigation.replace("Home");
          return null;
        } else {
          navigation.replace("Lesson", { params: "AMEND_NOTES" });
        }
      } else {
        showModal();
      }
    });
  }

  if (isWeb) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ height: "100%", width: "100%" }}>
          <NavigationBar page={"Landing"} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  } else {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ height: "100%", width: "100%" }}>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
};

export default LandingPage;
