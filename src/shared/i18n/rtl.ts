import { reloadAppAsync } from 'expo';
import { I18nManager, Platform } from 'react-native';
import { isRtlLanguage } from './i18n';
import type { AppLanguage } from './i18n';

function applyWebDirection(isRTL: boolean, language: AppLanguage) {
  if (typeof document === 'undefined') return;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
}

export async function applyLanguageDirection(
  language: AppLanguage,
  options?: { reloadIfNeeded?: boolean },
) {
  const shouldBeRTL = isRtlLanguage(language);

  if (Platform.OS === 'web') {
    applyWebDirection(shouldBeRTL, language);
    return;
  }

  if (I18nManager.isRTL === shouldBeRTL) return;

  I18nManager.allowRTL(shouldBeRTL);
  I18nManager.forceRTL(shouldBeRTL);

  if (options?.reloadIfNeeded) {
    await reloadAppAsync();
  }
}
