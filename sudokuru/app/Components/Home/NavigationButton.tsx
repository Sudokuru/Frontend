import React from "react";
import { Pressable, Image, ImageURISource } from "react-native";
import { Surface, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import { useNewWindowDimensions } from "../../Functions/WindowDimensions";

interface NavigationButton {
  navigationPage: string;
  image: ImageURISource;
  widthFactor?: number;
  heightFactor?: number;
  testID: string;
}

const NavigationButton = (props: NavigationButton) => {
  const minWindowSize = useNewWindowDimensions();
  const theme = useTheme();
  const navigation: any = useNavigation();

  const { updateCurrentPage } = React.useContext(PreferencesContext);

  const WIDTH_FACTOR: number = props.widthFactor ? props.widthFactor : 4.5;
  const HEIGHT_FACTOR: number = props.heightFactor ? props.heightFactor : 9;

  const WIDTH: number = minWindowSize.width / WIDTH_FACTOR;
  const HEIGHT: number = minWindowSize.height / HEIGHT_FACTOR;

  return (
    <Pressable
      onPress={() => {
        updateCurrentPage(props.navigationPage);
        navigation.navigate(props.navigationPage);
      }}
    >
      {({ hovered }: any) => {
        return (
          <Surface
            style={{
              width: WIDTH,
              height: HEIGHT,
              borderColor: hovered
                ? theme.colors.outline
                : theme.colors.onSurface,
              borderWidth: hovered ? 3 : 2,
            }}
            testID={props.testID}
          >
            <Image
              style={{
                resizeMode: "contain",
                maxHeight: "100%",
                maxWidth: "100%",
              }}
              source={props.image}
              defaultSource={props.image}
            />
          </Surface>
        );
      }}
    </Pressable>
  );
};

export default NavigationButton;
