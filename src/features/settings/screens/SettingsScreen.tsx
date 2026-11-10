import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/shared/components/Header';
import { LanguageToggle } from '@/shared/components/LanguageToggle';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

export function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-muted">
      <Header title={t('settings.title')} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingTop: 12, paddingBottom: insets.bottom + 16 }}>
        <LanguageToggle />
        <ThemeToggle />
      </ScrollView>
    </View>
  );
}
