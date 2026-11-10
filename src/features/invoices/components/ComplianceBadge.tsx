import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AppIcon, type AppIconName } from '@/shared/components/AppIcon';
import { Text } from '@/shared/components/ui/Text';
import { cn } from '@/shared/lib/cn';
import type { ComplianceStatus } from '@/shared/lib/zatca';
import { useTheme } from '@/shared/theme';

const STYLES: Record<ComplianceStatus, string> = {
  compliant: 'bg-online/15',
  warning: 'bg-accent/20',
  invalid: 'bg-danger/15',
};

const TEXT: Record<ComplianceStatus, string> = {
  compliant: 'text-online',
  warning: 'text-accent-muted',
  invalid: 'text-danger',
};

const ICONS: Record<ComplianceStatus, AppIconName> = {
  compliant: 'checkmark-circle',
  warning: 'alert-circle',
  invalid: 'close-circle',
};

export function ComplianceBadge({
  status,
  large = false,
}: {
  status: ComplianceStatus;
  large?: boolean;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const color = {
    compliant: colors.online,
    warning: colors.accentMuted,
    invalid: colors.danger,
  }[status];

  return (
    <View
      className={cn(
        'flex-row items-center gap-1 self-start rounded-full px-2.5 py-1',
        STYLES[status],
        large && 'px-3 py-1.5',
      )}>
      <AppIcon name={ICONS[status]} size={large ? 14 : 12} color={color} />
      <Text className={cn('text-xs font-semibold', TEXT[status], large && 'text-sm')}>
        {t(`invoice.${status}`)}
      </Text>
    </View>
  );
}
