import React, {useState} from 'react';
import { Switch, Text } from 'react-native-paper';
import {StyleSheet, View} from "react-native";

const SaveGamePreferencesToggle = () => {

    const [areGamePreferencesEnabled, setAreGamePreferencesEnabledEnabled] = useState(false);
    const toggleGamePreferencesSwitch = () => setAreGamePreferencesEnabledEnabled(false);

    const [isNotifyOnWrongCellEnabled, setIsNotifyOnWrongCellEnabled] = useState(false);
    const toggleNotifyOnWrongCellSwitch = () => setIsNotifyOnWrongCellEnabled(previousState => !previousState);

    const [isHighlightAllSelectedNumberEnabled, setIsHighlightAllSelectedNumberEnabled] = useState(false);
    const toggleHighlightAllSelectedNumberSwitch = () => setIsHighlightAllSelectedNumberEnabled(previousState => !previousState);

    const [isHighlightSelectedBoxEnabled, setIsHighlightSelectedBoxEnabled] = useState(false);
    const toggleHighlightSelectedBoxSwitch = () => setIsHighlightSelectedBoxEnabled(previousState => !previousState);

    const [isHighlightSelectedRowEnabled, setIsHighlightSelectedRowEnabled] = useState(false);
    const toggleHighlightSelectedRowSwitch = () => setIsHighlightSelectedRowEnabled(previousState => !previousState);

    const [isPlayMusicEnabled, setIsPlayMusicEnabled] = useState(false);
    const togglePlayMusicSwitch = () => setIsPlayMusicEnabled(previousState => !previousState);

    const [isMusicIntensifyEnabled, setIsMusicIntensifyEnabled] = useState(false);
    const toggleMusicIntensifySwitch = () => setIsMusicIntensifyEnabled(previousState => !previousState);

    return (
        <View>
            <Text>AllGamePreferences</Text>
            <Switch
                color={'red'}
                value={areGamePreferencesEnabled}
                onValueChange={toggleGamePreferencesSwitch}
            />
            <Text style={styles.switch}>NotifyOnWrongCell</Text>
            <Switch
                style={styles.switch}
                color={'red'}
                value={isNotifyOnWrongCellEnabled}
                onValueChange={toggleNotifyOnWrongCellSwitch}
            />
            <Text style={styles.switch}>HighlightAllSelectedNumber</Text>
            <Switch
                style={styles.switch}
                color={'red'}
                value={isHighlightAllSelectedNumberEnabled}
                onValueChange={toggleHighlightAllSelectedNumberSwitch}
            />
            <Text style={styles.switch}>HighlightSelectedBox</Text>
            <Switch
                style={styles.switch}
                color={'red'}
                value={isHighlightSelectedBoxEnabled}
                onValueChange={toggleHighlightSelectedBoxSwitch}
            />
            <Text style={styles.switch}>HighlightSelectedRow</Text>
            <Switch
                style={styles.switch}
                color={'red'}
                value={isHighlightSelectedRowEnabled}
                onValueChange={toggleHighlightSelectedRowSwitch}
            />
            <Text style={styles.switch}>PlayMusic</Text>
            <Switch
                style={styles.switch}
                color={'red'}
                value={isPlayMusicEnabled}
                onValueChange={togglePlayMusicSwitch}
            />
            <Text style={styles.switch}>MusicIntensify</Text>
            <Switch
                style={styles.switch}
                color={'red'}
                value={isMusicIntensifyEnabled}
                onValueChange={toggleMusicIntensifySwitch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    switch: {
        marginLeft: 40
    },
});

export default SaveGamePreferencesToggle;