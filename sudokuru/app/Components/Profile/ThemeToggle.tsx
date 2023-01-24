import React from 'react';
import { useTheme, Appbar, TouchableRipple, Switch } from 'react-native-paper';
import { PreferencesContext } from '../../Contexts/PreferencesContext';

const ThemeToggle = () => {
    const theme = useTheme();
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);

    return (
        <Appbar.Header
            theme={{
                colors: {
                    primary: theme?.colors.surface,
                },
            }}
        >
            <Appbar.Content title="Theme" />
            <Switch
                color={'red'}
                value={isThemeDark}
                onValueChange={toggleTheme}
            />
        </Appbar.Header>
    );
};

export default ThemeToggle;