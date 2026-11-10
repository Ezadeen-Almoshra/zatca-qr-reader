import { useRouter, type Href } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReportType } from '@/features/invoices';
import { AppIcon, type AppIconName } from '@/shared/components/AppIcon';
import { Reveal } from '@/shared/components/motion/Reveal';
import { Text } from '@/shared/components/ui/Text';
import { useLocale } from '@/shared/i18n';
import { useTheme } from '@/shared/theme';

const ITEMS: {
  type: ReportType;
  icon: AppIconName;
  title: 'reports.summary' | 'reports.details' | 'reports.sellers' | 'reports.categories';
  hint:
    | 'reports.summaryHint'
    | 'reports.detailsHint'
    | 'reports.sellersHint'
    | 'reports.categoriesHint';
}[] = [
  {
    type: 'summary',
    icon: 'pie-chart-outline',
    title: 'reports.summary',
    hint: 'reports.summaryHint',
  },
  {
    type: 'details',
    icon: 'receipt-outline',
    title: 'reports.details',
    hint: 'reports.detailsHint',
  },
  {
    type: 'sellers',
    icon: 'storefront-outline',
    title: 'reports.sellers',
    hint: 'reports.sellersHint',
  },
  {
    type: 'categories',
    icon: 'grid-outline',
    title: 'reports.categories',
    hint: 'reports.categoriesHint',
  },
];

export function ReportsScreen() {
  const { t } = useTranslation();
  const { isRTL } = useLocale();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-muted">
      <View className="bg-header px-4 pb-3" style={{ paddingTop: insets.top + 12 }}>
        <Text className="text-[22px] font-semibold text-inverse">{t('reports.title')}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: insets.bottom + 16 }}>
        {ITEMS.map((item, index) => (
          <Reveal key={item.type} delay={index * 50}>
            <Pressable
              onPress={() => router.push(`/report/${item.type}` as Href)}
              className="mb-2 flex-row items-center rounded-2xl bg-surface px-3.5 py-3.5 active:opacity-80">
              <View className="me-2.5 h-10 w-10 items-center justify-center rounded-2xl bg-muted">
                <AppIcon name={item.icon} size={20} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">{t(item.title)}</Text>
                <Text className="mt-1 text-sm text-subtle">{t(item.hint)}</Text>
              </View>
              <AppIcon
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={18}
                color={colors.icon}
              />
            </Pressable>
          </Reveal>
        ))}
      </ScrollView>
    </View>
  );
}
