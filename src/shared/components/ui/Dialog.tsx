import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from 'react-native';
import { AppIcon, type AppIconName } from '@/shared/components/AppIcon';
import { Text } from '@/shared/components/ui/Text';
import { useLocale } from '@/shared/i18n';
import { cn } from '@/shared/lib/cn';
import { useTheme } from '@/shared/theme';

export type DialogTone = 'default' | 'danger' | 'success';

type DialogOptions = {
  title: string;
  message?: string;
  tone?: DialogTone;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
};

type ActiveDialog = Required<Pick<DialogOptions, 'title'>> &
  Omit<DialogOptions, 'title' | 'tone'> & {
    tone: DialogTone;
    mode: 'alert' | 'confirm';
    resolve: (confirmed: boolean) => void;
  };

type DialogContextValue = {
  alert: (options: DialogOptions) => Promise<void>;
  confirm: (options: DialogOptions) => Promise<boolean>;
};

const DialogContext = createContext<DialogContextValue | null>(null);

const TONE_ICON: Record<DialogTone, AppIconName> = {
  default: 'information-circle',
  danger: 'warning',
  success: 'checkmark-circle',
};

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { isRTL } = useLocale();
  const { colors } = useTheme();
  const [dialog, setDialog] = useState<ActiveDialog | null>(null);
  const [pending, setPending] = useState(false);
  const dialogRef = useRef<ActiveDialog | null>(null);

  const open = useCallback((next: ActiveDialog) => {
    dialogRef.current?.resolve(false);
    dialogRef.current = next;
    setPending(false);
    setDialog(next);
  }, []);

  const finish = useCallback((confirmed: boolean) => {
    const current = dialogRef.current;
    dialogRef.current = null;
    setDialog(null);
    setPending(false);
    current?.resolve(confirmed);
  }, []);

  const alert = useCallback(
    (options: DialogOptions) =>
      new Promise<void>((resolve) => {
        open({
          ...options,
          tone: options.tone ?? 'default',
          mode: 'alert',
          resolve: () => resolve(),
        });
      }),
    [open],
  );

  const confirm = useCallback(
    (options: DialogOptions) =>
      new Promise<boolean>((resolve) => {
        open({
          ...options,
          tone: options.tone ?? 'default',
          mode: 'confirm',
          resolve,
        });
      }),
    [open],
  );

  const handleConfirm = async () => {
    if (!dialog || pending) return;
    setPending(true);
    try {
      await dialog.onConfirm?.();
      finish(true);
    } catch {
      setPending(false);
    }
  };

  const toneColor =
    dialog?.tone === 'danger'
      ? colors.danger
      : dialog?.tone === 'success'
        ? colors.accent
        : colors.primary;

  return (
    <DialogContext.Provider value={{ alert, confirm }}>
      {children}
      <Modal
        visible={dialog !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (!pending) finish(false);
        }}>
        <View className="flex-1" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
          <View className="flex-1 items-center justify-center px-6">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.cancel')}
              disabled={pending}
              onPress={() => finish(false)}
              style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(17, 27, 33, 0.55)' }]}
            />
            {dialog ? (
              <View
                accessibilityRole="alert"
                className="w-full max-w-[340px] rounded-[22px] px-5 pb-4 pt-5"
                style={{
                  backgroundColor: colors.surface,
                  shadowColor: '#000',
                  shadowOpacity: 0.2,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: 12 },
                  elevation: 12,
                }}>
                <View
                  className="mb-3 h-12 w-12 items-center justify-center self-center rounded-full"
                  style={{ backgroundColor: `${toneColor}1A` }}>
                  <AppIcon name={TONE_ICON[dialog.tone]} size={24} color={toneColor} />
                </View>
                <Text
                  className="text-center text-xl font-semibold"
                  style={{ color: colors.foreground }}>
                  {dialog.title}
                </Text>
                {dialog.message ? (
                  <Text
                    className="mt-2 text-center text-[15px] leading-6"
                    style={{ color: colors.subtle }}>
                    {dialog.message}
                  </Text>
                ) : null}
                <View
                  className={cn('mt-4 flex-row gap-2.5', dialog.mode === 'alert' && 'flex-col')}>
                  {dialog.mode === 'confirm' ? (
                    <Pressable
                      accessibilityRole="button"
                      disabled={pending}
                      onPress={() => finish(false)}
                      className="h-12 flex-1 items-center justify-center rounded-xl active:opacity-70"
                      style={{ backgroundColor: colors.muted }}>
                      <Text
                        className="text-[15px] font-semibold"
                        style={{ color: colors.foreground }}>
                        {dialog.cancelLabel ?? t('common.cancel')}
                      </Text>
                    </Pressable>
                  ) : null}
                  <Pressable
                    accessibilityRole="button"
                    disabled={pending}
                    onPress={handleConfirm}
                    className={cn(
                      'h-12 items-center justify-center rounded-xl active:opacity-80',
                      dialog.mode === 'confirm' ? 'flex-1' : 'w-full',
                      pending && 'opacity-70',
                    )}
                    style={{ backgroundColor: toneColor }}>
                    {pending ? (
                      <ActivityIndicator color={colors.inverse} />
                    ) : (
                      <Text className="text-[15px] font-semibold" style={{ color: colors.inverse }}>
                        {dialog.confirmLabel ?? t('common.ok')}
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }
  return context;
}
