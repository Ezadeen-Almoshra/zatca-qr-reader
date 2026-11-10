import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon, type AppIconName } from '@/shared/components/AppIcon';
import { Header } from '@/shared/components/Header';
import { Reveal } from '@/shared/components/motion/Reveal';
import { useDialog } from '@/shared/components/ui/Dialog';
import { Text } from '@/shared/components/ui/Text';
import { useLocale } from '@/shared/i18n';
import { cn } from '@/shared/lib/cn';
import { formatInvoiceStamp, formatMoney } from '@/shared/lib/money';
import {
  INVOICE_CATEGORIES,
  invoiceHashToHex,
  type ComplianceStatus,
  type InvoiceCategory,
} from '@/shared/lib/zatca';
import { useTheme } from '@/shared/theme';
import { InvoiceSheet } from '../components/InvoiceSheet';
import { useInvoices } from '../context/InvoicesContext';
import { buildInvoiceHtml, printInvoiceHtml } from '../lib/print-invoice';

export function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getInvoice, updateInvoice, deleteInvoice } = useInvoices();
  const invoice = id ? getInvoice(id) : undefined;
  const { t } = useTranslation();
  const { language } = useLocale();
  const { alert, confirm } = useDialog();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [printing, setPrinting] = useState(false);

  if (!invoice) {
    return (
      <View className="flex-1 bg-muted">
        <Header title={t('invoice.result')} onBack={() => router.back()} />
        <Text className="mt-16 text-center text-subtle">{t('history.empty')}</Text>
      </View>
    );
  }

  const hash = invoiceHashToHex(invoice.invoiceHash);
  const total = formatMoney(invoice.total, language);
  const vat = formatMoney(invoice.vat, language);
  const issuedAt = invoice.timestamp ? formatInvoiceStamp(invoice.timestamp) : '—';
  const kind = t('invoice.kind');
  const phase = t(invoice.phase === 2 ? 'invoice.phaseTwo' : 'invoice.phaseOne');
  const rows = [
    { label: t('invoice.vatNumber'), value: invoice.vatNumber || '—' },
    { label: t('invoice.date'), value: issuedAt },
  ];
  const amounts = [
    { label: t('invoice.vatAmount'), value: vat },
    { label: t('invoice.totalWithVat'), value: total },
  ];

  const printInvoice = async () => {
    if (printing) return;
    setPrinting(true);
    try {
      await printInvoiceHtml(
        buildInvoiceHtml({
          kind,
          seller: invoice.sellerName,
          rows,
          amounts,
          hashLabel: hash ? t('invoice.hashPlain') : undefined,
          hash: hash || undefined,
        }),
      );
    } catch {
      await alert({ title: t('common.error'), message: t('invoice.printFailed'), tone: 'danger' });
    } finally {
      setPrinting(false);
    }
  };

  return (
    <View className="flex-1 bg-muted">
      <Header title={t('invoice.result')} onBack={() => router.back()} />
      <ScrollView contentContainerClassName="px-4 pb-4 pt-3">
        <View className="mb-2 gap-1.5">
          <InvoiceNotice
            icon={STATUS_ICON[invoice.status]}
            tone={invoice.status}
            title={t('invoice.compliance')}
            message={t(`invoice.${invoice.status}`)}
          />
          <InvoiceNotice
            icon="layers-outline"
            tone="note"
            title={t('invoice.phase')}
            message={phase}
          />
        </View>
        <InvoiceSheet
          kind={kind}
          seller={invoice.sellerName}
          rows={rows}
          amounts={amounts}
          hashLabel={hash ? t('invoice.hashPlain') : undefined}
          hash={hash || undefined}
        />

        {invoice.issues.length > 0 ? (
          <Reveal delay={80}>
            <View className="mt-3">
              {invoice.issues.map((issue) => (
                <Text key={issue.code} className="mt-1 text-center text-sm leading-6 text-danger">
                  {t(`invoice.issues.${issue.code}` as const)}
                </Text>
              ))}
            </View>
          </Reveal>
        ) : null}

        <Reveal delay={120}>
          <Text className="mb-1.5 mt-4 text-sm font-semibold text-subtle">
            {t('invoice.category')}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {INVOICE_CATEGORIES.map((category) => {
              const selected = invoice.category === category;
              return (
                <Pressable
                  key={category}
                  onPress={() => void updateInvoice(invoice.id, { category })}
                  className={cn('rounded-full px-3 py-1.5', selected ? 'bg-header' : 'bg-surface')}>
                  <Text
                    className={cn(
                      'text-sm',
                      selected ? 'font-semibold text-inverse' : 'text-foreground',
                    )}>
                    {t(`invoice.categories.${category as InvoiceCategory}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Reveal>

        <Pressable
          className="mt-3 flex-row items-center justify-center gap-2 py-2"
          onPress={() => {
            void confirm({
              title: t('common.delete'),
              message: t('invoice.deleteConfirm'),
              tone: 'danger',
              confirmLabel: t('common.delete'),
              onConfirm: async () => {
                await deleteInvoice(invoice.id);
                router.back();
              },
            });
          }}>
          <AppIcon name="trash-outline" size={16} color={colors.danger} />
          <Text className="text-sm font-semibold text-danger">{t('common.delete')}</Text>
        </Pressable>
      </ScrollView>

      <View
        className="flex-row gap-2.5 border-t border-line bg-surface px-4 pt-2.5"
        style={{ paddingBottom: insets.bottom + 8 }}>
        <Pressable
          accessibilityRole="button"
          disabled={printing}
          onPress={() => void printInvoice()}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-header px-3 py-3.5">
          <AppIcon name="print-outline" size={18} color={colors.inverse} />
          <Text className="text-base font-semibold text-inverse">
            {printing ? '…' : t('invoice.print')}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.navigate('/(tabs)' as Href)}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-full border border-line bg-surface px-3 py-3.5">
          <AppIcon name="scan-outline" size={18} color={colors.primary} />
          <Text className="text-base font-semibold text-primary">{t('invoice.scanAgain')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const STATUS_ICON: Record<ComplianceStatus, AppIconName> = {
  compliant: 'checkmark-circle',
  warning: 'alert-circle',
  invalid: 'close-circle',
};

function InvoiceNotice({
  icon,
  tone,
  title,
  message,
}: {
  icon: AppIconName;
  tone: ComplianceStatus | 'note';
  title: string;
  message: string;
}) {
  const { colors } = useTheme();
  const tint =
    tone === 'compliant'
      ? colors.online
      : tone === 'warning'
        ? colors.accentMuted
        : tone === 'invalid'
          ? colors.danger
          : colors.primary;

  return (
    <View className="flex-row items-center gap-2.5 rounded-2xl bg-surface px-3.5 py-2">
      <AppIcon name={icon} size={22} color={tint} />
      <View className="flex-1">
        <Text className="text-xs text-subtle">{title}</Text>
        <Text className="mt-0.5 text-[15px] font-semibold" style={{ color: tint }}>
          {message}
        </Text>
      </View>
    </View>
  );
}
