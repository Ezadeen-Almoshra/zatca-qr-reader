import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@/shared/components/AppIcon';
import { Text } from '@/shared/components/ui/Text';
import { useLocale } from '@/shared/i18n';
import { useTheme } from '@/shared/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function Header({ title, subtitle, onBack, rightAction }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { isRTL } = useLocale();
  const { colors } = useTheme();

  return (
    <View className="bg-header" style={{ paddingTop: insets.top }}>
      <StatusBar style="light" />
      <View className="min-h-12 flex-row items-center px-2 py-2">
        {onBack && (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
            className="me-1 p-2">
            <AppIcon
              name={isRTL ? 'chevron-forward' : 'chevron-back'}
              size={26}
              color={colors.inverse}
            />
          </Pressable>
        )}
        <View className="flex-1">
          <Text className="text-lg font-semibold text-inverse" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-px text-[13px] text-inverse opacity-70" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {rightAction ? <View className="ms-2">{rightAction}</View> : null}
      </View>
    </View>
  );
}
