import React, {useState} from 'react';
import { Switch, Text } from 'react-native-paper';
import {View} from "react-native";

const SaveGamePreferencesToggle = () => {

    const [isHighlightAllSelectedNumberEnabled, setIsHighlightAllSelectedNumberEnabled] = useState(getHighlightAllSelectedNumber);
    const toggleHighlightAllSelectedNumberSwitch = () => setIsHighlightAllSelectedNumberEnabled(previousState => !previousState);
    // mock function
    function getHighlightAllSelectedNumber(): boolean {
        return true;
    }

    const [isHighlightSelectedBoxEnabled, setIsHighlightSelectedBoxEnabled] = useState(getHighlightSelectedBox);
    const toggleHighlightSelectedBoxSwitch = () => setIsHighlightSelectedBoxEnabled(previousState => !previousState);
    // mock function
    function getHighlightSelectedBox(): boolean {
        return true;
    }

    const [isHighlightSelectedRowEnabled, setIsHighlightSelectedRowEnabled] = useState(getHighlightSelectedRow);
    const toggleHighlightSelectedRowSwitch = () => setIsHighlightSelectedRowEnabled(previousState => !previousState);
    // mock function
    function getHighlightSelectedRow(): boolean {
        return true;
    }

    return (
        <View>
            <Text>HighlightAllSelectedNumber</Text>
            <Switch
                color={'#025E73'}
                value={isHighlightAllSelectedNumberEnabled}
                onValueChange={toggleHighlightAllSelectedNumberSwitch}
                testID={isHighlightAllSelectedNumberEnabled ? "HighlightAllSelectedNumberEnabled" : "HighlightAllSelectedNumberDisabled"}
            />
            <Text>HighlightSelectedBox</Text>
            <Switch
                color={'#025E73'}
                value={isHighlightSelectedBoxEnabled}
                onValueChange={toggleHighlightSelectedBoxSwitch}
                testID={isHighlightSelectedBoxEnabled ? "HighlightSelectedBoxEnabled" : "HighlightSelectedBoxDisabled"}
            />
            <Text>HighlightSelectedRow</Text>
            <Switch
                color={'#025E73'}
                value={isHighlightSelectedRowEnabled}
                onValueChange={toggleHighlightSelectedRowSwitch}
                testID={isHighlightSelectedRowEnabled ? "HighlightSelectedRowEnabled" : "HighlightSelectedRowDisabled"}
            />
        </View>
    );
};

export default SaveGamePreferencesToggle;