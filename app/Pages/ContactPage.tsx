import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ContactPage = () => {
  const theme = useTheme();

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
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ContactPage;
