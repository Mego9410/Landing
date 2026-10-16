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

## Testing the trial-ending reminder

The app schedules one local notification ("Your free week ends in 2 days") at 9am, two days before a trial ends, and
cancels or replaces it whenever RevenueCat reports a change (cancelled, paid early, dates moved). It has one fixed
identifier, so there's never a duplicate. Tapping it opens Settings. If notifications aren't allowed, the same message
shows as a card on Today for the last two days of the trial.

App Store sandbox (TestFlight and Sandbox Apple IDs) compresses time: a 1-week trial lasts **3 minutes**. The app
notices a trial shorter than a day and scales the offset, so the reminder fires two sevenths of the way from the end,
about **51 seconds before** the trial converts. To test:

1. On the iPhone, sign in to a Sandbox Apple ID (Settings → Developer → Sandbox Apple Account, or App Store → sign in
   when buying). Use a fresh one, or clear its purchase history in App Store Connect → Users and Access → Sandbox, so
   it's eligible for the trial.
2. Install the TestFlight build, finish onboarding and start the free trial. Allow notifications when asked.
3. Lock the phone. About 2 minutes 10 seconds later, the reminder arrives. Tap it: Settings opens.
4. To test the Today card, turn notifications off for Steadie in iOS Settings and start another trial with a fresh
   sandbox account: the card shows on Today straight away (a sandbox trial is always in its last "2 days").
5. Cancelling in Settings → Manage subscription before then removes the reminder.

Sandbox renewals repeat up to 12 times a day, then stop.

## Discount codes, offer codes and free access

Apple (guideline 3.1.1) and Google only allow subscriptions to be sold through their own billing. So no code in Steadie
unlocks anything by itself. There are three ways to give a discount:

| Way | Made in | Typed where | Good for |
| --- | --- | --- | --- |
| **Steadie discount codes** | /admin → Discount codes | The paywall's "Have a discount code?" | Launch prices, partners, creators: any number of codes, limits and dates, counted per code |
| **App Store / Play offer codes** | App Store Connect, Play Console | Apple's or Google's own sheet (linked from the paywall and Settings) | Free months, and one-off codes Apple or Google hand out |
| **Free access** | /admin → Free access, or a free-access code you approve | Nowhere, or the paywall's code box | Testers, friends and family (100% off) |

### Steadie discount codes

A code points the paywall at a RevenueCat **offering**: the same two plans, using discounted store products. The
server (`apps/web/lib/codes.ts`, `POST /api/codes`) checks it; the app (`src/state/codes.ts`) remembers it and the paywall
shows that offering's prices with the code's line ("Founding member price"). The purchase goes through Apple or Google
as usual.

**Setting up a discount once (for example "founding", £49.99 a year):**
1. App Store Connect → Subscriptions → the **Steadie** group: add `steadie_yearly_founding` (1 year, £49.99) and, if you
   want, `steadie_monthly_founding`. Keep them in the same group so nobody can hold two plans. Give each a free 1-week
   introductory offer if the discount should keep the trial. Add them to the app version for review like the others.
   - This price renews at £49.99 every year. For "£49.99 for the first year, then £69.99", use the usual product with
     a **pay up front** introductory offer instead. But only one introductory offer is allowed per product, and the
     product already has the free week. So a price that's discounted for good is usually the simpler choice.
2. Google Play: add the same products, or a developer-determined offer on the existing ones.
3. RevenueCat → Products: import them and attach them to the `plan` entitlement. Then go to **Offerings → New**,
   identifier `founding`, with `$rc_annual` → `steadie_yearly_founding` and `$rc_monthly` → `steadie_monthly_founding`.
   Don't make it the current offering.
4. /admin → Discount codes: code `FOUNDING`, what people see "Founding member price", offering `founding`, and
   optionally dates and a limit.

