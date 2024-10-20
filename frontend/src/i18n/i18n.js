import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import si from './locales/si.json';
import ta from './locales/ta.json';

i18n
  .use(LanguageDetector)  // Detects language from browser
  .use(initReactI18next)   // Passes i18n to react-i18next
  .init({
    resources: {
      en: { translation: en },
      si: { translation: si },
      ta: { translation: ta }
    },
    lng: 'en', // Set default language to English
    fallbackLng: 'en',  // Fallback language
    interpolation: {
      escapeValue: false  // React already escapes by default
    }
  });

export default i18n;
