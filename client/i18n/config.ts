import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import enCA from './locales/en-CA.json';
import frCA from './locales/fr-CA.json';

const resources = {
  en: { translation: en },
  'en-CA': { translation: enCA },
  'fr-CA': { translation: frCA },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

