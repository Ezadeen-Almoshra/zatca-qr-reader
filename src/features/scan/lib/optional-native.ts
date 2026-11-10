/* eslint-disable @typescript-eslint/no-require-imports */
import type { ComponentType } from 'react';

type BarcodeResult = { data?: string };

type CameraModule = {
  CameraView: ComponentType<{
    style?: object;
    facing?: 'back' | 'front';
    barcodeScannerSettings?: { barcodeTypes: string[] };
    onBarcodeScanned?: (result: BarcodeResult) => void;
  }>;
  useCameraPermissions: () => [{ granted?: boolean } | null, () => Promise<{ granted: boolean }>];
  scanFromURLAsync: (uri: string, types: string[]) => Promise<BarcodeResult[]>;
};

type ImagePickerModule = {
  launchImageLibraryAsync: (options: { mediaTypes: string[]; quality: number }) => Promise<{
    canceled: boolean;
    assets?: { uri?: string }[];
  }>;
};

type HapticsModule = {
  notificationAsync: (type: string) => Promise<void>;
  NotificationFeedbackType: { Success: string; Error: string };
};

function loadCamera(): CameraModule | null {
  try {
    // Optional native module — installed when the registry is reachable.
    return require('expo-camera') as CameraModule;
  } catch {
    return null;
  }
}

function loadImagePicker(): ImagePickerModule | null {
  try {
    return require('expo-image-picker') as ImagePickerModule;
  } catch {
    return null;
  }
}

function loadHaptics(): HapticsModule | null {
  try {
    return require('expo-haptics') as HapticsModule;
  } catch {
    return null;
  }
}

export const cameraModule = loadCamera();
export const imagePickerModule = loadImagePicker();
export const hapticsModule = loadHaptics();
