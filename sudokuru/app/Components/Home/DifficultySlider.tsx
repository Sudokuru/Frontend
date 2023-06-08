// @ts-nocheck
import React, { useState } from "react";
import { View, Text } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import { useTheme } from "react-native-paper";

const DifficultySlider = (props) => {
  const [value, setValue] = useState(50);
  const theme = useTheme();

  return (
    <View>
      <Slider
        style={{ width: 400, height: 40 }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        minimumTrackTintColor="#D9A05B"
        maximumTrackTintColor="#000000"
        value={value}
        onValueChange={(returnValue) => {
          setValue(returnValue);
          props.sendData(value);
        }}
      />
      <Text style={{ color: theme.colors.onBackground }}>
        Your selected difficulty: {value}
      </Text>
    </View>
  );
};

export default DifficultySlider;
