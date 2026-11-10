# Expo Starter — Agent Notes

- Stack: **Expo SDK 58**, React Native 0.88, Expo Router, NativeWind 4, TypeScript.
- Package manager: **pnpm** (`pnpm-lock.yaml`). Do not add `package-lock.json`.
- Always check versioned docs: https://docs.expo.dev/versions/v58.0.0/
- Source lives under `src/` with path alias `@/*`.
- Feature-first layout: `src/features/<domain>` + thin routes in `src/app`.
- Shared kernel: `src/shared/{components,theme,i18n,services,lib,constants}`.
- i18n: EN + AR with RTL support — keep locale keys typed via `locales/en.ts`.
- Styling: NativeWind classNames + semantic CSS variables from theme tokens.
- Do not invent APIs; wire to the existing `api` helper.
