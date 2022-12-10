import 'dotenv/config';

// this config file may override the app.json config file. Will have to experiment.

export interface AppConfig {
    DOMAIN: string,
    CLIENT_ID: string,
}

export default {
    name: 'Sudokuru',
    slug: 'sudokuru',
    scheme: 'sudokuru',
    version: '1.0.0',
    extra: {
        DOMAIN: process.env.DOMAIN,
        CLIENT_ID: process.env.CLIENT_ID,
    },
};