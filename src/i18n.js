import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next';
import axios from 'axios';

const loadTranslations = async () => {
  try {
    const response = await axios.get('./translation.json');
    return response.data;
  } catch (error) {
    console.error('Error loading translations:', error);
    return {};
  }
};

i18n
 .use(LanguageDetector)
 .use(initReactI18next)
 .init({
    debug: true,
    fallbackLng: 'en',
    resources: {},
  });

loadTranslations().then((translations) => {
  i18n.addResources('en', 'translation', translations.en);
  i18n.addResources('fr', 'translation', translations.fr);
  i18n.addResources('pb', 'translation', translations.pb);
});