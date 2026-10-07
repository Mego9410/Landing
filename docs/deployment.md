# Deploying Steadie

Two Vercel projects deploy from this one repository, and the iPhone app ships through Expo's build service (EAS).

| What | Where it lives | Hosted on | Root directory |
| --- | --- | --- | --- |
| Waitlist site | `apps/web` | Vercel (project `landing-web`) | `apps/web` |
| Clickable prototype | `apps/prototype` | Vercel (project `landing-prototype`) | `apps/prototype` |
| iPhone app | `apps/mobile` | EAS Build → TestFlight → App Store | n/a |

## 1. The waitlist site on Vercel

1. In Vercel, **Add New → Project** and import `Mego9410/Landing` from GitHub.
2. Set **Root Directory** to `apps/web` (click **Edit** next to Root Directory when importing). Vercel then detects
   Next.js. If you leave it at the repository root, the build stops with a message saying to change it. Leave **Include files outside the root directory in
   the Build Step** switched on, because the site imports `packages/design-system`.
3. `apps/web/vercel.json` already sets the install command (installs only the web app and what it uses, from the
   repo root), the build command and a skip rule so commits that don't touch the site don't rebuild it.
4. Under **Settings → Environment Variables** add:
   - `NEXT_PUBLIC_SITE_URL`: the production URL, for example `https://www.getsteadieapp.com`. Add it for Production; for
     Preview you can use the preview URL or leave it out.
5. Deploy. Every pull request gets a preview URL. Preview deployments are kept out of search engines automatically
   (`app/robots.ts`).
6. Under **Settings → Domains**, add your domain and follow Vercel's DNS steps.

### Accounts, backup and the waitlist

The site also runs the app's accounts and backup, and stores waitlist sign-ups, in Neon Postgres. Add the Neon
integration and the environment variables in [`docs/accounts.md`](accounts.md) before the first real deploy, and fill
in the bracketed details in `app/privacy/page.tsx`.

## Before going live

- [ ] In `apps/web/prelaunch.json`, set `showPrototype` to `false`. This removes the floating **Preview the app**
      button and stops the prototype being published at `/prototype`. Commit and redeploy.
- [ ] Add the Neon database, run the migrations and set the account variables (`docs/accounts.md`).
- [ ] Fill in the bracketed details on the privacy notice and in the footer.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the live domain.

## 2. The prototype on Vercel (optional)

While `apps/web/prelaunch.json` has `showPrototype: true`, the waitlist site already serves the prototype at
`/prototype`, behind a **Preview the app** button. A separate project is only needed if you want the prototype on
its own address, for example to keep it after launch behind Vercel's password protection.


1. **Add New → Project**, import the same repository again.
2. Set **Root Directory** to `apps/prototype` and **Framework Preset** to Other. `apps/prototype/vercel.json` sets the
   rest: no install, `node build.mjs`, output in `dist`.
3. Deploy. The prototype is marked `noindex`. To keep it private, turn on **Settings → Deployment Protection** (Vercel
   Authentication or a password).

## 3. The iPhone app with EAS

The Expo project is already created and linked (its ID is in `apps/mobile/app.json`), and connected to this GitHub
repository.

**See it on your phone (Expo Go):**

1. In expo.dev, open the project's **GitHub** settings and set the base directory to `apps/mobile`.
2. Push to `main` or the working branch. `apps/mobile/.eas/workflows/preview-update.yml` runs on Expo's servers and
   publishes an update to the `preview` branch.
3. Install **Expo Go** on your phone. In expo.dev open the project → **Updates** → `preview`, and scan the QR code.

Or by hand from your computer: `npm install -g eas-cli`, `eas login`, then `pnpm --filter @landing/mobile
update:preview`.

**Development build:** `expo-dev-client` is installed and `eas.json` has a `development` profile. Run
`eas build --profile development --platform ios` (or `android`); for the iOS Simulator, set `"ios": { "simulator":
true }` on that profile first. Then `pnpm dev:mobile` starts the development server.

**Store builds:**

1. The bundle ID is `com.getsteadieapp.app` (`ios.bundleIdentifier` in `apps/mobile/app.json`). It can't change
   after the first App Store build. Register it in the Apple Developer portal with Sign in with Apple and HealthKit.
   - Before the first store build, change `runtimeVersion` from `{ "policy": "sdkVersion" }` to
     `{ "policy": "appVersion" }`. The SDK policy is what lets updates open in Expo Go; store builds include native
     modules Expo Go doesn't have (Apple Health), so their updates must be tied to the app version instead.
   - Apple Health's permission text and the iOS privacy manifest are already in `app.json`.
   - To charge, create the subscription products in App Store Connect and RevenueCat (entitlement `plan`), then set
     `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (RevenueCat's public iOS key) in the EAS `production` environment. Without
     it there's no paywall, which suits a free TestFlight beta.
   - In App Store Connect, use `https://www.getsteadieapp.com/app-privacy` as the privacy policy URL and link
     `https://www.getsteadieapp.com/terms` in the description. Both pages are on the website, from the same text the app
     shows.
   - In the review notes, explain demo mode: hold the picture on the welcome screen for three seconds.
2. `pnpm --filter @landing/mobile build:preview` makes an internal build to install on your phone.
   `pnpm --filter @landing/mobile build:ios` makes a store build; `eas submit --platform ios` sends it to TestFlight
   (fill in the Apple IDs in `eas.json` first).

## Branches and checks

- `main` is production: merging deploys the site and the prototype.
- Open pull requests from feature branches. GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck and
  builds for every app, checks the generated design tokens are current and bundles the Expo app. Vercel adds a
  preview link for each site.
- In GitHub **Settings → Branches**, protect `main`: require the CI check to pass and a pull request before merging.
