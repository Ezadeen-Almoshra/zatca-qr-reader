import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { AppIcon } from '@/shared/components/AppIcon';
import { Text } from '@/shared/components/ui/Text';
import { SUPPORTED_LANGUAGES, useLocale, type AppLanguage } from '@/shared/i18n';
import { cn } from '@/shared/lib/cn';
import { useTheme } from '@/shared/theme';

const LABELS: Record<AppLanguage, 'settings.english' | 'settings.arabic'> = {
  en: 'settings.english',
  ar: 'settings.arabic',
};

interface LanguageToggleProps {
  variant?: 'card' | 'inline';
}

export function LanguageToggle({ variant = 'card' }: LanguageToggleProps) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLocale();
  const { colors } = useTheme();

  const control = (
    <View className="flex-row gap-2 rounded-lg bg-muted p-1">
      {SUPPORTED_LANGUAGES.map((option) => {
        const selected = language === option;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => setLanguage(option)}
            className={cn(
              'flex-1 items-center rounded-md py-2',
              selected ? 'bg-surface' : 'bg-transparent',
            )}>
            <Text
              className={cn(
                'text-[15px] font-medium',
                selected ? 'text-foreground' : 'text-subtle',
              )}>
              {t(LABELS[option])}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (variant === 'inline') {
    return control;
  }

  return (
    <View className="mx-4 mb-3 rounded-lg bg-surface p-3.5">
      <View className="mb-2 flex-row items-center gap-2">
        <AppIcon name="language-outline" size={16} color={colors.subtle} />
        <Text className="text-xs font-semibold uppercase tracking-wide text-subtle">
          {t('settings.language')}
        </Text>
      </View>
      {control}
    </View>
  );
}
