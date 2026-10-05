# Deploying Landing

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
   - `NEXT_PUBLIC_SITE_URL`: the production URL, for example `https://[YOUR DOMAIN]`. Add it for Production; for
     Preview you can use the preview URL or leave it out.
5. Deploy. Every pull request gets a preview URL. Preview deployments are kept out of search engines automatically
   (`app/robots.ts`).
6. Under **Settings → Domains**, add your domain and follow Vercel's DNS steps.

### Before you collect real sign-ups

`app/api/waitlist/route.ts` validates sign-ups but stores nothing. Replace `saveSignup()` with your provider (for
example a Supabase table or a Resend audience), add its keys as Vercel environment variables (server-only, never
`NEXT_PUBLIC_`), and fill in the bracketed details in `app/privacy/page.tsx`.

## Before going live

- [ ] In `apps/web/prelaunch.json`, set `showPrototype` to `false`. This removes the floating **Preview the app**
      button and stops the prototype being published at `/prototype`. Commit and redeploy.
- [ ] Connect a real waitlist provider in `app/api/waitlist/route.ts` (see above).
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

1. Install the CLI once: `npm install -g eas-cli`, then `eas login`.
2. In `apps/mobile/app.json`, change `ios.bundleIdentifier` and `android.package` from `com.yourcompany.landing` to
   your own reverse domain. This can't change after the first App Store build.
3. From `apps/mobile`, run `eas init` to create the EAS project (it adds the project ID to `app.json`).
4. `pnpm --filter @landing/mobile build:preview` makes an internal build to install on your phone.
   `pnpm --filter @landing/mobile build:ios` makes a store build; `eas submit --platform ios` sends it to TestFlight
   (fill in the Apple IDs in `eas.json` first).

## Branches and checks

- `main` is production: merging deploys the site and the prototype.
- Open pull requests from feature branches. GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck and
  builds for every app, checks the generated design tokens are current and bundles the Expo app. Vercel adds a
  preview link for each site.
- In GitHub **Settings → Branches**, protect `main`: require the CI check to pass and a pull request before merging.
