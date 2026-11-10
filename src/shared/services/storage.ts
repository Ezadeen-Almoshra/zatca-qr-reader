import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPPORTED_LANGUAGES, type AppLanguage } from '@/shared/i18n/i18n';
import type { ThemePreference } from '@/shared/theme/tokens';

const KEYS = {
  THEME: 'theme_preference',
  LANGUAGE: 'app_language',
  INVOICES: 'zatcaqr_invoices',
};

export const storage = {
  async getToken(): Promise<string | null> {
    return null;
  },

  async getTheme(): Promise<ThemePreference | null> {
    const value = await AsyncStorage.getItem(KEYS.THEME);
    if (value === 'light' || value === 'dark' || value === 'system') {
      return value;
    }
    return null;
  },

  async setTheme(preference: ThemePreference) {
    await AsyncStorage.setItem(KEYS.THEME, preference);
  },

  async getLanguage(): Promise<AppLanguage | null> {
    const value = await AsyncStorage.getItem(KEYS.LANGUAGE);
    if (value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value)) {
      return value as AppLanguage;
    }
    return null;
  },

  async setLanguage(language: AppLanguage) {
    await AsyncStorage.setItem(KEYS.LANGUAGE, language);
  },

  async getInvoices<T = unknown>(): Promise<T[]> {
    const data = await AsyncStorage.getItem(KEYS.INVOICES);
    return data ? (JSON.parse(data) as T[]) : [];
  },

  async setInvoices(invoices: unknown) {
    await AsyncStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
  },
};
