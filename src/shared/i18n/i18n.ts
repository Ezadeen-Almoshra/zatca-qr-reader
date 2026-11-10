import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ar } from './locales/ar';
import { en } from './locales/en';

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const RTL_LANGUAGES: readonly AppLanguage[] = ['ar'];

export function isRtlLanguage(language: string): boolean {
  return RTL_LANGUAGES.includes(language as AppLanguage);
}

export function resolveLanguage(code?: string | null): AppLanguage {
  const normalized = code?.split('-')[0]?.toLowerCase();
  if (normalized === 'ar') return 'ar';
  return 'en';
}

export function getDeviceLanguage(): AppLanguage {
  return resolveLanguage(getLocales()[0]?.languageCode);
}

export function getDateLocale(language: string): string {
  return resolveLanguage(language) === 'ar' ? 'ar' : 'en';
}

if (!i18n.isInitialized) {
  // i18next default export exposes instance methods like `.use()` / `.init()`
  // eslint-disable-next-line import/no-named-as-default-member -- intentional i18n instance API
  void i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

export default i18n;
