import React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '@/shared/lib/cn';
import { useTheme } from '@/shared/theme';
import { fonts } from '@/shared/theme/fonts';

export type InputProps = TextInputProps & {
  error?: boolean;
};

export function Input({ className, error, ...props }: InputProps) {
  const { colors } = useTheme();

  return (
    <TextInput
      placeholderTextColor={colors.subtle}
      style={{ fontFamily: fonts.regular }}
      className={cn(
        'rounded-lg border bg-input px-4 py-3 text-base text-foreground',
        error ? 'border-danger' : 'border-line',
        className,
      )}
      {...props}
    />
  );
}
