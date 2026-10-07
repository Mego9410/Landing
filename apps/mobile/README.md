# Steadie iPhone app

Expo (SDK 57) with Expo Router, ported from the clickable prototype (`apps/prototype`). It runs on the phone's real
date. A new install starts at the health information, then onboarding, with nothing logged.

**Demo mode:** hold the picture on the welcome screen for three seconds to open Hannah, six weeks after her last
injection, with a month of history. Settings then shows preview controls (change the week, reset, leave the demo).
Use it for previews and give App Review the same instructions.

## What's in it

- **First screen:** health and safety information with two required ticks (general guidance, not medical advice;
  18 or over), saved with a wording version. Links to the terms and privacy policy.
- **Onboarding:** six steps: where you are (and your name), a health check, food and hunger, how you eat, your
  kitchen, your plan. The health check (`src/data/health.ts`, `src/state/health.ts`) follows the movement plan §4.2:
  GP answers pause strength sessions, pregnancy and kidney disease need a tick to carry on and switch the meal
  engine's filters on, and gentler-track answers start sessions on the easier versions. It's asked again every 12
  weeks. The same step asks for consent to keep health information on the phone, and optionally weights.
- **Today:** a hero with a ring for the day's to-dos and the next thing to do, the meal plan and strength plan
  tiles with shortcuts, then today's checklist (check-in, protein, session, habits) and a tip.
- **Plan:** this week's lesson (one for each of the 52 weeks, `src/data/lessons.ts`), meals this week and next, and
  the three phases. Habits rotate every few weeks (`habitsForWeek` in `src/data/content.ts`).
- **Meals:** this week's plan by day; recipes with swaps, portions, method and allergens; the recipe library; swap
  or pick any meal; planning next week; shopping lists; food preferences. The planning is `@landing/engine`.
- **Workouts:** sessions with three levels (`src/data/sessions.ts`): more reps from week 5, an extra set from week
  13, nudged by "Too easy" or "Tough" after each session. In Settle, an optional third session.
- **Your day:** the morning check-in on yesterday and "what shapes your days" (a pattern shows after seven days
  with and seven without). Steps answer themselves from Apple Health when it's connected.
- **Progress:** the steady score (worked out from the logs, `src/state/score.ts`), habit days and sessions, the
  7-day trend and steady zone, recent weigh-ins, and the prescriber pack (a one-page PDF, `src/state/prescriber.ts`).
  Safe mode hides weight.
- **Coach:** scripted replies, with the prescriber redirect and the summary for any medication question.
- **Settings:** reminders (local notifications), Apple Health, units (kg or stones and pounds), safe mode, the
  health check, export my data, delete everything, the privacy policy and terms.
- **Subscriptions:** Apple in-app purchase through RevenueCat (`src/state/subscription.ts`, `src/app/paywall.tsx`),
  off until `EXPO_PUBLIC_REVENUECAT_IOS_KEY` is set.

State lives in `src/state` and is saved on the phone with AsyncStorage: one log per date (`days`), so weekly totals
come from the logs, and `src/state/rollover.ts` moves things on at midnight and on Mondays. Signing in (optional;
Apple or an emailed code) backs the whole state up to the website's `/api/sync` (`src/state/account.ts`, rules in
`src/state/merge.ts`); `EXPO_PUBLIC_API_URL` says where the server is, and sign-in is hidden without it. Screens are in `src/app`, shared pieces in `src/components`. `pnpm --filter @landing/mobile test` runs the
logic tests in `src/test`.

## What needs a development build

Apple Health (`@kingstinct/react-native-healthkit`) isn't in Expo Go. The app checks before loading it, so Expo Go
and the web keep working without it; Settings says it "works in the App Store version". Reminders, the share sheet,
the PDF and RevenueCat's preview mode all work in Expo Go.

## Run it

- `pnpm dev:mobile` from the repo root, then open it in Expo Go or a development build.
- `pnpm --filter @landing/mobile web:phone` makes `dist/steadie-app.html`, one self-contained page you can open on a
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
