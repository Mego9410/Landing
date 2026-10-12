# Google Play launch

How Steadie gets onto Google Play, what's already done in the code, and the answers for each Play Console form.
The App Store equivalent is `docs/app-store-privacy.md`; keep the two in step when what the app collects changes.

## Done in the code

- **Subscriptions on Android.** `src/state/subscription.ts` turns billing on when `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`
  is set. The free trial comes from Google Play's own offer (shown only to people eligible for it), and
  Manage subscription opens Google Play's subscriptions page for Steadie.
- **Store wording.** `src/state/storeWords.ts` says Google Play, Google account and the Play Store app on Android
  (paywall, Settings, restore, the trial reminder, sign-in copy).
- **iPhone-only features stay off.** Apple Health's row is hidden on Android; Sign in with Apple isn't offered, so
  Android accounts use email. Health Connect could come later.
- **Ratings.** The milestone rating prompt uses Google Play's in-app review; Settings › Rate Steadie opens the
  Play listing.
- **Submissions.** `eas submit --platform android` sends builds to the **internal testing** track as a draft.
- **Website.** `/support` covers Android subscriptions and a web route to delete an account (Play requires one).

## Setup, in order (needs Oliver: payment, ID and sign-ins)

1. **Create the developer account** at play.google.com/console: $25 once, then Google's identity check. A personal
   account is right for a sole trader. A new personal account must run a **closed test with at least 12 testers for
   14 days in a row** before it can publish to production.
2. **Create the app**: name *Steadie*, default language English (United Kingdom), app, paid with in-app purchases →
   *Free* with in-app products. Package name comes from the first upload: `com.getsteadieapp.app`.
3. **First build**: `eas build --platform android --profile production` (EAS creates and keeps the upload key), then
   upload the `.aab` to internal testing once by hand; after that `eas submit` works with a Google service account
   key added to EAS.
4. **Subscriptions** in Play Console → Monetise → Subscriptions, matching iOS:
   - `steadie_yearly` with base plan *yearly*, £69.99, auto-renewing; `steadie_monthly` with base plan *monthly*,
     £12.99.
   - On each base plan add an offer with a **7-day free trial**, eligibility **New customer acquisition** (so Google
     hides it from people who've had it).
5. **RevenueCat**: add a Google Play app to the project, upload the service account credentials RevenueCat asks for,
   attach both products to the `plan` entitlement and the `default` offering, and turn on Google's real-time
   developer notifications. Put the **public Android SDK key** in EAS as `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`.
6. **Closed test**: 12+ testers (a Google Group is easiest) for 14 days, then apply for production access.
7. **Website**: once the listing is live, add the Google Play badge next to the App Store button.

## Store listing

| Field | Copy | Limit |
| --- | --- | --- |
| App name | Steadie: Life After GLP-1 | 25 of 30 |
| Short description | A calm 12-month plan to keep the weight off after you stop your weight-loss jab. | 80 of 80 |
| Full description | The App Store description, with "iPhone" and "Apple Health" lines removed | up to 4,000 |
| Category | Health & Fitness | |
| Contact email | hello@getsteadieapp.com | |
| Privacy policy | https://www.getsteadieapp.com/app-privacy | |

Google's metadata policy is strict about brand names, so the title uses GLP-1 rather than Mounjaro or Wegovy.

Graphics: 512 × 512 icon, 1024 × 500 feature graphic, and at least 2 phone screenshots (the same three-screen story
as the App Store: the fear, the plan, the proof).

## App content forms

**Privacy policy:** `https://www.getsteadieapp.com/app-privacy`.

**Ads:** no ads.

**App access:** some features need sign-in; give reviewers the `REVIEW_EMAIL` and `REVIEW_CODE` from Vercel, and the
demo (hold the picture on the welcome screen for three seconds).

**Content rating (IARC):** health and fitness app; no violence, sex, gambling, drugs or user-to-user communication.
The in-app coach gives ready-made ideas from our team and isn't a chat with other people.

**Target audience:** 18 and over only.

**Health apps declaration:** Nutrition and weight management; Activity and fitness. Not a medical device, no
diagnosis or treatment, no medication advice. Doesn't connect to Health Connect yet.

**Data safety** (mirrors the App Store labels):

| Play category → type | Collected | Shared | Optional | Purpose |
| --- | --- | --- | --- | --- |
| Personal info → Name | Yes | No | Yes | App functionality |
| Personal info → Email address | Yes | No | Yes | App functionality, Developer communications |
| Personal info → User IDs | Yes | No | Yes | App functionality |
| Personal info → Religious or political beliefs | Yes | No | Yes | App functionality (diet preferences such as halal, kosher or Jain can show religious belief) |
| Health and fitness → Health info | Yes | No | No | App functionality |
| Health and fitness → Fitness info | Yes | No | No | App functionality |
| Financial info → Purchase history | Yes | No | No | App functionality, Analytics |
| App activity → App interactions | Yes | No | No | Analytics, App functionality |
| App activity → Other user-generated content | Yes | No | No | App functionality |
| App info and performance → Crash logs | Yes | No | No | App functionality |
| Device or other IDs | Yes | No | No | App functionality |

- Data is **encrypted in transit**: yes.
- People **can request deletion**: yes, in the app (Settings → Account) and on the web at
  `https://www.getsteadieapp.com/support#delete` (email route).
- "Shared" is No throughout: RevenueCat, Sentry, Resend and the hosting are service providers acting for Steadie,
  which Google doesn't count as sharing.
- **Health info being collected but "not optional"**: weigh-ins and check-ins are the core of the app; signing in
  (and so the backup) is optional.
