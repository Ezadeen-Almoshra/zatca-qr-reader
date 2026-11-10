---
name: setup-new-app
description: >-
  Rename and configure a new app cloned from this Expo starter template. Use
  when bootstrapping a project from expo-starter-template or changing app
  identity (name, slug, bundle ids, API URL).
---

# Setup New App From Template

## Checklist

1. Copy `expo-starter-template` to the new project folder.
2. Update identity:
   - `package.json` → `name`
   - `app.json` → `name`, `slug`, `scheme`, iOS `bundleIdentifier`, Android `package`
3. Theme: adjust `src/shared/theme/tokens.ts` brand colors.
4. Locales: replace `auth.appName` and product copy in `en.ts` / `ar.ts`.
5. API: set `EXPO_PUBLIC_API_URL` or edit `config.ts`.
6. Auth: keep OTP sample or replace with your auth flow; remove `TEST_USERS` / `FIXED_OTP` for production.
7. Install & hooks:
   ```bash
   pnpm install
   pnpm prepare
   ```
8. Verify:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm start
   ```

## Optional removals

- Replace Home tab with the first real feature using the `add-feature` skill.
