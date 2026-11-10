import React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui/Text';
import type { NamedTotal } from '../types';

const PALETTE = ['#0B3D3A', '#C9A227', '#C2410C', '#1A7A6D', '#8C6A3A', '#4C6B66'];

type DonutChartProps = {
  segments: NamedTotal[];
  centerLabel: string;
  centerValue: string;
  resolveLabel?: (item: NamedTotal) => string;
};

export function DonutChart({ segments, centerLabel, centerValue, resolveLabel }: DonutChartProps) {
  const total = segments.reduce((sum, item) => sum + item.total, 0);

  return (
    <View className="items-center">
      <View className="mb-3 w-full items-center rounded-3xl bg-muted px-4 py-4">
        <Text className="text-center text-xs text-subtle">{centerLabel}</Text>
        <Text className="mt-1 text-center text-xl font-bold text-primary">{centerValue}</Text>
        <View className="mt-3 h-2.5 w-full flex-row overflow-hidden rounded-full bg-background">
          {segments.map((item, index) => (
            <View
              key={item.key}
              className="h-full"
              style={{
                flex: Math.max(item.total, 0.01),
                backgroundColor: PALETTE[index % PALETTE.length],
              }}
            />
          ))}
        </View>
      </View>
      <View className="w-full gap-1.5">
        {segments.map((item, index) => {
          const share = total > 0 ? Math.round((item.total / total) * 100) : 0;
          return (
            <View key={item.key} className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                />
                <Text className="max-w-[180px] text-sm text-foreground" numberOfLines={1}>
                  {resolveLabel ? resolveLabel(item) : item.label}
                </Text>
              </View>
              <Text className="text-sm font-medium text-subtle">
                {item.count} · {share}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
