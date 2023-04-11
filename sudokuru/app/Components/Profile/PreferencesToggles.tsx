import React from 'react';
import { View } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import { PreferencesContext } from '../../Contexts/PreferencesContext';

const PreferencesToggles = () => {
    const { toggleTheme, isThemeDark, toggleHighlightSet, isHighlightSet,
        isHighlightBox, toggleHighlightBox, toggleHighlightColumn, isHighlightColumn, toggleHighlightRow, isHighlightRow
    } = React.useContext(PreferencesContext);

    return (
        <View>
            <Text>Theme</Text>
            <Switch
                color={'#025E73'}
                value={isThemeDark}
                onValueChange={toggleTheme}
                testID={isThemeDark ? "DarkThemeEnabled" : "DarkThemeDisabled"}
            />
            <Text>Highlight Peers</Text>
            <Switch
                color={'#025E73'}
                value={isHighlightSet}
                onValueChange={toggleHighlightSet}
                testID={isHighlightSet ? "HighlightPeersEnabled" : "HighlightPeersDisabled"}
            />
            <Text>Highlight Box</Text>
            <Switch
                color={'#025E73'}
                value={isHighlightBox}
                onValueChange={toggleHighlightBox}
                testID={isHighlightBox ? "HighlightBoxEnabled" : "HighlightBoxDisabled"}
            />
            <Text>Highlight Row</Text>
            <Switch
                color={'#025E73'}
                value={isHighlightRow}
                onValueChange={toggleHighlightRow}
                testID={isHighlightRow ? "HighlightRowEnabled" : "HighlightRowDisabled"}
            />
            <Text>Highlight Column</Text>
            <Switch
                color={'#025E73'}
                value={isHighlightColumn}
                onValueChange={toggleHighlightColumn}
                testID={isHighlightColumn ? "HighlightColumnEnabled" : "HighlightColumnDisabled"}
            />
        </View>
    );
};

export default PreferencesToggles;