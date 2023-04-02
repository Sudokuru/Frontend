// @ts-nocheck
//import Slider from '@react-native-community/slider';
import React, {useState} from 'react';
import { View, Text } from "react-native";
import {Slider} from '@miblanchard/react-native-slider';
import {useTheme} from "react-native-paper";

const DifficultySlider = (props) => {

    const [value, setValue] = useState(50);
    const theme = useTheme();

    return(
    <View>
        <Slider
        style={{width: 400, height: 40}}
        minimumValue={0}
        maximumValue={100}
        step={1}
        minimumTrackTintColor={theme.colors.primaryContainer}
        maximumTrackTintColor={theme.colors.onPrimary}
        value={value}
        onValueChange={returnValue => {
            setValue(returnValue);
            props.sendData(value);
        }}
        />
        <Text style={{color: theme.colors.onPrimary }}>Your selected difficulty: {value}</Text>
    </View>);
}

export default DifficultySlider;