import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, Image, ImageURISource } from "react-native";
import { Surface, useTheme } from "react-native-paper";

import { PreferencesContext } from "../../Contexts/PreferencesContext";
import { useNewWindowDimensions } from "../../Functions/WindowDimensions";

interface navigationButton {
  navigationPage: string;
  image: ImageURISource;
  widthFactor?: number;
  heightFactor?: number;
  hoverSizeFactor?: number;
  testID: string;
}

const NavigationButton = (props: navigationButton) => {
  const minWindowSize = useNewWindowDimensions();
  const theme = useTheme();
  const navigation: any = useNavigation();

  const { updateCurrentPage } = React.useContext(PreferencesContext);

  const WIDTH_FACTOR: number = props.widthFactor ? props.widthFactor : 4.5;
  const HEIGHT_FACTOR: number = props.heightFactor ? props.heightFactor : 9;
  const HOVER_SIZE_FACTOR: number = props.hoverSizeFactor
    ? props.hoverSizeFactor
    : 1.1;

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
              width: hovered ? WIDTH * HOVER_SIZE_FACTOR : WIDTH,
              height: hovered ? HEIGHT * HOVER_SIZE_FACTOR : HEIGHT,
              borderColor: theme.colors.onSurfaceVariant,
              borderWidth: 4,
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
            />
          </Surface>
        );
      }}
    </Pressable>
  );
};

export default NavigationButton;
