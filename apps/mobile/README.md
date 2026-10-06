# Landing iPhone app

Expo (SDK 57) with Expo Router, ported from the clickable prototype (`apps/prototype`). It opens as Hannah, six weeks
after her last injection, on a fixed "today" of Monday 5 October 2026, so the demo data lines up. Settings has demo
controls: change the week, switch to evening, start onboarding again, or reset.

## What's in it

- **Today:** protein so far with a quick log, the week's habits (tick or swap one), today's strength session,
  tonight's dinner and a tip.
- **Plan:** this week, meals this week, next week, and the three phases; the week detail and lesson.
- **Meals:** this week's plan by day; recipes with swaps, portions, method and allergens; the recipe library with
  filters; swap or pick any meal; planning next week meal by meal; shopping lists that add each ingredient up
  across dishes; food preferences. The planning is `@landing/engine`, the same code the prototype runs. Every recipe
  is a draft until the dietitian signs it off, and the app says so.
- **Workouts:** sessions, an overview with each move's loop, a set-by-set session with an easier version, and done.
  The loops are `@landing/motion`, shown by the cast member chosen in Settings, or mixed.
- **Progress:** the landing score, habit days and sessions, the 7-day weight trend with the steady zone, and recent
  weigh-ins. Safe mode hides weight.
- **Coach:** scripted replies, with the prescriber redirect for any medication question.
- **Onboarding:** five steps (where you are, food and hunger with a goal, how you eat, your kitchen, your plan).

State lives in `src/state` and is saved on the phone with AsyncStorage. Screens are in `src/app`, shared pieces in
`src/components`.

## Run it

- `pnpm dev:mobile` from the repo root, then open it in Expo Go or a development build.
- `pnpm --filter @landing/mobile web:phone` makes `dist/landing-app.html`, one self-contained page you can open on a
  phone's browser. Handy for a quick look without Expo.

## Expo

The project is linked to EAS (project ID in `app.json`). Updates use the SDK version as the runtime version, so they
open in Expo Go.

- **Preview on your phone in Expo Go:** `.eas/workflows/preview-update.yml` publishes an update to the `preview`
  branch on every push to `main` or the working branch, through Expo's GitHub link. In Expo's project settings, set
  the GitHub base directory to `apps/mobile`. Then open expo.dev → the project → Updates → `preview` and scan the
  QR code with Expo Go. By hand: `pnpm --filter @landing/mobile update:preview` (needs `eas login`).
- **Development build:** `expo-dev-client` is installed and `eas.json` has a `development` profile.
  `eas build --profile development --platform ios` (or `android`) after `eas login`. For the iOS Simulator, set
  `"ios": { "simulator": true }` on that profile first.
- **Store builds:** see [docs/deployment.md](../../docs/deployment.md).
