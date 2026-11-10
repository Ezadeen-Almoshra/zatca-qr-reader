---
name: add-feature
description: >-
  Scaffold a new Expo Router feature folder with screens, schemas, barrel
  export, and thin route files. Use when adding a domain feature, new tab,
  or new screen to this starter.
---

# Add Feature

## Steps

1. Create `src/features/<name>/` with:
   - `screens/<Name>Screen.tsx`
   - `schemas.ts` when the feature needs validation
   - `index.ts` barrel exporting public API
   - optional `components/` for feature-only UI
2. Add thin route(s) under `src/app/` that re-export the screen.
3. Register the screen in the nearest `_layout.tsx` (Stack/Tabs) if needed.
4. Add EN + AR strings under a new locale namespace matching the feature.
5. Reuse shared UI (`Screen`, `Header`, `Button`, `Input`, `Dialog`).
6. Keep API calls in the feature or via `@/shared/services/api` — no inline fetch sprawl.

## Route re-export pattern

```tsx
export { HomeScreen as default } from '@/features/home';
```

## Checklist

- [ ] Feature folder + barrel
- [ ] Thin `src/app` route
- [ ] Layout registration
- [ ] i18n keys EN/AR
- [ ] Validation stays next to the feature that needs it
