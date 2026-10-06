# Plan: from demo to the App Store

What's left to build, decide and sign off before Landing can go live on the App Store. Written 6 October 2026 from a
read of the repository as it stands. It sits alongside the [movement, food and shopping plan](plan-movement-food-shopping.md),
which covers content and clinical sign-off in depth; this plan covers everything around it. Apple's rules are
summarised from memory of the App Store Review Guidelines, so check each one against the current guidelines before
relying on it.

---

## 1. The short version

The app looks and feels close to finished, but underneath it is still a demo. It opens as Hannah on a fixed date,
keeps everything on the phone, and several things it mentions (Apple Health, the landing score, the prescriber pack)
are pictures of features rather than features. Getting to the App Store needs five kinds of work:

1. **Make it real.** A real clock, data kept day by day, a fresh start for every new person, and the demo tucked away
   for testing.
2. **Make it safe and legal.** The safety screen, consent for health data, an 18+ check, terms, a privacy policy,
   clinical sign-off of every recipe and exercise, and a regulatory read of everything we say about GLP-1s.
3. **Connect the outside world.** Apple Health for weight and steps, reminders, and (if we choose) accounts and a
   backend for backup.
4. **Get paid.** A subscription through Apple's in-app purchase, with a trial and a paywall that fits the brand.
5. **Ship it.** A final name, icon and bundle ID, store listing and screenshots, a TestFlight beta, and Apple review.

The critical path is **the name, clinical sign-off and the legal pack**, not the code. Those depend on people outside
the team, so they should start this week.

---

## 2. Decisions needed first

These change what gets built, so they come before the build work. A recommendation for each.

| Decision | Options | Recommendation |
| --- | --- | --- |
| **The name** | Keep "Landing" or choose another | Run trademark (UK IPO, EUIPO) and App Store name checks now. The bundle ID, icon, listing and domain all hang off it, and the bundle ID can't change after the first upload. |
| **Who publishes** | Personal or company developer account | A company account (needs a D-U-N-S number, which can take a couple of weeks). The App Store shows the publisher's name, and a health app reads better from a company. |
| **Accounts and backend** | (a) Phone only, no account; (b) accounts with backup and sync (Supabase, as the food plan assumes) | (a) for version 1. No account means no password reset, no server holding health data, and simpler privacy. Add iCloud backup of the app's data and an export. Move to (b) when we need sync across devices, a web view or the prescriber pack sent by email. |
| **Business model** | Subscription, one-off purchase, or free during beta | Subscription with a free trial (for example 14 days, then monthly or yearly). Decide prices and whether anything stays free. |
| **The coach** | Keep scripted replies, build a real AI coach, or hide the tab | Keep it scripted for version 1, labelled as tips rather than a person, with the prescriber redirect. An AI coach needs its own safety review and has a running cost. |
| **Countries** | UK only, or UK plus Ireland and others | UK only. The content (supermarkets, Beat, NHS, NICE) is UK-specific, and so are the regulatory reviews. |
| **Platforms** | iPhone only, or Android too | iPhone first, as planned. Android is mostly a build and store listing once iPhone is done. |

---

## 3. Make it real (the app itself)

What the code does today, and what it needs to do.

| Area | Today | Needed |
| --- | --- | --- |
| **Dates** | `TODAY` is fixed at Monday 5 October 2026 (`src/data/dates.ts`) and used in 11 files | The real date, a new day starting at midnight local time, and a new week starting on Monday. Today's habits, protein and sessions reset when the day or week turns over. |
| **Data model** | Protein is stored by meal, not by date; habit ticks have no date; sessions are stored by weekday name | One log per day (protein by meal, habits ticked, session done, weigh-in, journal), kept by date. Weekly totals and the landing score are worked out from these logs. Add a version number and a migration for saved data. |
| **First run** | Opens as Hannah with six weeks of demo data | A new person starts empty at onboarding. Hannah stays available only in a hidden demo mode for testing and App Review. |
| **Settings** | Has demo controls (change the week, evening, reset) | Remove them from the release build, or put them behind a hidden gesture. Add units (kg or stones and pounds, promised in the brand guide), reminders, Apple Health, export and delete my data. |
| **Landing score** | Hard-coded weekly numbers | Work it out from habits, sessions and (outside safe mode) the weight trend, as Progress already describes. The formula needs writing down and checking. |
| **Weigh-ins** | Labelled "Apple Health", but there is no Apple Health connection | Real Apple Health reads (section 5), plus manual entry. The 7-day average and steady zone carry on as they are. |
| **Prescriber pack** | Promised in the coach's medication reply; not built | A one-page PDF of the trend and habits to share, or change the wording until it exists. |
| **Plan content by week** | Lessons and habits for three phases; sessions A and B only | A lesson and habits for each of the 52 weeks, session progression (movement plan 4.5), and the reset week. |
| **Meal plan** | 70 draft recipes, all labelled draft | About 120 signed-off recipes (food plan 5.3); remove the draft labels only once they're signed off. |
| **Today and the journal** | Built | Turn the journal's 4-day minimum up for launch (for example to 7), and check the copy once real data comes in. |
| **Known bugs** | "Ask the coach for more ideas" is hard to read in dark mode | Fix it, then do a full pass of dark mode, Dynamic Type at large sizes, VoiceOver and Reduce Motion. |
| **Quality** | Lint, typecheck and engine tests in CI | Tests for the day rollover, score and journal maths; crash reporting (for example Sentry) that sends no health data; a simple, privacy-friendly event count for the beta. |

