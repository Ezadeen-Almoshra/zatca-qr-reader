import React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui/Text';
import { cn } from '@/shared/lib/cn';
import { brand } from '@/shared/theme/tokens';

type BrandMarkProps = {
  size?: number;
  showWordmark?: boolean;
  light?: boolean;
  className?: string;
};

function Corner({ position }: { position: 'tl' | 'tr' | 'bl' }) {
  const map = {
    tl: 'top-3 left-3',
    tr: 'top-3 right-3',
    bl: 'bottom-3 left-3',
  } as const;

  return <View className={cn('absolute h-5 w-5 border-2 border-accent', map[position])} />;
}

export function BrandMark({
  size = 88,
  showWordmark = false,
  light = false,
  className,
}: BrandMarkProps) {
  return (
    <View className={cn('items-center', className)}>
      <View
        className="items-center justify-center border-[3px] border-accent"
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: brand.teal,
        }}>
        <View
          className="relative items-center justify-center"
          style={{ width: size * 0.62, height: size * 0.62 }}>
          <Corner position="tl" />
          <Corner position="tr" />
          <Corner position="bl" />
          <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-accent">
            <Text className="text-lg font-bold text-inverse">✓</Text>
          </View>
        </View>
      </View>
      {showWordmark ? (
        <View className="mt-2 items-center">
          <Text
            className={cn(
              'text-[34px] font-bold tracking-wide',
              light ? 'text-inverse' : 'text-primary',
            )}>
            {brand.nameAr}
          </Text>
          <Text className="mt-1 text-xs font-semibold uppercase tracking-[3px] text-accent">
            {brand.name}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
