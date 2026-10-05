# Landing iPhone app

Expo (SDK 57) with Expo Router. Start it with `pnpm dev:mobile` from the repo root.

- `src/app/(tabs)/`: Today, Plan, Progress and Coach. Today is ported from the designs; the other tabs list the
  screens still to port.
- `src/components/`: AppText, Button, Card, Chip, HabitCheck, Icon, Screen and the tab bar, ported from the design
  system's reference components
- `src/theme/`: the palette for light and dark, and text styles, from `@landing/design-system/tokens`
- `app.json` and `eas.json`: app config and build profiles. Change the bundle identifier before your first build.

Port screens from `apps/prototype` (behaviour and copy) and `designs/app-screens` (pixels).
Builds and store submission: [docs/deployment.md](../../docs/deployment.md).
