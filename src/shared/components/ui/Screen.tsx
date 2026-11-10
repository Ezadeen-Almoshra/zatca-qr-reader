import React from 'react';
import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/shared/lib/cn';

type ScreenProps = ViewProps & {
  children: React.ReactNode;
  padded?: boolean;
};

export function Screen({ children, padded = false, className, style, ...props }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={cn('flex-1 bg-background', className)}
      style={[{ paddingTop: insets.top }, style]}
      {...props}>
      {padded ? <View className="flex-1 px-6">{children}</View> : children}
    </View>
  );
}