---

## 4. Make it safe and legal

| Item | What it is | Who |
| --- | --- | --- |
| **Safety screen in onboarding** | Our own PAR-Q-style questions, refer-on screens, the continue checkbox linked to the terms (movement plan 4.2). Not built yet. | Physio wording, then build |
| **Age check** | A date of birth or "I'm 18 or over" step. Weight-management content and eating-disorder risk make 18+ the safe line. Set the App Store age rating to match. | Build |
| **Health data consent** | Under UK GDPR, weight, eating and cycle data are special category data, so explicit consent before collecting, a way to withdraw, and a record of it. | Lawyer, then build |
| **Privacy policy for the app** | Separate from the waitlist notice. What's collected, where it's kept, Apple Health use, retention, rights. Needs a public URL. | Lawyer |
| **Terms and health disclaimer** | Including "not medical advice", the refer-on checkbox, and subscription terms. Needs a public URL. | Lawyer |
| **DPIA and ICO** | A data protection impact assessment for health data, and the ICO data protection fee. | Lawyer or DPO |
| **Medical device check** | Confirm Landing's intended purpose keeps it a wellness app under MHRA rules: preferences not diagnoses, no reading of biometrics, no medication advice. | Regulatory adviser |
| **What we say about GLP-1s** | Prescription-only medicines can't be advertised to the public in the UK. Naming Wegovy or Mounjaro in the store listing, screenshots or ads is a risk even if the app is not selling them. Wording about "after the jab" needs a regulatory read (ASA/CAP and MHRA). | Regulatory adviser |
| **Clinical sign-off** | Recipes, protein guidance, exercises, safe mode, journal questions (the period question and drinking question included) | Dietitian, physio, Beat (food plan section 8) |
| **Safe mode check** | Confirm the new Today ring, the journal insights and the weight comparisons all behave in safe mode, and that nothing reads as a streak or a score to hit. | Beat review |

---

## 5. Connect the outside world

These need a development build; they don't work in Expo Go. From here on, test on development builds and TestFlight
rather than Expo Go.

