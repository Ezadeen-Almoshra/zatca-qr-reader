import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { AppIcon } from '@/shared/components/AppIcon';
import { Text } from '@/shared/components/ui/Text';
import { cn } from '@/shared/lib/cn';
import { useTheme } from '@/shared/theme';
import type { ThemePreference } from '@/shared/theme';

const OPTIONS: {
  value: ThemePreference;
  labelKey: 'settings.themeSystem' | 'settings.themeLight' | 'settings.themeDark';
}[] = [
  { value: 'system', labelKey: 'settings.themeSystem' },
  { value: 'light', labelKey: 'settings.themeLight' },
  { value: 'dark', labelKey: 'settings.themeDark' },
];

export function ThemeToggle() {
  const { preference, setPreference, colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="mx-4 mb-3 rounded-lg bg-surface p-3.5">
      <View className="mb-2 flex-row items-center gap-2">
        <AppIcon name="color-palette-outline" size={16} color={colors.subtle} />
        <Text className="text-xs font-semibold uppercase tracking-wide text-subtle">
          {t('settings.appearance')}
        </Text>
      </View>
      <View className="flex-row gap-2 rounded-lg bg-muted p-1">
        {OPTIONS.map((option) => {
          const selected = preference === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setPreference(option.value)}
              className={cn(
                'flex-1 items-center rounded-md py-2',
                selected ? 'bg-surface' : 'bg-transparent',
              )}>
              <Text
                className={cn(
                  'text-[15px] font-medium',
                  selected ? 'text-foreground' : 'text-subtle',
                )}>
                {t(option.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
