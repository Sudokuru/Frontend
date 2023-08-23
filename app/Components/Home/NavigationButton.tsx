import React from "react";
import { Pressable, Image } from "react-native";
import { Surface, useTheme } from "react-native-paper";
import { getMinWindowDimensions } from "../../Functions/global/WindowDimensions";

const NavigationButton = (props: any) => {
  const minWindowSize = getMinWindowDimensions();
  const theme = useTheme();

  const WIDTH_FACTOR: number = minWindowSize / 2.5;
  const HEIGHT_FACTOR: number = minWindowSize / 5;
  const HOVER_SIZE_FACTOR: number = 1.1;

  return (
    <Pressable>
      {({ hovered }: any) => {
        return (
          <Surface
            elevation={5}
            style={{
              width: hovered ? WIDTH_FACTOR * HOVER_SIZE_FACTOR : WIDTH_FACTOR,
              height: hovered
                ? HEIGHT_FACTOR * HOVER_SIZE_FACTOR
                : HEIGHT_FACTOR,
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
