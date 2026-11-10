import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/shared/components/ui/Text';

export function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
      <View className="bg-header px-4 pb-3" style={{ paddingTop: insets.top + 12 }}>
        <Text className="text-[22px] font-semibold text-inverse">{t('home.title')}</Text>
      </View>
      <View className="mx-3 mt-3 rounded-2xl bg-surface p-4">
        <Text className="text-xl font-semibold text-foreground">{t('home.welcome')}</Text>
        <Text className="mt-2 text-[15px] leading-6 text-subtle">{t('home.subtitle')}</Text>
      </View>
      <View className="mx-3 mt-2.5 rounded-2xl bg-surface p-4">
        <Text className="text-base font-semibold text-foreground">{t('home.tipTitle')}</Text>
        <Text className="mt-2 text-[15px] leading-6 text-subtle">{t('home.tipBody')}</Text>
      </View>
    </ScrollView>
  );
}
