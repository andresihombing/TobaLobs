import I18n from 'react-native-i18n';
import id from './locales/id';
import en from './locales/en';

I18n.fallbacks = true;


I18n.translations = {
  // default: en,
  // 'en-US': en,
  // en,
  // id,
    id,
    en
  };

export default I18n;