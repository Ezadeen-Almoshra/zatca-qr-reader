import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInvoices } from '@/features/invoices';
import { DateRangeSheet } from '@/features/invoices/components/DateRangeSheet';
import { InvoiceCard } from '@/features/invoices/components/InvoiceCard';
import { AppIcon } from '@/shared/components/AppIcon';
import { Reveal } from '@/shared/components/motion/Reveal';
import { Text } from '@/shared/components/ui/Text';
import { useTheme } from '@/shared/theme';

export function HistoryScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { filteredInvoices, dateRange, setDateRange } = useInvoices();
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <View className="flex-1 bg-muted">
      <View className="bg-header px-4 pb-3" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-[22px] font-semibold text-inverse">{t('history.title')}</Text>
          <Pressable
            onPress={() => setFilterOpen(true)}
            className="flex-row items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
            <AppIcon name="funnel-outline" size={14} color={colors.accent} />
            <Text className="text-sm font-medium text-accent">{t('history.filter')}</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: insets.bottom + 16 }}>
        {filteredInvoices.length === 0 ? (
          <View className="mt-16 items-center px-6">
            <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-surface">
              <AppIcon name="receipt-outline" size={28} color={colors.primary} />
            </View>
            <Text className="text-center text-lg font-semibold text-foreground">
              {t('history.empty')}
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-subtle">
              {t('history.emptyHint')}
            </Text>
          </View>
        ) : (
          filteredInvoices.map((invoice, index) => (
            <Reveal key={invoice.id} delay={Math.min(index, 8) * 40}>
              <InvoiceCard invoice={invoice} />
            </Reveal>
          ))
        )}
        <Text className="mt-2 text-center text-xs text-subtle">{t('history.exportHint')}</Text>
      </ScrollView>
      <DateRangeSheet
        visible={filterOpen}
        value={dateRange}
        onClose={() => setFilterOpen(false)}
        onApply={setDateRange}
      />
    </View>
  );
}
