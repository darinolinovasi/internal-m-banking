import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import id from '../locales/id.json';
import jp from '../locales/jp.json';

const resources = {
    en: { translation: en },
    id: { translation: id },
    jp: { translation: jp },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;