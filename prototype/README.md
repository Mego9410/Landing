# Landing prototype

A clickable HTML version of the whole Landing app, built from the [app screen designs](../designs/app-screens/)
with the [design system](../design-system/). Use it to get the brand and the flows right before building in Expo.
It uses dummy data: Hannah, who stopped her jab on 31 August, is in week 6 of her plan and today is Monday 5 October 2026.

## Open it

- **In this repo:** open `prototype/index.html` in a browser. If your browser blocks local files, serve the repo root
  (for example `npx serve .`) and go to `/prototype/`.
- **As one file:** run `node prototype/build.mjs`, then open `prototype/dist/landing-prototype.html`. It has everything
  inlined, so you can send it to someone or open it offline. `dist/artifact.html` is the same page for publishing as a
  claude.ai artifact.

On a desktop the app sits in a phone frame with the test panel beside it. On a phone it fills the screen and the
test panel opens from the dashed **Test panel** button.

## What works

- **Sign-up:** launch, welcome, Apple or email sign-in (Open Mail acts as tapping the link), all nine onboarding steps
  with branching (any Yes in the screening questions leads to safe mode), building your plan, plan reveal, paywall
  (yearly or monthly) and You're in.
- **The app:** Today, quick log, swap a habit, workouts (overview, a set-by-set session, done), Plan, week detail,
  lesson, Progress (score, weight trend with ranges, weigh-in history with edit and delete, prescriber pack), drift
  nudge, what changed, reset week, the Coach (scripted replies, with the prescriber redirect for any medication
  question) and every Settings screen down to deleting the account.
- **Live data:** logging protein, weight and hunger, ticking habits, finishing sessions, swapping habits, reading
  lessons, units, safe mode and every toggle update the other screens. Everything is saved in the browser, so it
  survives a reload.
- **Things the real app hands to iOS** (Apple sign-in, Apple Health, the App Store, share sheets, mail and web links)
  show a short message saying what would happen.

## Bypass and test controls

- **Skip buttons:** every sign-up, onboarding and paywall screen has a dashed **Skip** button that fills in dummy
  answers and moves on. Launch and Welcome have **Skip to the app**.
- **Test panel:**
  - Start from a fresh install, onboarding, the first day or Hannah in week 6.
  - Move to any week of the plan; weeks 9 and 27 show the new-phase screen.
  - Switch states: safe mode, drift nudge, reset week, offline, evening, week summary ready.
  - Set the subscription to none, free trial, paid or ended, and the theme to match device, light or dark.
  - Open a sheet, jump to any screen by its design ID, or clear everything.

A link ending in a screen name opens that screen, for example `index.html#progress`.

## How it's built

No build step and no npm: React 18 (the copy in `design-system/components/lib`), the design system's components
(`window.Landing`) and [htm](https://github.com/developit/htm) (`vendor/`, Apache 2.0) for JSX-like templates.

- `src/core.js`: state, dummy data, dates, navigation and shared UI pieces
- `src/screens-*.js`: the screens, grouped as in the designs
- `src/app.js`: the phone frame, routing, tab bar, sheets and the test panel
- `app.css`: the screen layout classes from the designs, the frame and the panel. Colours, type and spacing all come
  from `design-system/tokens.css`, so changing a token changes the prototype.

Screen copy follows the designs. Where the designs leave something open, the prototype keeps their placeholders
(screening questions 1, 3, 4 and 5, `[YOUR DOMAIN]`, `[YOUR COMPANY NAME]`) and invents nothing medical. Lesson text and
habits for Settle and Steady, the coach's replies and Strength A's exercises are dummy content to check before Expo.
