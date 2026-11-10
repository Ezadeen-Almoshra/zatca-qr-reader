import { useRouter, type Href } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { AppIcon } from '@/shared/components/AppIcon';
import { Text } from '@/shared/components/ui/Text';
import { useLocale } from '@/shared/i18n';
import { formatDate, formatMoney } from '@/shared/lib/money';
import { useTheme } from '@/shared/theme';
import { ComplianceBadge } from './ComplianceBadge';
import type { StoredInvoice } from '../types';

export function InvoiceCard({ invoice }: { invoice: StoredInvoice }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLocale();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => router.push(`/invoice/${invoice.id}` as Href)}
      className="mb-2 flex-row gap-2.5 rounded-2xl bg-surface px-3.5 py-3 active:opacity-80">
      <View className="mt-0.5 h-10 w-10 items-center justify-center rounded-2xl bg-muted">
        <AppIcon name="receipt-outline" size={20} color={colors.primary} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-base font-semibold text-foreground" numberOfLines={2}>
            {invoice.sellerName}
          </Text>
          <ComplianceBadge status={invoice.status} />
        </View>
        <Text className="mt-1 text-xs text-subtle">
          {invoice.timestamp
            ? formatDate(invoice.timestamp, language)
            : formatDate(invoice.scannedAt, language)}
        </Text>
        <View className="mt-2 flex-row items-end justify-between">
          <Text className="text-sm text-subtle">{t(`invoice.categories.${invoice.category}`)}</Text>
          <View className="items-end">
            <Text className="text-lg font-bold text-primary">
              {formatMoney(invoice.total, language)}
            </Text>
            <Text className="text-xs text-subtle">
              {t('invoice.vat')} {formatMoney(invoice.vat, language)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
