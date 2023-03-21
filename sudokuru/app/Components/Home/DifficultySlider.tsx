import Slider from '@react-native-community/slider';
import React, { Component } from 'react';
import { View } from "react-native";

class DifficultySlider extends Component {

    render() {
        return(
        <View>
            <Slider
            style={{width: 200, height: 40}}
            minimumValue={0}
            maximumValue={100}
            step={10}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            value={this.props.value}
            onSlidingComplete={this.props.onSlidingComplete} />
        </View>);
    }
}

export default DifficultySlider;