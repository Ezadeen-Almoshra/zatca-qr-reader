import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Pressable, View } from 'react-native';
import { AppIcon } from '@/shared/components/AppIcon';
import { Text } from '@/shared/components/ui/Text';
import { useLocale } from '@/shared/i18n';
import { toIsoDate } from '@/shared/lib/money';
import { useTheme } from '@/shared/theme';
import type { DateRange } from '../types';

type DateRangeSheetProps = {
  visible: boolean;
  value: DateRange;
  onClose: () => void;
  onApply: (range: DateRange) => void;
};

type ActiveField = 'from' | 'to';

function presetRange(kind: 'all' | 'today' | 'week' | 'month'): DateRange {
  const now = new Date();
  if (kind === 'all') return { from: null, to: null };
  if (kind === 'today') return { from: toIsoDate(now), to: toIsoDate(now) };
  if (kind === 'week') {
    const from = new Date(now);
    from.setDate(now.getDate() - 6);
    return { from: toIsoDate(from), to: toIsoDate(now) };
  }
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  return { from: toIsoDate(from), to: toIsoDate(now) };
}

function isoToDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return new Date();
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function displayDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function DateRangeSheet({ visible, value, onClose, onApply }: DateRangeSheetProps) {
  if (!visible) return null;
  return (
    <DateRangeForm
      key={`${value.from ?? ''}|${value.to ?? ''}`}
      value={value}
      onClose={onClose}
      onApply={onApply}
    />
  );
}

function DateRangeForm({ value, onClose, onApply }: Omit<DateRangeSheetProps, 'visible'>) {
  const { t } = useTranslation();
  const { language } = useLocale();
  const { colors, isDark } = useTheme();
  const [from, setFrom] = useState(value.from ?? '');
  const [to, setTo] = useState(value.to ?? '');
  const [active, setActive] = useState<ActiveField | null>(null);

  const applyPreset = (kind: 'all' | 'today' | 'week' | 'month') => {
    const next = presetRange(kind);
    setFrom(next.from ?? '');
    setTo(next.to ?? '');
    onApply(next);
    onClose();
  };

  const selectDate = (field: ActiveField, selected: Date) => {
    const next = toIsoDate(selected);
    if (field === 'from') setFrom(next);
    else setTo(next);
  };

  const onAndroidChange = (event: DateTimePickerEvent, selected?: Date) => {
    const field = active;
    setActive(null);
    if (event.type === 'set' && selected && field) selectDate(field, selected);
  };

  return (
    <>
      <Modal visible transparent animationType="fade" onRequestClose={onClose}>
        <View className="flex-1 items-center justify-center px-6">
          <Pressable className="absolute inset-0 bg-black/45" onPress={onClose} />
          <View className="w-full max-w-[360px] rounded-[22px] bg-surface px-4 py-4">
            <Text className="mb-3 text-center text-xl font-semibold text-foreground">
              {t('history.filter')}
            </Text>
            <View className="mb-3 flex-row flex-wrap gap-2">
              {(['all', 'today', 'week', 'month'] as const).map((kind) => (
                <Pressable
                  key={kind}
                  onPress={() => applyPreset(kind)}
                  className="rounded-full bg-muted px-3 py-1.5">
                  <Text className="text-sm font-medium text-primary">{t(`common.${kind}`)}</Text>
                </Pressable>
              ))}
            </View>
            <DateField
              label={t('common.from')}
              value={from}
              placeholder={t('common.pickDate')}
              active={active === 'from'}
              locale={language}
              isDark={isDark}
              accent={colors.primary}
              textColor={colors.foreground}
              iconColor={colors.primary}
              maximumDate={to ? isoToDate(to) : undefined}
              onPress={() => setActive((current) => (current === 'from' ? null : 'from'))}
              onChange={(selected) => selectDate('from', selected)}
            />
            <DateField
              label={t('common.to')}
              value={to}
              placeholder={t('common.pickDate')}
              active={active === 'to'}
              locale={language}
              isDark={isDark}
              accent={colors.primary}
              textColor={colors.foreground}
              iconColor={colors.primary}
              minimumDate={from ? isoToDate(from) : undefined}
              onPress={() => setActive((current) => (current === 'to' ? null : 'to'))}
              onChange={(selected) => selectDate('to', selected)}
            />
            <View className="mt-2 flex-row gap-3">
              <Pressable
                className="h-12 flex-1 items-center justify-center rounded-xl bg-muted"
                onPress={() => {
                  setFrom('');
                  setTo('');
                  onApply({ from: null, to: null });
                  onClose();
                }}>
                <Text className="font-semibold text-foreground">{t('common.reset')}</Text>
              </Pressable>
              <Pressable
                className="h-12 flex-1 items-center justify-center rounded-xl bg-primary"
                onPress={() => {
                  onApply({ from: from || null, to: to || null });
                  onClose();
                }}>
                <Text className="font-semibold text-inverse">{t('common.apply')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {Platform.OS === 'android' && active ? (
        <DateTimePicker
          value={isoToDate(active === 'from' ? from : to)}
          mode="date"
          display="calendar"
          firstDayOfWeek={language === 'ar' ? 6 : 0}
          maximumDate={active === 'from' && to ? isoToDate(to) : undefined}
          minimumDate={active === 'to' && from ? isoToDate(from) : undefined}
          onChange={onAndroidChange}
          onDismiss={() => setActive(null)}
        />
      ) : null}
    </>
  );
}

function DateField({
  label,
  value,
  placeholder,
  active,
  locale,
  isDark,
  accent,
  textColor,
  iconColor,
  minimumDate,
  maximumDate,
  onPress,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  active: boolean;
  locale: string;
  isDark: boolean;
  accent: string;
  textColor: string;
  iconColor: string;
  minimumDate?: Date;
  maximumDate?: Date;
  onPress: () => void;
  onChange: (date: Date) => void;
}) {
  return (
    <View className="mb-3">
      <Text className="mb-2 text-sm text-subtle">{label}</Text>
      {Platform.OS === 'web' ? (
        <WebDateInput value={value} textColor={textColor} onChange={onChange} />
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          className="flex-row items-center justify-between rounded-lg border border-line bg-input px-4 py-3">
          <Text className={value ? 'text-base text-foreground' : 'text-base text-subtle'}>
            {value ? displayDate(value) : placeholder}
          </Text>
          <AppIcon name="calendar-outline" size={18} color={iconColor} />
        </Pressable>
      )}
      {Platform.OS === 'ios' && active ? (
        <DateTimePicker
          value={isoToDate(value)}
          mode="date"
          display="inline"
          locale={locale}
          themeVariant={isDark ? 'dark' : 'light'}
          accentColor={accent}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onValueChange={(_event, selected) => onChange(selected)}
        />
      ) : null}
    </View>
  );
}

function WebDateInput({
  value,
  textColor,
  onChange,
}: {
  value: string;
  textColor: string;
  onChange: (date: Date) => void;
}) {
  return (
    <View className="justify-center rounded-lg border border-line bg-input px-4 py-3">
      {React.createElement('input', {
        type: 'date',
        value,
        onChange: (event: { currentTarget: { value: string } }) => {
          if (event.currentTarget.value) onChange(isoToDate(event.currentTarget.value));
        },
        style: {
          width: '100%',
          border: 'none',
          background: 'transparent',
          color: textColor,
          fontSize: 16,
        },
      })}
    </View>
  );
}
