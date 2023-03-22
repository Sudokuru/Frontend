import Slider from '@react-native-community/slider';
import React, { Component } from 'react';
import { View } from "react-native";

class DifficultySlider extends Component {
    
  constructor(props){
    super(props)
    this.state = {
      percentage: 50,
      minPercentage: 0,
      maxPercentage: 100,
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange (val) {
    this.setState({ percentage: val })
    props.onValueChange(val)
  } 

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
            value={this.state.percentage}
            onValueChange={val => this.props.onValueChange({ percentage: val })} />
        </View>);
    }
}

export default DifficultySlider;