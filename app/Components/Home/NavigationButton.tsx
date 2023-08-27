import React from "react";
import { Pressable, Image, ImageURISource } from "react-native";
import { Surface, useTheme } from "react-native-paper";
import { useMinWindowDimensions } from "../../Functions/global/WindowDimensions";
import { useNavigation } from "@react-navigation/native";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import { getBoardSize } from "../Sudoku Board/Functions/BoardFunctions";

interface navigationButton {
  navigationPage: string;
  image: ImageURISource;
  widthFactor?: number;
  heightFactor?: number;
  hoverSizeFactor?: number;
}

const NavigationButton = (props: navigationButton) => {
  const minWindowSize = useMinWindowDimensions();
  const theme = useTheme();
  const navigation: any = useNavigation();

  const { updateCurrentPage } = React.useContext(PreferencesContext);

  const WIDTH_FACTOR: number = props.widthFactor ? props.widthFactor : 2.5;
  const HEIGHT_FACTOR: number = props.heightFactor ? props.heightFactor : 5;
  const HOVER_SIZE_FACTOR: number = props.hoverSizeFactor
    ? props.hoverSizeFactor
    : 1.1;

  const WIDTH: number = minWindowSize / WIDTH_FACTOR;
  const HEIGHT: number = minWindowSize / HEIGHT_FACTOR;

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
            elevation={5}
            style={{
              width: hovered ? WIDTH * HOVER_SIZE_FACTOR : WIDTH,
              height: hovered ? HEIGHT * HOVER_SIZE_FACTOR : HEIGHT,
              borderColor: theme.colors.outline,
              borderWidth: 4,
            }}
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
