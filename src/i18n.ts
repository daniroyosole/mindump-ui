import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import ca from './locales/ca.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      ca: { translation: ca },
      en: { translation: en }
    },
    lng: 'es', // Aquí dejamos vacío para que lo seleccione después
    fallbackLng: 'es', // fallback por si no detecta nada
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },
  });

export default i18n;
