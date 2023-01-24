import React, {useState} from 'react';
import { Appbar, Switch } from 'react-native-paper';

const SaveGameHistoryToggle = () => {

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <Appbar.Header>
            <Appbar.Content title="SaveGameHistory" />
            <Switch
                color={'red'}
                value={isEnabled}
                onValueChange={toggleSwitch}
            />
        </Appbar.Header>
    );
};

export default SaveGameHistoryToggle;