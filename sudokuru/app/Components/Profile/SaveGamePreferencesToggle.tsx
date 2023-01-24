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
        return false;
    }

    const [isHighlightAllSelectedNumberEnabled, setIsHighlightAllSelectedNumberEnabled] = useState(getHighlightAllSelectedNumber);
    const toggleHighlightAllSelectedNumberSwitch = () => setIsHighlightAllSelectedNumberEnabled(previousState => !previousState);
    // mock function
    function getHighlightAllSelectedNumber(): boolean {
        return false;
    }

    const [isHighlightSelectedBoxEnabled, setIsHighlightSelectedBoxEnabled] = useState(getHighlightSelectedBox);
    const toggleHighlightSelectedBoxSwitch = () => setIsHighlightSelectedBoxEnabled(previousState => !previousState);
    // mock function
    function getHighlightSelectedBox(): boolean {
        return false;
    }

    const [isHighlightSelectedRowEnabled, setIsHighlightSelectedRowEnabled] = useState(getHighlightSelectedRow);
    const toggleHighlightSelectedRowSwitch = () => setIsHighlightSelectedRowEnabled(previousState => !previousState);
    // mock function
    function getHighlightSelectedRow(): boolean {
        return false;
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
            />
            <Text>NotifyOnWrongCell</Text>
            <Switch
                color={'red'}
                value={isNotifyOnWrongCellEnabled}
                onValueChange={toggleNotifyOnWrongCellSwitch}
            />
            <Text>HighlightAllSelectedNumber</Text>
            <Switch
                color={'red'}
                value={isHighlightAllSelectedNumberEnabled}
                onValueChange={toggleHighlightAllSelectedNumberSwitch}
            />
            <Text>HighlightSelectedBox</Text>
            <Switch
                color={'red'}
                value={isHighlightSelectedBoxEnabled}
                onValueChange={toggleHighlightSelectedBoxSwitch}
            />
            <Text>HighlightSelectedRow</Text>
            <Switch
                color={'red'}
                value={isHighlightSelectedRowEnabled}
                onValueChange={toggleHighlightSelectedRowSwitch}
            />
            <Text>PlayMusic</Text>
            <Switch
                color={'red'}
                value={isPlayMusicEnabled}
                onValueChange={togglePlayMusicSwitch}
            />
            <Text>MusicIntensify</Text>
            <Switch
                color={'red'}
                value={isMusicIntensifyEnabled}
                onValueChange={toggleMusicIntensifySwitch}
            />
        </View>
    );
};

export default SaveGamePreferencesToggle;