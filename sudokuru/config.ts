import Constants from 'expo-constants';
import { AppConfig } from './app.config';

export const { DOMAIN, CLIENT_ID, AUDIENCE, SCOPE } = Constants.manifest?.extra as AppConfig;