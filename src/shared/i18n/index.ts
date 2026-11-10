import './i18n';

export { default as i18n } from './i18n';
export {
  getDateLocale,
  getDeviceLanguage,
  isRtlLanguage,
  resolveLanguage,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
} from './i18n';
export { I18nProvider, useLocale } from './I18nProvider';
