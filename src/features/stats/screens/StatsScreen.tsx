import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInvoices } from '@/features/invoices';
import { DateRangeSheet } from '@/features/invoices/components/DateRangeSheet';
import { DonutChart } from '@/features/invoices/components/DonutChart';
import { AppIcon } from '@/shared/components/AppIcon';
import { Reveal } from '@/shared/components/motion/Reveal';
import { Text } from '@/shared/components/ui/Text';
import { useLocale } from '@/shared/i18n';
import { formatMoney } from '@/shared/lib/money';
import type { InvoiceCategory } from '@/shared/lib/zatca';
import { useTheme } from '@/shared/theme';

export function StatsScreen() {
  const { t } = useTranslation();
  const { language } = useLocale();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { filteredInvoices, totals, byCategory, bySeller, dateRange, setDateRange } = useInvoices();
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <View className="flex-1 bg-muted">
      <View className="bg-header px-4 pb-3" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-[22px] font-semibold text-inverse">{t('stats.title')}</Text>
          <Pressable
            onPress={() => setFilterOpen(true)}
            className="flex-row items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
            <AppIcon name="funnel-outline" size={14} color={colors.accent} />
            <Text className="text-sm font-medium text-accent">{t('history.filter')}</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: insets.bottom + 16 }}>
        <Reveal>
          <View className="mb-2.5 flex-row gap-2.5">
            <StatBox label={t('stats.expenses')} value={formatMoney(totals.total, language)} />
            <StatBox label={t('stats.tax')} value={formatMoney(totals.vat, language)} />
          </View>
        </Reveal>
        <Reveal delay={60}>
          <View className="mb-2.5 flex-row gap-2.5">
            <StatBox label={t('stats.invoiceCount')} value={String(totals.count)} />
            <StatBox
              label={t('stats.compliantShare')}
              value={
                totals.count ? `${Math.round((totals.compliant / totals.count) * 100)}%` : '0%'
              }
            />
          </View>
        </Reveal>
        {filteredInvoices.length === 0 ? (
          <View className="items-center rounded-2xl bg-surface px-4 py-10">
            <AppIcon name="pie-chart-outline" size={28} color={colors.icon} />
            <Text className="mt-3 text-center text-base text-subtle">{t('stats.empty')}</Text>
          </View>
        ) : (
          <>
            <Reveal delay={100}>
              <View className="mb-2.5 rounded-2xl bg-surface p-4">
                <Text className="mb-2 text-center text-base font-semibold text-primary">
                  {t('stats.byCategory')}
                </Text>
                <DonutChart
                  segments={byCategory}
                  centerLabel={t('stats.expenses')}
                  centerValue={formatMoney(totals.total, language)}
                  resolveLabel={(item) => t(`invoice.categories.${item.key as InvoiceCategory}`)}
                />
              </View>
              <View className="rounded-2xl bg-surface p-4">
                <Text className="mb-2 text-center text-base font-semibold text-primary">
                  {t('stats.bySeller')}
                </Text>
                <DonutChart
                  segments={bySeller.slice(0, 6)}
                  centerLabel={t('common.total')}
                  centerValue={formatMoney(totals.total, language)}
                />
              </View>
            </Reveal>
          </>
        )}
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

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-2xl bg-surface px-3.5 py-3">
      <Text className="text-xs text-subtle">{label}</Text>
      <Text className="mt-1 text-lg font-bold text-primary">{value}</Text>
    </View>
  );
}
