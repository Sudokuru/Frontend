import React from 'react';
import { View } from 'react-native';
import { useTheme, Switch, Text } from 'react-native-paper';
import { PreferencesContext } from '../../Contexts/PreferencesContext';

const ThemeToggle = () => {
    const theme = useTheme();
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);

    return (
        <View>
            <Text>Theme</Text>
            <Switch
                color={'red'}
                value={isThemeDark}
                onValueChange={toggleTheme}
                testID={isThemeDark ? "DarkThemeEnabled" : "DarkThemeDisabled"}
            />
        </View>
    );
};

export default ThemeToggle;