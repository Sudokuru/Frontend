import React from "react";
import { Pressable, Image } from "react-native";
import { Surface, useTheme } from "react-native-paper";
import { getMinWindowDimensions } from "../../Functions/global/WindowDimensions";

const NavigationButton = (props: any) => {
  const minWindowSize = getMinWindowDimensions();
  const theme = useTheme();
  return (
    <Pressable>
      {({ hovered }: any) => {
        return (
          <Surface
            elevation={5}
            style={{
              width: hovered
                ? (minWindowSize / 2.5) * 1.1
                : minWindowSize / 2.5,
              height: hovered ? (minWindowSize / 5) * 1.1 : minWindowSize / 5,
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
