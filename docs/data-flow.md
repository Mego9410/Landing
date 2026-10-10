# Where Steadie's data goes (one page)

Checked against the code on 9 October 2026. The privacy policy (`packages/content/src/legal.ts`), the website's
"Your data stays yours" and FAQ, the app's sign-in screen and the App Store labels (`docs/app-store-privacy.md`)
should all match this page. Update it whenever data handling changes.

## On the phone (always)

Everything the app keeps lives on the phone first: the health check, weight (if logged), check-ins, habits, strength
sessions, their own plans (this week's meal plan and their strength programme, each made from their answers and a random
seed of their own, and saved rather than worked out again, so the backup restores exactly the same plans), food preferences, coach messages, settings, the health-information consent and, if connected, Apple Health
weight and steps. Signed in, the session key is in the iPhone Keychain.

## On our servers (only if signed in)

| What | When | Where |
| --- | --- | --- |
| Email address, account ID, created date | On sign-in | Neon Postgres, London |
| Each sign-in's IP address and device type | On sign-in, until sign-out or deletion | Neon, London |
| Sign-in codes (10 minutes) and recent attempts by IP | When a code is asked for | Neon, London |
| The whole plan as one backup document | Only after onboarding is finished **and** health consent is given and not withdrawn. The server refuses it otherwise | Neon, London, encrypted at rest and in transit |
| Health consent: wording version, when given, when withdrawn | With each backup / on withdrawal | Neon, London |
| Funnel events (app opened, onboarding done, paywall seen, trial started…): random install ID, account ID if signed in, event name, no health values or free text | As they happen, signed in or not | Neon, London |
| Why someone cancelled (one answer, optional note) | Only if they answer the card | Neon, London |
| Weekly recap choice (on/off) and which weeks it was sent | When turned on in onboarding or Settings | Neon, London |
| The steady scores for this week and the two before (`derived`, worked out on the phone) | With each backup, for the recap | Neon, London, inside the backup |

Without an account, nothing about the plan leaves the phone. Funnel events and the cancellation answer do.

## Third parties

- **Vercel** runs the server (London) and keeps short request logs.
- **Neon** is the database (London).
- **Resend** gets the email address and the code for sign-in, and runs the guide-email list for people who opt in
  (address, subscribed or not, delivery/open/click stats). For people who turn on the weekly recap, it also sends
  that email, so it sees its contents: check-ins, sessions, steady score, a tip and, unless Habit Only mode is on and only if
  weight is logged, the 7-day average weight.
- **RevenueCat** gets an anonymous app user ID, App Store purchase details and basic device info. It never gets what
  people log.
- **Apple** handles payment, Sign in with Apple (may give a private relay address) and Apple Health (read on the phone).
- **Expo** sees IP address, a random install ID and the app version when the app checks for an update.
- **Sentry** (crash reports, once switched on) gets crash and error details with personal data stripped: no emails,
  no health values, no request bodies.

## Export and deletion

- **Export:** Settings → Export my data (a file of everything the app keeps).
- **Withdraw health consent:** Settings → Account. Deletes the backup on our servers and stops backing up. The plan
  stays on the phone, and the account and guide emails stay.
- **Delete my account:** Settings → Account. Deletes the account, backup, sign-ins, consent record and guide-email
  contact, then clears the phone.
- **Not signed in:** Settings → Sign out and delete my data (or Delete everything when accounts are off).
- Database recovery copies age out within 7 days (Neon history window; see `docs/accounts.md`).

## Promises that are true in code

- "Never sold, never used for ads": nothing is shared for advertising, and there's no ad or tracking SDK.
- "Export or delete from Settings": both are in Settings. Deleting asks you to confirm first, so it isn't literally
  one tap, and the website now says "from Settings".

## App Store privacy label: what to check in App Store Connect

Already listed: Name, Email Address, Health, Fitness, Sensitive Info, Other User Content, User ID, Device ID,
Purchase History. Not used for tracking.

Add or change:
1. **Email Address**: add the purpose **Developer's Advertising or Marketing** (guide emails).
2. **Usage Data → Product Interaction**: collected, **linked to the user** (the account ID is attached when signed
   in), purposes **Analytics** and **App Functionality**. This is for the funnel events.
3. **Diagnostics → Crash Data**, and **Performance Data** if performance monitoring is turned on: collected, **not
   linked**, purpose **App Functionality**. This is for Sentry, once its DSN is set.
4. **User Content → Other User Content** already covers the optional note on the cancellation card.
