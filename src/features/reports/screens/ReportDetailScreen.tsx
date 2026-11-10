import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useInvoices, type ReportType } from '@/features/invoices';
import { InvoiceCard } from '@/features/invoices/components/InvoiceCard';
import { Header } from '@/shared/components/Header';
import { Text } from '@/shared/components/ui/Text';
import { useLocale } from '@/shared/i18n';
import { formatMoney } from '@/shared/lib/money';
import type { InvoiceCategory } from '@/shared/lib/zatca';

const TITLES: Record<
  ReportType,
  'reports.summary' | 'reports.details' | 'reports.sellers' | 'reports.categories'
> = {
  summary: 'reports.summary',
  details: 'reports.details',
  sellers: 'reports.sellers',
  categories: 'reports.categories',
};

function isReportType(value: string | undefined): value is ReportType {
  return (
    value === 'summary' || value === 'details' || value === 'sellers' || value === 'categories'
  );
}

export function ReportDetailScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const reportType: ReportType = isReportType(type) ? type : 'summary';
  const { t } = useTranslation();
  const { language } = useLocale();
  const router = useRouter();
  const { filteredInvoices, totals, bySeller, byCategory } = useInvoices();

  return (
    <View className="flex-1 bg-muted">
      <Header title={t(TITLES[reportType])} onBack={() => router.back()} />
      <ScrollView contentContainerClassName="p-3 pb-6">
        {filteredInvoices.length === 0 ? (
          <View className="rounded-2xl bg-surface px-4 py-10">
            <Text className="text-center text-base text-subtle">{t('reports.empty')}</Text>
          </View>
        ) : null}

        {reportType === 'summary' && filteredInvoices.length > 0 ? (
          <View className="overflow-hidden rounded-2xl bg-surface">
            <Row label={t('stats.expenses')} value={formatMoney(totals.total, language)} />
            <Row label={t('stats.tax')} value={formatMoney(totals.vat, language)} />
            <Row
              label={t('reports.withoutTax')}
              value={formatMoney(totals.total - totals.vat, language)}
            />
            <Row label={t('reports.invoiceCount')} value={String(totals.count)} last />
          </View>
        ) : null}

        {reportType === 'details'
          ? filteredInvoices.map((invoice) => <InvoiceCard key={invoice.id} invoice={invoice} />)
          : null}

        {reportType === 'sellers'
          ? bySeller.map((item) => (
              <View key={item.key} className="mb-2 rounded-2xl bg-surface px-3.5 py-3">
                <Text className="text-base font-semibold text-foreground">{item.label}</Text>
                <Text className="mt-2 text-sm text-subtle">
                  {t('common.count')}: {item.count}
                </Text>
                <Text className="mt-1 text-lg font-bold text-primary">
                  {formatMoney(item.total, language)}
                </Text>
                <Text className="text-xs text-subtle">
                  {t('invoice.vat')} {formatMoney(item.vat, language)}
                </Text>
              </View>
            ))
          : null}

        {reportType === 'categories'
          ? byCategory.map((item) => (
              <View key={item.key} className="mb-2 rounded-2xl bg-surface px-3.5 py-3">
                <Text className="text-base font-semibold text-foreground">
                  {t(`invoice.categories.${item.key as InvoiceCategory}`)}
                </Text>
                <Text className="mt-2 text-sm text-subtle">
                  {t('common.count')}: {item.count}
                </Text>
                <Text className="mt-1 text-lg font-bold text-primary">
                  {formatMoney(item.total, language)}
                </Text>
              </View>
            ))
          : null}
      </ScrollView>
    </View>
  );
}

function Row({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View
      className={`flex-row items-center justify-between px-3.5 py-3 ${last ? '' : 'border-b border-line'}`}>
      <Text className="flex-1 text-[15px] text-foreground">{label}</Text>
      <Text className="text-[15px] font-semibold text-primary">{value}</Text>
    </View>
  );
}
