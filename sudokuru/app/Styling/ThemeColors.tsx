import {
    MD3DarkTheme,
    MD3LightTheme,
} from 'react-native-paper';
import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import merge from 'deepmerge';

const dTheme = {
    ...MD3DarkTheme, // or MD3DarkTheme
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#F2F2F2',
    onPrimary: '#F2F2F2',
    primaryContainer: '#F2F2F2',
    onPrimaryContainer: '#F2F2F2',
    background: '#025E73',
    onBackground: '#F2F2F2',
    secondary: '#F2F2F2',
    secondaryContainer: '#F2F2F2',
    tertiary: '#F2F2F2',
    tertiaryContainer: '#F2F2F2',
    backdrop: '#025E73',
    onSecondaryContainer: '#F2F2F2',
    onTertiary: '#F2F2F2',
    onTertiaryContainer: '#F2F2F2',
    onSurface: '#F2F2F2',
    onSurfaceVariant: '#F2F2F2',
  },
}; 

const d2Theme = {
    ...NavigationDarkTheme,
 colors: {
   ...NavigationDarkTheme.colors,
   primary: '#D9A05B',
    onPrimary: '#F2F2F2',
    primaryContainer: 'rgb(217, 160, 91)',
    onPrimaryContainer: '#F2F2F2',
    background: '#025E73',
    onBackground: '#F2F2F2',
    secondary: '#F2F2F2',
    secondaryContainer: '#F2F2F2',
    tertiary: '#F2F2F2',
    tertiaryContainer: '#F2F2F2',
    backdrop: '#025E73',
    onSecondaryContainer: '#F2F2F2',
    onTertiary: '#F2F2F2',
    onTertiaryContainer: '#F2F2F2',
    onSurface: '#F2F2F2',
    onSurfaceVariant: '#F2F2F2',
},};

const l2Theme = {
    ...NavigationDefaultTheme,
 colors: {
   ...NavigationDefaultTheme.colors,
   primary: '#D9A05B',
    onPrimary: '#F2F2F2',
    primaryContainer: 'rgb(217, 160, 91)',
    onPrimaryContainer: '#F2F2F2',
    background: '#025E73',
    onBackground: '#F2F2F2',
    secondary: '#F2F2F2',
    secondaryContainer: '#F2F2F2',
    tertiary: '#F2F2F2',
    tertiaryContainer: '#F2F2F2',
    backdrop: '#025E73',
    onSecondaryContainer: '#F2F2F2',
    onTertiary: '#F2F2F2',
    onTertiaryContainer: '#F2F2F2',
    onSurface: '#F2F2F2',
    onSurfaceVariant: '#F2F2F2',
},};


const lTheme = {
    ...MD3LightTheme, // or MD3DarkTheme
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#D9A05B',
    onPrimary: '#F2F2F2',
    primaryContainer: 'rgb(217, 160, 91)',
    onPrimaryContainer: '#F2F2F2',
    background: '#025E73',
    onBackground: '#F2F2F2',
    secondary: '#F2F2F2',
    secondaryContainer: '#F2F2F2',
    tertiary: '#F2F2F2',
    tertiaryContainer: '#F2F2F2',
    backdrop: '#025E73',
    onSecondaryContainer: '#F2F2F2',
    onTertiary: '#F2F2F2',
    onTertiaryContainer: '#F2F2F2',
    onSurface: '#F2F2F2',
    onSurfaceVariant: '#F2F2F2',
  },
};

const CombinedDefaultTheme = merge(lTheme, l2Theme)
const CombinedDarkTheme = merge(dTheme, d2Theme)

export default {dTheme, d2Theme, lTheme, l2Theme, CombinedDefaultTheme, CombinedDarkTheme};
