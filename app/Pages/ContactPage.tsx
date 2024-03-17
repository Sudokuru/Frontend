import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const ContactPage = () => {
  const theme = useTheme();

  return (
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
  );
};

export default ContactPage;
