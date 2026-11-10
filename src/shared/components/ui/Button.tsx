import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';
import { cn } from '@/shared/lib/cn';
import { useTheme } from '@/shared/theme';
import { Text } from './Text';

const buttonVariants = cva('items-center justify-center rounded-lg active:opacity-80', {
  variants: {
    variant: {
      primary: 'bg-accent',
      ghost: 'bg-transparent',
      danger: 'bg-surface',
    },
    size: {
      sm: 'px-6 py-2',
      md: 'px-6 py-3.5',
      lg: 'px-8 py-4',
    },
    disabled: {
      true: 'opacity-50',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
});

const buttonTextVariants = cva('font-semibold', {
  variants: {
    variant: {
      primary: 'text-inverse',
      ghost: 'text-subtle',
      danger: 'text-danger',
    },
    size: {
      sm: 'text-[15px]',
      md: 'text-base',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

type ButtonProps = Omit<PressableProps, 'children' | 'disabled'> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    className?: string;
    children: React.ReactNode;
  };

export function Button({
  variant,
  size,
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = Boolean(disabled || loading);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size, disabled: isDisabled }), className)}
      {...props}>
      {loading ? (
        <ActivityIndicator color={variant === 'danger' ? colors.danger : colors.inverse} />
      ) : typeof children === 'string' ? (
        <Text className={buttonTextVariants({ variant, size })}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
