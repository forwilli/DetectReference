import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import zhTranslations from './locales/zh.json';
import esTranslations from './locales/es.json';
import jaTranslations from './locales/ja.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import ptTranslations from './locales/pt.json';
import hiTranslations from './locales/hi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      zh: { translation: zhTranslations },
      es: { translation: esTranslations },
      ja: { translation: jaTranslations },
      fr: { translation: frTranslations },
      de: { translation: deTranslations },
      pt: { translation: ptTranslations },
      hi: { translation: hiTranslations }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;