| Item | Notes |
| --- | --- |
| **Apple Health** | Read weight and steps (steps could answer the journal's 7,000 steps question). Write weigh-ins entered in the app. Needs the HealthKit capability, clear permission text, and a screen explaining why before Apple's own prompt. Apple doesn't allow HealthKit data to be used for advertising or sold. |
| **Reminders** | Local notifications (`expo-notifications`): the morning check-in, session days and a gentle weekly nudge. Ask permission at a useful moment, not on first launch. Quiet hours and an off switch in Settings. |
| **Backup and export** | With no accounts: the app's data in iCloud backup, plus "Export my data" as a file. With accounts later: Supabase, with in-app account deletion, which Apple requires for any app that lets people create an account. |
| **Supermarket hand-off** | Search links and shopping mode for the big five (food plan section 6). Check that each link opens the supermarket's app or site correctly. |

---

## 6. Get paid

| Item | Notes |
| --- | --- |
| **In-app purchase** | Digital subscriptions in an iPhone app must go through Apple. RevenueCat over StoreKit saves building receipts and trial logic. Set up the subscription group, prices and trial in App Store Connect. |
| **Paywall** | After onboarding, when someone has seen their plan. Calm and honest: what's included, the price, when the trial ends, restore purchases, links to terms and privacy. No countdown timers or pressure. |
| **What happens when it lapses** | Decide what stays usable (their data and history, at the least) so nobody loses what they logged. |
| **Agreements** | The Paid Apps agreement, bank and tax details in App Store Connect. These take time to approve. |
| **Small Business Program** | Apply, to pay Apple's lower commission rate in the first year. |

---

## 7. Ship it

| Item | Notes |
| --- | --- |
| **Apple Developer Program** | Enrol the company (yearly fee). Add team members. |
| **Identity** | Final name, bundle ID (`ios.bundleIdentifier` in `app.json`, currently `com.yourcompany.landing`), final app icon and splash, and the Apple IDs in `eas.json` `submit`. |
| **Builds** | `eas build --profile production`, `eas submit`. Keep EAS Update for fixes that don't change native code, with the runtime version moved from the SDK version to the app version once off Expo Go. |
| **Privacy manifest** | Check the iOS privacy manifest covers AsyncStorage and any SDKs added (Sentry, RevenueCat). Expo generates most of it; add what's missing in `app.json`. |
| **App Privacy answers** | App Store Connect's privacy "nutrition label": health and fitness data, linked or not to the person, used for app function only. Must match the privacy policy. |
| **Store listing** | Name and subtitle, description, keywords, category (Health & Fitness), support URL and email, marketing URL, privacy policy URL. Screenshots for the current required iPhone size (6.9-inch at the time of writing). Optionally a short app preview video. Regulatory read before submitting. |
| **Review notes** | Explain that it is a wellness app with no medication advice, how to reach the paywall, and a way into the demo so the reviewer sees a populated app. Apple looks hard at health apps and subscriptions; clear notes save a rejection round. |
| **TestFlight beta** | About 50 people across settings, diets and supermarkets, as in the food plan's roadmap. External testers need a quick beta review first. Collect crashes, check-in rates, sessions done, meals planned. |
| **Support** | A support page on the website, an inbox, and an FAQ (cancelling, data, medication questions go to your prescriber). |
| **Website at launch** | Turn off the prototype link (`apps/web/prelaunch.json`), add the App Store badge, publish the app privacy policy and terms. |

---

## 8. Order of work

Weeks from now (6 October 2026). The people-dependent work runs alongside the build from week 1.

| Weeks | Product and build | People and paperwork |
| --- | --- | --- |
| 1 to 2 | Decide section 2. Real dates and the day-by-day data model. Fresh start and hidden demo mode. | Trademark search and name. Company developer account and D-U-N-S. Book the lawyer, regulatory adviser, physio, dietitian and Beat. |
| 3 to 6 | Safety screen, age check and consent in onboarding. Apple Health. Reminders. Landing score. Settings (units, export, delete). Development builds replace Expo Go. | Lawyer drafts the privacy policy, terms and DPIA. Regulatory read of positioning. Content review starts (food plan weeks 3 to 8). |
| 7 to 10 | 52 weeks of lessons and habits, session progression, reset week. In-app purchase and paywall. Crash reporting. Prescriber pack, or reword the promise. | Clinical fixes. Final icon. Paid Apps agreement, bank and tax. |
| 11 to 14 | Accessibility and dark mode pass. Tests for the day rollover, score and journal. Recipes to 120 as they're signed off. | Beat review of safe mode. Store listing, screenshots and review notes drafted and read by the regulatory adviser. |
| 15 to 18 | TestFlight beta, about 50 people. Fix what they find. | Support page and FAQ. ICO fee. |
| 19 to 20 | Submit for review. Allow a week or two for questions or a rejection round. Launch. | Website switches to the App Store badge. |

So about five months, with the clinical and legal sign-off setting the pace. A smaller first release (fewer recipes,
the first 26 weeks of content) could move launch forward without cutting any of the safety or legal work.

---

## 9. Risks

| Risk | What we do |
| --- | --- |
| App Review rejects for medical claims or GLP-1 wording | Regulatory read of the listing and in-app copy; clear review notes; no medication names in marketing |
| Name isn't available | Check now, before anything is printed or submitted |
| Clinical sign-off takes longer than planned | Book reviewers in week 1; launch with fewer, signed-off recipes rather than drafts |
| People lose their data (new phone, deleted app) | iCloud backup and export in version 1; accounts later |
| The paywall feels pushy for an anxious audience | Calm copy, honest trial terms, everything logged stays available if they stop paying |
| Health data handled wrongly | Phone-only storage for version 1, DPIA, no health data in crash reports or analytics |
