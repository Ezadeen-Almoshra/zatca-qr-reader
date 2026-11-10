import { useRouter, type Href } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInvoices } from '@/features/invoices';
import { AppIcon } from '@/shared/components/AppIcon';
import { BrandMark } from '@/shared/components/BrandMark';
import { LanguageToggle } from '@/shared/components/LanguageToggle';
import { Reveal } from '@/shared/components/motion/Reveal';
import { Button } from '@/shared/components/ui/Button';
import { useDialog } from '@/shared/components/ui/Dialog';
import { Input } from '@/shared/components/ui/Input';
import { Text } from '@/shared/components/ui/Text';
import { cn } from '@/shared/lib/cn';
import { useTheme } from '@/shared/theme';
import { brand } from '@/shared/theme/tokens';
import { cameraModule, hapticsModule, imagePickerModule } from '../lib/optional-native';

export function ScanScreen() {
  const { t } = useTranslation();
  const { alert } = useDialog();
  const { colors } = useTheme();
  const { addFromQr } = useInvoices();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState('');
  const lock = useRef(false);
  const permissionHook =
    cameraModule?.useCameraPermissions ?? (() => [null, async () => ({ granted: false })]);
  const [permission, requestPermission] = permissionHook();

  const handlePayload = async (value: string) => {
    if (lock.current || busy) return;
    lock.current = true;
    setBusy(true);
    try {
      const invoice = await addFromQr(value.trim());
      if (hapticsModule) {
        await hapticsModule.notificationAsync(
          invoice.status === 'invalid'
            ? hapticsModule.NotificationFeedbackType.Error
            : hapticsModule.NotificationFeedbackType.Success,
        );
      }
      setCameraOpen(false);
      setManual('');
      router.push(`/invoice/${invoice.id}` as Href);
    } catch {
      await alert({ title: t('common.error'), message: t('scan.invalid'), tone: 'danger' });
    } finally {
      setBusy(false);
      lock.current = false;
    }
  };

  const openCamera = async () => {
    if (!cameraModule) {
      await alert({ title: t('scan.permissionTitle'), message: t('scan.permissionBody') });
      return;
    }
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setCameraOpen(true);
  };

  const openGallery = async () => {
    if (!imagePickerModule || !cameraModule) {
      await alert({ title: t('common.error'), message: t('scan.galleryFailed'), tone: 'danger' });
      return;
    }
    const picked = await imagePickerModule.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (picked.canceled || !picked.assets?.[0]?.uri) return;
    try {
      const codes = await cameraModule.scanFromURLAsync(picked.assets[0].uri, ['qr']);
      const value = codes[0]?.data;
      if (!value) {
        await alert({ title: t('common.error'), message: t('scan.galleryFailed'), tone: 'danger' });
        return;
      }
      await handlePayload(value);
    } catch {
      await alert({ title: t('common.error'), message: t('scan.galleryFailed'), tone: 'danger' });
    }
  };

  if (cameraOpen && cameraModule && permission?.granted) {
    const CameraView = cameraModule.CameraView;
    return (
      <View className="flex-1 bg-header">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={(result) => {
            if (result.data) void handlePayload(result.data);
          }}
        />
        <View className="absolute inset-x-0 items-center" style={{ top: insets.top + 24 }}>
          <Text className="text-base font-semibold text-inverse">{t('scan.scanning')}</Text>
        </View>
        <View className="absolute inset-0 items-center justify-center">
          <ScanFrame />
        </View>
        <View className="absolute inset-x-6" style={{ bottom: insets.bottom + 24 }}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setCameraOpen(false)}
            className="flex-row items-center justify-center gap-2 rounded-full bg-white/15 py-3.5">
            <AppIcon name="close" size={18} color={colors.inverse} />
            <Text className="text-base font-semibold text-inverse">{t('common.close')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-5 py-2">
        <LanguageToggle variant="inline" />
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Reveal>
          <Text className="mb-4 text-center text-[26px] font-bold text-primary">
            {t('scan.title')}
          </Text>
        </Reveal>
        <Reveal delay={80}>
          <FloatingMark />
        </Reveal>
        <Reveal delay={140} className="mt-5 w-full">
          <Button className="w-full rounded-full" onPress={() => void openGallery()} loading={busy}>
            <View className="flex-row items-center gap-2">
              <AppIcon name="image-outline" size={18} color={colors.inverse} />
              <Text className="text-base font-semibold text-inverse">{t('scan.gallery')}</Text>
            </View>
          </Button>
        </Reveal>
        <View className="my-2.5 w-full flex-row items-center gap-3">
          <View className="h-px flex-1 bg-line" />
          <Text className="text-sm text-subtle">{t('scan.or')}</Text>
          <View className="h-px flex-1 bg-line" />
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={() => void openCamera()}
          className="w-full flex-row items-center justify-center gap-2 rounded-full border border-line bg-surface px-6 py-3.5">
          <AppIcon name="camera-outline" size={18} color={colors.primary} />
          <Text className="text-base font-semibold text-primary">{t('scan.camera')}</Text>
        </Pressable>
        <Input
          value={manual}
          onChangeText={setManual}
          placeholder="TLV / Base64"
          autoCapitalize="none"
          className="mt-3 w-full"
        />
        {manual.trim() ? (
          <Pressable className="mt-2" onPress={() => void handlePayload(manual)}>
            <Text className="text-sm font-semibold text-accent">{t('scan.paste')}</Text>
          </Pressable>
        ) : (
          <Text className="mt-2 text-center text-xs text-subtle">{t('scan.pasteHint')}</Text>
        )}
      </View>
    </View>
  );
}

function FloatingMark() {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(-8, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [offset]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <Animated.View style={style}>
      <BrandMark size={128} />
    </Animated.View>
  );
}

function ScanFrame() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [progress]);

  const lineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.12, 0.88, 1], [0.25, 1, 1, 0.25]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [-108, 108]) }],
  }));

  return (
    <View className="h-64 w-64">
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 18,
            right: 18,
            top: '50%',
            height: 2,
            backgroundColor: brand.gold,
            shadowColor: brand.gold,
            shadowOpacity: 0.9,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 0 },
          },
          lineStyle,
        ]}
      />
    </View>
  );
}

function Corner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const placement = {
    tl: 'left-0 top-0 border-l-4 border-t-4',
    tr: 'right-0 top-0 border-r-4 border-t-4',
    bl: 'bottom-0 left-0 border-b-4 border-l-4',
    br: 'bottom-0 right-0 border-b-4 border-r-4',
  }[position];

  return <View className={cn('absolute h-10 w-10 rounded-sm border-accent', placement)} />;
}
