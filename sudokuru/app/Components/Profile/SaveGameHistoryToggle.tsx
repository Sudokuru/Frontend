import React, {useState} from 'react';
import { Switch, Text } from 'react-native-paper';
import {View} from "react-native";

const SaveGameHistoryToggle = () => {

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <View>
            <Text>SaveGameHistory</Text>
            <Switch
                color={'red'}
                value={isEnabled}
                onValueChange={toggleSwitch}
            />
        </View>
    );
};

export default SaveGameHistoryToggle;