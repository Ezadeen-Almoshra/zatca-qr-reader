import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppIcon } from '@/shared/components/AppIcon';
import { Text } from '@/shared/components/ui/Text';
import { useTheme } from '@/shared/theme';

const PAPER = {
  sheet: '#FFFCF7',
  ink: '#14221F',
  muted: '#5C6B67',
  line: '#E4D9C8',
  band: '#0B3D3A',
  gold: '#C9A227',
} as const;

type InvoiceRow = {
  label: string;
  value: string;
};

export function InvoiceSheet({
  kind,
  seller,
  rows,
  amounts,
  hashLabel,
  hash,
}: {
  kind: string;
  seller: string;
  rows: InvoiceRow[];
  amounts: InvoiceRow[];
  hashLabel?: string;
  hash?: string;
}) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInDown.duration(560).springify().damping(18)}>
      <View
        className="overflow-hidden"
        style={{
          backgroundColor: PAPER.sheet,
          borderRadius: 6,
          shadowColor: '#071A19',
          shadowOpacity: 0.14,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 5,
        }}>
        <Perforation color={colors.muted} edge="top" />
        <View className="items-center px-5 pb-1 pt-2">
          <View
            className="mb-2 h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: '#F6F1E8' }}>
            <AppIcon name="receipt-outline" size={20} color={PAPER.band} />
          </View>
          <Text
            className="text-center text-[11px] font-semibold tracking-widest"
            style={{ color: PAPER.band }}>
            {kind}
          </Text>
          <Text
            className="mt-1 text-center text-[22px] font-bold leading-7"
            style={{ color: PAPER.ink }}>
            {seller}
          </Text>
          <View className="mt-2 h-0.5 w-16 rounded-full" style={{ backgroundColor: PAPER.gold }} />
        </View>

        <View className="mt-1">
          {rows.map((row) => (
            <FieldRow key={row.label} label={row.label} value={row.value} />
          ))}
        </View>

        <View className="mx-5 mb-3 mt-2">
          {amounts.map((row, index) => {
            const isTotal = index === amounts.length - 1;
            return (
              <View key={row.label}>
                {isTotal ? <DoubleRule /> : null}
                <View className="flex-row items-center justify-between gap-4 py-1.5">
                  <Text
                    className={isTotal ? 'text-[15px] font-bold' : 'text-[13px]'}
                    style={{ color: isTotal ? PAPER.ink : PAPER.muted }}>
                    {row.label}
                  </Text>
                  <Text
                    className={
                      isTotal
                        ? 'text-[18px] font-bold tracking-wide'
                        : 'text-[15px] font-semibold tracking-wide'
                    }
                    style={{ color: PAPER.ink }}>
                    {`\u2066${row.value}\u2069`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {hash ? (
          <View className="px-5 pb-2">
            {hashLabel ? (
              <Text className="text-center text-[11px]" style={{ color: PAPER.muted }}>
                {hashLabel}
              </Text>
            ) : null}
            <Text
              selectable
              className="mt-1 text-center text-[11px] leading-5"
              style={{ color: PAPER.ink }}>
              {`\u2066${hash}\u2069`}
            </Text>
          </View>
        ) : null}
        <Perforation color={colors.muted} edge="bottom" />
      </View>
    </Animated.View>
  );
}

function FieldRow({ label, value }: InvoiceRow) {
  return (
    <View
      className="flex-row items-center justify-between gap-3 px-5 py-2"
      style={{ borderTopWidth: 1, borderStyle: 'dashed', borderColor: PAPER.line }}>
      <Text className="text-[13px]" style={{ color: PAPER.muted }}>
        {label}
      </Text>
      <Text
        className="flex-1 text-end text-[15px] font-semibold tracking-wide"
        style={{ color: PAPER.ink }}>
        {`\u2066${value}\u2069`}
      </Text>
    </View>
  );
}

function DoubleRule() {
  return (
    <View className="mb-1 mt-0.5">
      <View style={{ height: 1, backgroundColor: PAPER.ink }} />
      <View style={{ height: 1, backgroundColor: PAPER.ink, marginTop: 2 }} />
    </View>
  );
}

function Perforation({ color, edge }: { color: string; edge: 'top' | 'bottom' }) {
  return (
    <View
      pointerEvents="none"
      className="flex-row justify-between overflow-hidden"
      style={{ height: 10 }}>
      {Array.from({ length: 16 }, (_, index) => (
        <View
          key={index}
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: color,
            marginTop: edge === 'top' ? -8 : 2,
          }}
        />
      ))}
    </View>
  );
}
