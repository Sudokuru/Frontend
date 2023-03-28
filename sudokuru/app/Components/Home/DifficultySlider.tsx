// @ts-nocheck
//import Slider from '@react-native-community/slider';
import React, { Component } from 'react';
import { View, Text } from "react-native";
import {Slider} from '@miblanchard/react-native-slider';

class DifficultySlider extends Component {
    constructor(props){
        super(props);
    }
    //handleDifficulty = this.props.handleDifficulty;
    
    state = {
        value: 50,
    };

    getValue() {
        return this.state.value;
    }

    render() {
        return(
        <View>
            <Slider
            style={{width: 400, height: 40}}
            minimumValue={0}
            maximumValue={100}
            step={1}
            minimumTrackTintColor="#D9A05B"
            maximumTrackTintColor="#F2F2F2"
            value={this.state.value}
            onValueChange={value => this.setState({value}) && this.props.sendData(value)}
            />
            <Text style={{color: '#D9A05B' }}>Your selected difficulty: {this.state.value}</Text>
        </View>);
    }
}

export default DifficultySlider;