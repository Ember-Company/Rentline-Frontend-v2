import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation resources
import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';

/*
 * Initialize i18next.
 *
 * We register the translation resources for each supported language under their
 * respective locale codes ("en", "es", "pt"). The `translation` namespace
 * is used by default in react-i18next. The `lng` option defines the default
 * language; here we fall back to English. If you wish to override the default
 * language at runtime, set the `lng` option accordingly or call
 * `i18n.changeLanguage('es')` or `i18n.changeLanguage('pt')` from your UI.
 *
 * The `fallbackLng` ensures that missing keys will default to English. The
 * interpolation escape is turned off because React escapes values by default.
 */
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      pt: { translation: pt },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;