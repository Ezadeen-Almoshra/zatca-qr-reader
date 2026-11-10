import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { storage } from '@/shared/services/storage';
import i18n, { getDeviceLanguage, isRtlLanguage, resolveLanguage, type AppLanguage } from './i18n';
import { applyLanguageDirection } from './rtl';

interface I18nContextValue {
  language: AppLanguage;
  isRTL: boolean;
  setLanguage: (language: AppLanguage) => Promise<void>;
}

const I18nContext = createContext<I18nContextValue | null>(null);

async function activateLanguage(language: AppLanguage, options?: { reloadIfNeeded?: boolean }) {
  if (i18n.language !== language) {
    await i18n.changeLanguage(language);
  }
  await applyLanguageDirection(language, options);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => resolveLanguage(i18n.language));

  useEffect(() => {
    let cancelled = false;

    storage.getLanguage().then(async (saved) => {
      const next = saved ?? getDeviceLanguage();
      await activateLanguage(next);
      if (!cancelled) setLanguageState(next);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setLanguage = useCallback(async (next: AppLanguage) => {
    await storage.setLanguage(next);
    setLanguageState(next);
    await activateLanguage(next, { reloadIfNeeded: true });
  }, []);

  const isRTL = isRtlLanguage(language);

  const value = useMemo<I18nContextValue>(
    () => ({ language, isRTL, setLanguage }),
    [language, isRTL, setLanguage],
  );

  return (
    <I18nContext.Provider value={value}>
      <View className="flex-1">{children}</View>
    </I18nContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useLocale must be used within I18nProvider');
  }
  return context;
}
