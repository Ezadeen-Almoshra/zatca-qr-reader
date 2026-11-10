import { useRouter, type Href } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@/shared/components/AppIcon';
import { BrandMark } from '@/shared/components/BrandMark';
import { Reveal } from '@/shared/components/motion/Reveal';
import { Button } from '@/shared/components/ui/Button';
import { Text } from '@/shared/components/ui/Text';
import { useTheme } from '@/shared/theme';

export function AboutScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-muted">
      <View className="bg-header px-4 pb-3" style={{ paddingTop: insets.top + 12 }}>
        <Text className="text-[22px] font-semibold text-inverse">{t('about.title')}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }}>
        <Reveal>
          <View className="items-center rounded-3xl bg-surface px-5 py-5">
            <BrandMark size={84} showWordmark />
            <Text className="mt-3 text-center text-xl font-bold text-primary">
              {t('about.heading')}
            </Text>
            <Text className="mt-2 text-center text-[15px] leading-6 text-subtle">
              {t('about.body')}
            </Text>
            <Text className="mt-2 text-xs text-subtle">{t('about.version')}</Text>
          </View>
        </Reveal>
        <Reveal delay={80}>
          <View className="mt-3 rounded-3xl bg-surface px-5 py-4">
            <Text className="text-center text-sm font-semibold text-primary">
              {t('about.disclaimerTitle')}
            </Text>
            <Text className="mt-2 text-center text-[15px] leading-6 text-subtle">
              {t('about.disclaimer')}
            </Text>
          </View>
        </Reveal>
        <Text className="mb-2 mt-4 text-sm font-semibold text-subtle">{t('about.contact')}</Text>
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => void Linking.openURL('mailto:ezadeen.dev@gmail.com')}
            className="flex-1 items-center rounded-2xl bg-surface px-3 py-3">
            <AppIcon name="mail-outline" size={20} color={colors.primary} />
            <Text className="mt-1.5 text-center text-sm font-semibold text-primary">
              {t('about.contactUs')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => void Linking.openURL('https://zatca.gov.sa')}
            className="flex-1 items-center rounded-2xl bg-surface px-3 py-3">
            <AppIcon name="open-outline" size={20} color={colors.primary} />
            <Text className="mt-1.5 text-center text-sm font-semibold text-primary">
              {t('about.contactZatca')}
            </Text>
          </Pressable>
        </View>
        <Button className="mt-4 rounded-full" onPress={() => router.push('/settings' as Href)}>
          <View className="flex-row items-center gap-2">
            <AppIcon name="settings-outline" size={18} color={colors.inverse} />
            <Text className="text-base font-semibold text-inverse">{t('about.settings')}</Text>
          </View>
        </Button>
      </ScrollView>
    </View>
  );
}
