# Accounts and backup

Steadie has optional accounts from day one, so people can change phones without losing their plan. This page covers
how it works and how to switch it on in Vercel.

## How it works

- **Signing in:** "Continue with Apple" (iPhone builds) or "Continue with email" (a six-digit code, valid 10 minutes).
  No passwords. It's offered straight after the welcome screen with "Not now", and in Settings. "I already have an
  account" on the welcome screen brings a backup to a new phone.
- **The phone is the working copy.** Every change is saved on the phone first. When signed in, the whole plan is
  backed up as one document a few seconds after a change, when the app goes to the background, and checked for newer
  changes when it opens.
- **Safety rules** (`apps/mobile/src/state/merge.ts`, tested in `src/test/logic.test.ts`):
  - Nothing is uploaded until onboarding is finished, so an empty phone can never replace a real backup.
  - Each backup has a revision number. A phone saving over a revision it hasn't seen is refused (409), and the newer
    of the two copies wins.
  - If a phone and a backup both have a plan and have never met, the person chooses which to keep.
  - Demo mode never backs up.
  - Apple Health permission belongs to each phone, so after a restore it's asked for again. Reminders are set up
    again from the restored settings.
- **Settings → Account:** the email, when it last backed up, Back up now, Sign out (backs up, then clears the phone)
  and Delete my account (deletes the account and backup on the server, then clears the phone). Apple requires
  in-app account deletion.

## The server (`apps/web`)

| Piece | What it does |
| --- | --- |
| `lib/auth.ts` | [Better Auth](https://better-auth.com): email codes, Sign in with Apple, bearer tokens for the app, rate limits (3 codes and 6 tries a minute) |
| `lib/db/` | Drizzle ORM. Neon Postgres in production; an embedded Postgres in `.data/` for local development, so `pnpm dev` needs no setup |
| `app/api/auth/[...all]` | Better Auth's endpoints |
| `app/api/sync` | `GET` the backup; `PUT` a new one with the revision it's based on |
| `app/api/account` | `DELETE` the account and everything with it |
| `app/api/waitlist` | Now saves sign-ups to the `waitlist` table |
| `proxy.ts` | CORS so the web build of the app can call the API |
| `lib/email.ts` | Sends codes through [Resend](https://resend.com). Without a key, outside Vercel, the code is printed in the terminal |

The app talks to it at `EXPO_PUBLIC_API_URL`. Without that variable, sign-in is hidden and the app works phone-only.

## Switching it on in Vercel

1. **Database.** In the `landing-web` project, **Storage → Create Database → Neon** (from the Vercel Marketplace;
   billed through Vercel). Pick the **London** region (`aws-eu-west-2`) to keep data in the UK, and connect it to
   Production and Preview. Vercel adds `DATABASE_URL`.
2. **Create the tables.** Locally, with the production connection string:
   `DATABASE_URL="postgres://…" pnpm --filter @landing/web db:migrate`. Do this again whenever
   `lib/db/migrations` changes (after editing `lib/db/schema.ts`, run `pnpm --filter @landing/web db:generate`).
3. **Environment variables** (Settings → Environment Variables, server-only):
   - `BETTER_AUTH_SECRET`: a long random string (`openssl rand -base64 32`). Required.
   - `BETTER_AUTH_URL`: the live URL, for example `https://www.getsteadieapp.com`.
   - `RESEND_API_KEY` and `EMAIL_FROM` (for example `Steadie <hello@getsteadieapp.com>`). Verify the domain in Resend
     first. Without these the site refuses to send codes in production.
   - `EMAIL_REPLY_TO`: a mailbox that receives mail (for example support@ on a real inbox). Sign-in emails set it as
     Reply-To, because hello@getsteadieapp.com can't receive replies. The sign-in email uses the Resend template
     `steadie-sign-in-code` (variable `CODE`), with a plain fallback if the template can't be used.
   - `APPLE_BUNDLE_ID`: the app's bundle ID (the same as `ios.bundleIdentifier` in `apps/mobile/app.json`). This
     turns on Sign in with Apple. Also tick **Sign in with Apple** for that App ID in the Apple Developer portal.
   - `REVIEW_EMAIL` and `REVIEW_CODE` (six digits): App Review can't receive email, so this one address signs in
     with a fixed code and no email is sent. Put both in the App Store review notes. Remove them after approval if
     you like.
4. **The app.** Set `EXPO_PUBLIC_API_URL=https://www.getsteadieapp.com` in the EAS `preview` and `production`
   environments (it's not secret). Sign in with Apple and the Keychain need a new build, not just an update:
   `expo-apple-authentication` and `expo-secure-store` are native modules.

## Before launch

- [x] Company details in `packages/content/src/legal.ts`: Oliver Acton, trading as Steadie, hello@getsteadieapp.com.
- [ ] Make hello@getsteadieapp.com receive mail (forward it to a real inbox, for example with Cloudflare Email Routing
      or ImprovMX). The policies give it as the contact for privacy requests.
- [ ] Add a contact address (`ADDRESS` in `legal.ts`; a virtual office address is fine) and, once registered, the ICO
      number (`ICO_NUMBER`). Both then appear in each policy's Contact section.
- [ ] Register with the ICO (£52 a year at ico.org.uk) and note that you hold health data.
- [ ] Write a short DPIA (data protection impact assessment). The ICO's template takes a few hours; the privacy
      policy already answers most of its questions.
- [ ] Data processing agreements: Vercel, Neon, Resend and RevenueCat include one in their terms; accept or download
      each from their dashboards and keep copies.
- [ ] In Neon, keep the history (point-in-time restore) window at **7 days or less**: the policy says deleted
      accounts leave the recovery copies within 7 days.
- [ ] Enter the App Store privacy labels from [`app-store-privacy.md`](app-store-privacy.md).
- [ ] Optional: link RevenueCat to the account (`Purchases.logIn(userId)`) so a subscription follows the account
      as well as the Apple ID. If you do, update the privacy labels (Purchase History becomes linked).

## Testing locally

```sh
pnpm --filter @landing/web dev                     # http://localhost:3000, codes print in this terminal
EXPO_PUBLIC_API_URL=http://localhost:3000 pnpm --filter @landing/mobile web
```

On a real phone, `localhost` is the phone itself: use your computer's network address
(`EXPO_PUBLIC_API_URL=http://192.168.x.x:3000`) or a deployed preview URL.
