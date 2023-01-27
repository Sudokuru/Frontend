import React, {useState} from 'react';
import { Switch, Text } from 'react-native-paper';
import {View} from "react-native";

const SaveGamePreferencesToggle = () => {

    const [isSaveGameHistoryEnabled, setIsSaveGameHistoryEnabled] = useState(getSaveGameHistoryState);
    const toggleSaveGameHistorySwitch = () => setIsSaveGameHistoryEnabled(previousState => !previousState);
    // mock function
    function getSaveGameHistoryState(): boolean {
        return false;
    }

    const [isNotifyOnWrongCellEnabled, setIsNotifyOnWrongCellEnabled] = useState(getNotifyOnWrongCellState);
    const toggleNotifyOnWrongCellSwitch = () => setIsNotifyOnWrongCellEnabled(previousState => !previousState);
    // mock function
    function getNotifyOnWrongCellState(): boolean {
        return true;
    }

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

    const [isPlayMusicEnabled, setIsPlayMusicEnabled] = useState(getPlayMusic);
    const togglePlayMusicSwitch = () => setIsPlayMusicEnabled(previousState => !previousState);
    // mock function
    function getPlayMusic(): boolean {
        return false;
    }

    const [isMusicIntensifyEnabled, setIsMusicIntensifyEnabled] = useState(getMusicIntensifyEnabled);
    const toggleMusicIntensifySwitch = () => setIsMusicIntensifyEnabled(previousState => !previousState);
    // mock function
    function getMusicIntensifyEnabled(): boolean {
        return false;
    }

    return (
        <View>
            <Text>SaveGameHistory</Text>
            <Switch
                color={'red'}
                value={isSaveGameHistoryEnabled}
                onValueChange={toggleSaveGameHistorySwitch}
                testID={isSaveGameHistoryEnabled ? "SaveGameHistoryEnabled" : "SaveGameHistoryDisabled"}
            />
            <Text>NotifyOnWrongCell</Text>
            <Switch
                color={'red'}
                value={isNotifyOnWrongCellEnabled}
                onValueChange={toggleNotifyOnWrongCellSwitch}
                testID={isNotifyOnWrongCellEnabled ? "NotifyOnWrongCellEnabled" : "NotifyOnWrongCellDisabled"}
            />
            <Text>HighlightAllSelectedNumber</Text>
            <Switch
                color={'red'}
                value={isHighlightAllSelectedNumberEnabled}
                onValueChange={toggleHighlightAllSelectedNumberSwitch}
                testID={isHighlightAllSelectedNumberEnabled ? "HighlightAllSelectedNumberEnabled" : "HighlightAllSelectedNumberDisabled"}
            />
            <Text>HighlightSelectedBox</Text>
            <Switch
                color={'red'}
                value={isHighlightSelectedBoxEnabled}
                onValueChange={toggleHighlightSelectedBoxSwitch}
                testID={isHighlightSelectedBoxEnabled ? "HighlightSelectedBoxEnabled" : "HighlightSelectedBoxDisabled"}
            />
            <Text>HighlightSelectedRow</Text>
            <Switch
                color={'red'}
                value={isHighlightSelectedRowEnabled}
                onValueChange={toggleHighlightSelectedRowSwitch}
                testID={isHighlightSelectedRowEnabled ? "HighlightSelectedRowEnabled" : "HighlightSelectedRowDisabled"}
            />
            <Text>PlayMusic</Text>
            <Switch
                color={'red'}
                value={isPlayMusicEnabled}
                onValueChange={togglePlayMusicSwitch}
                testID={isPlayMusicEnabled ? "PlayMusicEnabled" : "PlayMusicDisabled"}
            />
            <Text>MusicIntensify</Text>
            <Switch
                color={'red'}
                value={isMusicIntensifyEnabled}
                onValueChange={toggleMusicIntensifySwitch}
                testID={isMusicIntensifyEnabled ? "MusicIntensifyEnabled" : "MusicIntensifyDisabled"}
            />
        </View>
    );
};

export default SaveGamePreferencesToggle;