Any number of codes can share one offering, for example one per partner, to see which partner brings people in. Codes
are 3 to 24 letters, numbers or dashes, and aren't case sensitive. One install counts once against a limit. Turning a
code off stops new people using it. If RevenueCat doesn't have the offering, the app says so and shows the usual prices.
Guessing is limited to 10 tries a minute. Each use is recorded in `discount_code_uses`, and the app sends a
`code_applied` event.

### The launch offers

Two offers are already in the database, **off** until their store products exist. Both are for new members only: the
app won't apply them for someone who has had the plan, and Apple and Google only give an introductory offer once per
person per subscription group, so the stores check it again at purchase.

**`WELCOME20`: first timers, 20% off to start** (offering `welcome20`)
1. App Store Connect → the **Steadie** group: add `steadie_yearly_welcome20` (1 year, £69.99) and
   `steadie_monthly_welcome20` (1 month, £12.99). These are the usual prices.
2. Give each an **introductory offer**, for new subscribers, in all countries:
   - Yearly: **pay up front**, 1 year, £55.99.
   - Monthly: **pay as you go**, 3 months, £10.39, or the nearest price point Apple offers.

   The paywall then shows "£55.99 for your first year" under the plan, and the renewal wording reads "£55.99 for your
   first year, then £69.99 a year".
3. These products have no free week, so this offer replaces the trial.

**`FREEMONTH`: a free month** (offering `freemonth`)
1. Add `steadie_yearly_freemonth` (£69.99) and `steadie_monthly_freemonth` (£12.99) to the same group.
2. Give each an introductory offer: **free**, **1 month**, new subscribers. The paywall then says "Start my free month",
   and its timeline counts a month.

**For both:**
1. Add the same subscriptions in Google Play, each with a base plan and an offer for new customers: a free month, or a
   20% intro phase.
2. In RevenueCat, import the products and attach them to `plan`. Make offerings `welcome20` and `freemonth`, each with
   `$rc_annual` and `$rc_monthly`.
3. Add the products to the app version for review.
4. Turn the codes on in /admin. Change the wording or limits there at any time.

**Admin code: 100% off**

In /admin → Discount codes, add a code with **Gives: Free access (you approve)**. Choose how long the access lasts,
set a limit (for example 20), and pick a code that's hard to guess, for example `STEADIE-TEAM-7Q4K`. Don't put it in
the repo. When someone types it on the paywall:
- the app sends their Steadie ID
- the request appears under **Free access → Waiting for you**
- **Approve** gives the access through RevenueCat

The code never unlocks anything by itself, as Apple's rules require. On their phone, the paywall says their access is
on its way, and moves on once it's on (or they tap Restore).

### App Store and Google Play offer codes

Made in App Store Connect (a subscription's **Subscription Prices → Offer Codes**: free, pay as you go or pay up front;
a custom code or one-time codes) or the Play Console (**Monetize → Promo codes**). On the paywall, the discount code box
links to Apple's or Google's own redemption sheet; Settings → Subscription has it too. A redeemed code arrives through
RevenueCat like any purchase. Opening the sheet sends `offer_code_opened`.

### Free access (100% off)

- **TestFlight testers** never pay: purchases there use the sandbox.
- **Anyone else** (friends, family, partners):
  1. They tap **Settings → Subscription → Send my Steadie ID** and send it to you.
  2. In /admin → Free access, paste it, choose how long (1, 3, 6 or 12 months, or for good) and give it.
  3. The server grants the `plan` entitlement through RevenueCat's API and notes it in `free_access_grants`. Nothing is
     charged, and the app shows "Free access" in Settings.
  4. The grant belongs to that ID. If they delete the app, they send their new one.
- This needs `REVENUECAT_SECRET_KEY` (a v2 secret key) with **customer information read and write** and **project
  configuration (entitlements) read**, plus `REVENUECAT_PROJECT_ID`. The same key powers the dashboard's subscription
  figures, so add these permissions to it, or make a new key with both sets.
- You can also do the same by hand in RevenueCat → Customers → Grant promotional entitlement.
