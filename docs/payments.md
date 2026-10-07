# Payments

Steadie is a subscription, sold through Apple's in-app purchase and managed with [RevenueCat](https://www.revenuecat.com).

| Plan | Price (UK) | Free trial | Product ID |
| --- | --- | --- | --- |
| Yearly | £69.99 a year (about £5.83 a month, 55% less than monthly) | 7 days | `steadie_yearly` |
| Monthly | £12.99 a month | 7 days | `steadie_monthly` |

Apple allows one free trial per Apple ID per subscription group, so someone who has had a trial on one plan doesn't
get another on the other.

## How the app handles it

- Billing is off until `EXPO_PUBLIC_REVENUECAT_IOS_KEY` is set, and only on iPhone (`apps/mobile/src/state/subscription.ts`).
  With it off there's no paywall, which suits previews in Expo Go.
- With it on, the paywall (`src/app/paywall.tsx`) follows onboarding. It shows both plans with prices from the App Store
  in the person's currency. The trial appears only when Apple says this person is eligible. There's a day-by-day trial
  timeline, Restore purchases, and links to the terms and privacy policy, as Apple requires.
- Starting a trial asks for notification permission, then schedules a reminder two days before the trial ends. If
  the trial is cancelled, the reminder is cancelled too.
- Settings → Subscription shows the plan and when the trial ends or the plan renews, with Manage subscription
  (Apple's own sheet, for changing plan or cancelling) and Restore purchases.
- If a subscription lapses, the person keeps Settings, export and delete. Their data stays theirs.
- Demo mode never shows the paywall.

## Setup status (7 October 2026)

**App Store Connect**: app "Steadie", Apple ID **6820083153**, bundle `com.getsteadieapp.app`.
- [x] Subscription group "Steadie" (ID 22451392), display name "Steadie Plan" (en-GB).
  - Level 1: **Steadie Yearly**, `steadie_yearly`, 1 year, £69.99 UK base (US $69.99, €79.99), all 175 countries.
    Display name/description: "Steadie Yearly" / "Your 12-month plan, billed once a year".
  - Level 2: **Steadie Monthly**, `steadie_monthly`, 1 month, £12.99 UK base (US $12.99, €14.99), all 175 countries.
    Display name/description: "Steadie Monthly" / "Your 12-month plan, billed monthly".
- [x] Introductory offer on both: free, 1 week, new subscribers, all countries, from 7 October 2026, no end date.
- [x] App Store Server Notifications (production and sandbox) point at RevenueCat.
- [x] In-App Purchase key created and uploaded to RevenueCat.
- [ ] Paid Apps agreement Active: the US tax questionnaire is still to do.
- [ ] Small Business Program: apply, then set its start date in RevenueCat.
- [ ] Each subscription needs a paywall review screenshot (take it from the TestFlight build).
- [ ] Subscriptions go to review with the first app version: add both under **In-App Purchases and Subscriptions** on
      the version page before submitting.

**RevenueCat**: project "Steadie", app "Steadie (App Store)", IAP key valid.
- [x] Entitlement `plan` (display name "Steadie Plan"), attached to both products. The app checks this identifier.
- [x] Offering `default`, set as current: `$rc_annual` → `steadie_yearly`, `$rc_monthly` → `steadie_monthly`. The
      dashboard lists Monthly first; the app picks packages by type (`offering.annual`, `offering.monthly`) and shows
      Yearly first, so the order there doesn't matter.
- [x] Public Apple SDK key added to EAS **production** as `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (it's not in the repo).

**EAS**: `ascAppId` 6820083153 is in `apps/mobile/eas.json`, and an App Store Connect API key is stored on EAS's
servers, so `eas submit` (and `eas build --auto-submit`) work without signing in.

## Setting it up from scratch

For reference, or if anything needs redoing.

You need the Apple Developer Program membership, and the app (bundle ID `com.getsteadieapp.app`) created in App
Store Connect.

### 1. App Store Connect: agreements

1. **Business** (Agreements, Tax and Banking): accept the **Paid Apps** agreement and add bank and tax details. No
   purchases work until this shows **Active**.
2. Join the **App Store Small Business Program** (developer.apple.com/app-store/small-business-program). Apple then
   takes 15% instead of 30% while you earn under US$1 million a year.

### 2. App Store Connect: the subscriptions

In your app, go to **Monetisation → Subscriptions**:

1. Create a subscription group called **Steadie**.
2. Add two subscriptions to it: Steadie Yearly (`steadie_yearly`, 1 year, £69.99) and Steadie Monthly
   (`steadie_monthly`, 1 month, £12.99), choosing the UK as the base and letting Apple set the other countries.
3. In each one, under **Subscription Prices → Introductory Offers**, add **Free**, **1 week**, for all countries, for new
   subscribers.
4. For each, add a display name, a description and a review screenshot of the paywall.
5. In the group, put Yearly above Monthly, so that moving from monthly to yearly counts as an upgrade.

### 3. RevenueCat

1. Create a project, then add an **App Store** app with bundle ID `com.getsteadieapp.app`.
2. Upload an **In-App Purchase Key** (App Store Connect → Users and Access → Integrations → In-App Purchase).
3. Paste RevenueCat's **App Store Server Notifications** URL into App Store Connect → App Information, for Production and
   Sandbox.
4. Import both products, create the entitlement **`plan`** with both attached, and make a current **default** offering with
   **Annual** (`$rc_annual`) and **Monthly** (`$rc_monthly`) packages.
5. Copy the **public Apple SDK key** (starts `appl_`).

### 4. The key in EAS

Add the key to the EAS **production** environment, so App Store and TestFlight builds charge:

```
cd apps\mobile
eas env:create --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value appl_xxxxxxxx --environment production --visibility plaintext
```

Or ask Claude to set it. Leave it out of **preview**, so previews in Expo Go stay free and unlocked. The key ships
inside the app, which is how RevenueCat's public keys are meant to work; it isn't a secret.

The purchase code is native, so the key takes effect in the next **build** (`eas build --platform ios --profile
production`), not in an update.

### 5. Testing

- Install the build from **TestFlight**. Purchases there use Apple's sandbox: nothing is charged, and a 1-week trial
  lasts about 3 minutes, then renews every 5 minutes for up to 12 renewals.
- Try both plans, the trial reminder (you'll need to allow notifications), cancelling in Settings → Manage
  subscription, Restore purchases, and a lapsed subscription (Settings, export and delete still work).
- RevenueCat's dashboard shows sandbox purchases with a "sandbox" label.

### 6. App Review

- In the review notes, say the subscription starts with a 7-day free trial on both plans, and that the paywall appears
  after onboarding. Reviewers buy in the sandbox.
- Give them the `REVIEW_EMAIL` and `REVIEW_CODE` sign-in from Vercel, and mention demo mode (hold the welcome picture for
  three seconds) for seeing the app with sample data.
- The App Store listing's slide 10 says "Try it free for 7 days", which is now true for both plans.

## Changing prices or the trial

Prices and trials live in App Store Connect, and the app reads them from there, so the paywall updates itself. Also
change the website (`PRICE` in `apps/web/app/page.tsx`, and the FAQ), the terms (`packages/content/src/legal.ts`) and
the App Store art if the trial changes.
