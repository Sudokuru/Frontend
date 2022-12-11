import Constants from 'expo-constants';
import { AppConfig } from './app.config';

export const { DOMAIN, CLIENT_ID } = Constants.manifest?.extra as AppConfig;