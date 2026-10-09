# App Store privacy labels

The answers to enter in **App Store Connect → your app → App Privacy**, and why. They match the privacy policy
(`packages/content/src/legal.ts`, published at `/app-privacy`) and the privacy manifest in `apps/mobile/app.json`
(`ios.privacyManifests.NSPrivacyCollectedDataTypes`). If what the app collects changes, update all three together.

Apple counts data as **collected** when it leaves the phone and is kept longer than needed to answer a request.
Accounts are optional, but the labels describe the app as a whole, so everything the backup holds is declared.

## Settings

| Question | Answer |
| --- | --- |
| Privacy policy URL | `https://www.getsteadieapp.com/app-privacy` |
| Do you or your third-party partners collect data from this app? | **Yes** |
| Do you or your third-party partners use data for tracking? | **No** (no advertising, no data brokers, no IDFA, no tracking SDKs) |

## Data types

For every type below: **Used for tracking: No.**

| App Store category → type | Collected | Purpose | Linked to the user | Where it comes from |
| --- | --- | --- | --- | --- |
| Contact Info → **Name** | Yes | App Functionality | Yes | The optional first name, in the backup |
| Contact Info → **Email Address** | Yes | App Functionality, Developer's Advertising or Marketing | Yes | Signing in (email code, or Apple's relay address), and guide emails for people who turn them on |
| Health & Fitness → **Health** | Yes | App Functionality | Yes | Weigh-ins (typed or from Apple Health), the health check, medicine status, hunger and other check-ins |
| Health & Fitness → **Fitness** | Yes | App Functionality | Yes | Steps from Apple Health and strength sessions done |
| **Sensitive Info** | Yes | App Functionality | Yes | The health check asks about pregnancy, and diet preferences (halal, kosher, Jain) can show religious beliefs; Apple lists both as sensitive |
| User Content → **Other User Content** | Yes | App Functionality | Yes | Morning check-in answers, habits and messages to the in-app coach |
| Identifiers → **User ID** | Yes | App Functionality | Yes | The account ID |
| Identifiers → **Device ID** | Yes | App Functionality | No | Expo's random install ID, sent when the app checks for updates |
| Purchases → **Purchase History** | Yes | App Functionality, Analytics | No | RevenueCat checks the subscription and gives us revenue charts, under an anonymous ID |

Not collected, so leave unticked: Phone Number, Physical Address, Other User Contact Info, all Financial Info
(Apple takes payment), Precise and Coarse Location, Contacts, Emails or Text Messages, Photos or Videos, Audio,
Gameplay Content, Customer Support, Browsing History, Search History, all Usage Data, all Diagnostics, Other Data.

## Notes on the borderline answers

- **Purchase History is "not linked"** because the app doesn't tell RevenueCat who the person is. If you later add
  `Purchases.logIn(userId)` so subscriptions follow the account, change it to **linked**.
- **IP addresses** kept with each sign-in (for security) and in the rate limiter aren't a separate App Store type.
  They'd only count as Coarse Location if used to work out where someone is, and they aren't.
- **Device ID** is the conservative answer. Expo's update check sends a random ID made when the app is installed.
  It isn't the advertising identifier and isn't linked to the account.
- **Adding crash reporting or analytics later** (Sentry, for example) adds Diagnostics → Crash Data / Performance
  Data, and possibly Usage Data. Update the labels, the manifest and the policy before shipping that build.

## The privacy label Apple will show

Roughly, the listing will read:

- **Data Linked to You:** Health & Fitness, Contact Info, Sensitive Info, User Content, Identifiers.
- **Data Not Linked to You:** Purchases, Identifiers.
- **Data Used to Track You:** none.

## Elsewhere in App Store Connect

- **Health and medical questions** (in the age rating questionnaire): "Medical/Treatment Information" — *Infrequent
  /Mild* is the honest answer for general health information with no diagnosis or treatment. The app is for adults
  (18+), which the terms say.
- **Sign in with Apple** is offered alongside email sign-in, and accounts can be deleted in the app (Settings →
  Delete my account), both as Apple requires.
- **Review notes:** give App Review the `REVIEW_EMAIL` and `REVIEW_CODE` from Vercel, and mention demo mode (hold
  the picture on the welcome screen for three seconds).
