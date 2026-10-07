# Steadie app screens

55 screen designs for the Steadie iPhone app, imported from the
[Steadie App Screens canvas](https://claude.ai/artifact/7QFUpd1hnCxoRoH7HG12V2). They use the
[design system](../../packages/design-system/) and are the visual reference for building the app.

Open [`index.html`](index.html) in a browser to see them all, grouped by flow.

- `renders/`: a 2x PNG of each screen (390 px wide, iPhone size).
- `screens/`: the source of each screen (`.dc.html`), plus `screens.css` (shared screen layout
  classes) and `canvas.json` (the canvas layout and screen titles). Paths to the design system's
  bundle and logos point at `packages/design-system/` in this repo. The sources only render inside the
  design canvas, which supplies the `support.js` runtime, so use the PNGs for reference.

Screens link to each other the way the app flows. Each screen's links are the `href`s in its source.

## Entry and sign-in

| Screen | Render | Source |
| --- | --- | --- |
| A1 Launch | [Main.png](renders/Main.png) | [Main.dc.html](screens/Main.dc.html) |
| A2 Welcome | [A2-Welcome.png](renders/A2-Welcome.png) | [A2-Welcome.dc.html](screens/A2-Welcome.dc.html) |
| A3 Email sign-in | [A3-Email.png](renders/A3-Email.png) | [A3-Email.dc.html](screens/A3-Email.dc.html) |
| A4 Check your inbox | [A4-Inbox.png](renders/A4-Inbox.png) | [A4-Inbox.dc.html](screens/A4-Inbox.dc.html) |

## Onboarding

| Screen | Render | Source |
| --- | --- | --- |
| O1 Where you are now | [O1-Status.png](renders/O1-Status.png) | [O1-Status.dc.html](screens/O1-Status.dc.html) |
| O2 Stop date | [O2-StopDate.png](renders/O2-StopDate.png) | [O2-StopDate.dc.html](screens/O2-StopDate.dc.html) |
| O3 Your starting point | [O3-StartingPoint.png](renders/O3-StartingPoint.png) | [O3-StartingPoint.dc.html](screens/O3-StartingPoint.dc.html) |
| O4 A few quick questions | [O4-Screening.png](renders/O4-Screening.png) | [O4-Screening.dc.html](screens/O4-Screening.dc.html) |
| O5 Support and safe mode | [O5-Support.png](renders/O5-Support.png) | [O5-Support.dc.html](screens/O5-Support.dc.html) |
| O6 Your training | [O6-Training.png](renders/O6-Training.png) | [O6-Training.dc.html](screens/O6-Training.dc.html) |
| O7 Food and hunger | [O7-FoodHunger.png](renders/O7-FoodHunger.png) | [O7-FoodHunger.dc.html](screens/O7-FoodHunger.dc.html) |
| O8 Your health data | [O8-Consent.png](renders/O8-Consent.png) | [O8-Consent.dc.html](screens/O8-Consent.dc.html) |
| O9 Connect Apple Health | [O9-AppleHealth.png](renders/O9-AppleHealth.png) | [O9-AppleHealth.dc.html](screens/O9-AppleHealth.dc.html) |
| O10 Reminders | [O10-Reminders.png](renders/O10-Reminders.png) | [O10-Reminders.dc.html](screens/O10-Reminders.dc.html) |
| O11 Building your plan | [O11-Building.png](renders/O11-Building.png) | [O11-Building.dc.html](screens/O11-Building.dc.html) |
| O12 Your Steadie plan | [O12-PlanReveal.png](renders/O12-PlanReveal.png) | [O12-PlanReveal.dc.html](screens/O12-PlanReveal.dc.html) |

## Paywall

| Screen | Render | Source |
| --- | --- | --- |
| P1 Start your free week | [P1-Paywall.png](renders/P1-Paywall.png) | [P1-Paywall.dc.html](screens/P1-Paywall.dc.html) |
| P2 You're in | [P2-YoureIn.png](renders/P2-YoureIn.png) | [P2-YoureIn.dc.html](screens/P2-YoureIn.dc.html) |
| P3 Subscription ended | [P3-Lapsed.png](renders/P3-Lapsed.png) | [P3-Lapsed.dc.html](screens/P3-Lapsed.dc.html) |

## Today

| Screen | Render | Source |
| --- | --- | --- |
| T1 Today | [T1-Today.png](renders/T1-Today.png) | [T1-Today.dc.html](screens/T1-Today.dc.html) |
| T2 Quick log | [T2-QuickLog.png](renders/T2-QuickLog.png) | [T2-QuickLog.dc.html](screens/T2-QuickLog.dc.html) |
| T3 Swap a habit | [T3-SwapHabit.png](renders/T3-SwapHabit.png) | [T3-SwapHabit.dc.html](screens/T3-SwapHabit.dc.html) |
| T4 Your week | [T4-YourWeek.png](renders/T4-YourWeek.png) | [T4-YourWeek.dc.html](screens/T4-YourWeek.dc.html) |

## Workouts

| Screen | Render | Source |
| --- | --- | --- |
| W1 This week's sessions | [W1-Sessions.png](renders/W1-Sessions.png) | [W1-Sessions.dc.html](screens/W1-Sessions.dc.html) |
| W2 Session overview | [W2-SessionOverview.png](renders/W2-SessionOverview.png) | [W2-SessionOverview.dc.html](screens/W2-SessionOverview.dc.html) |
| W3 In session | [W3-InSession.png](renders/W3-InSession.png) | [W3-InSession.dc.html](screens/W3-InSession.dc.html) |
| W4 Session done | [W4-SessionDone.png](renders/W4-SessionDone.png) | [W4-SessionDone.dc.html](screens/W4-SessionDone.dc.html) |

## Plan

| Screen | Render | Source |
| --- | --- | --- |
| PL1 Your plan | [PL1-Plan.png](renders/PL1-Plan.png) | [PL1-Plan.dc.html](screens/PL1-Plan.dc.html) |
| PL2 Week detail | [PL2-Week.png](renders/PL2-Week.png) | [PL2-Week.dc.html](screens/PL2-Week.dc.html) |
| PL3 Lesson | [PL3-Lesson.png](renders/PL3-Lesson.png) | [PL3-Lesson.dc.html](screens/PL3-Lesson.dc.html) |
| PL4 New phase | [PL4-NewPhase.png](renders/PL4-NewPhase.png) | [PL4-NewPhase.dc.html](screens/PL4-NewPhase.dc.html) |

## Progress

| Screen | Render | Source |
| --- | --- | --- |
| PR1 Progress | [PR1-Progress.png](renders/PR1-Progress.png) | [PR1-Progress.dc.html](screens/PR1-Progress.dc.html) |
| PR2 About your score | [PR2-Score.png](renders/PR2-Score.png) | [PR2-Score.dc.html](screens/PR2-Score.dc.html) |
| PR3 What changed | [PR3-WhatChanged.png](renders/PR3-WhatChanged.png) | [PR3-WhatChanged.dc.html](screens/PR3-WhatChanged.dc.html) |
| PR4 Your reset week | [PR4-ResetWeek.png](renders/PR4-ResetWeek.png) | [PR4-ResetWeek.dc.html](screens/PR4-ResetWeek.dc.html) |
| PR5 Weigh-in history | [PR5-History.png](renders/PR5-History.png) | [PR5-History.dc.html](screens/PR5-History.dc.html) |
| PR6 Prescriber pack | [PR6-PrescriberPack.png](renders/PR6-PrescriberPack.png) | [PR6-PrescriberPack.dc.html](screens/PR6-PrescriberPack.dc.html) |

## Coach

| Screen | Render | Source |
| --- | --- | --- |
| C1 Meet your coach | [C1-MeetCoach.png](renders/C1-MeetCoach.png) | [C1-MeetCoach.dc.html](screens/C1-MeetCoach.dc.html) |
| C2 Coach chat | [C2-CoachChat.png](renders/C2-CoachChat.png) | [C2-CoachChat.dc.html](screens/C2-CoachChat.dc.html) |

## Settings and account

| Screen | Render | Source |
| --- | --- | --- |
| S1 Settings | [S1-Settings.png](renders/S1-Settings.png) | [S1-Settings.dc.html](screens/S1-Settings.dc.html) |
| S2 Your details | [S2-Details.png](renders/S2-Details.png) | [S2-Details.dc.html](screens/S2-Details.dc.html) |
| S3 Subscription | [S3-Subscription.png](renders/S3-Subscription.png) | [S3-Subscription.dc.html](screens/S3-Subscription.dc.html) |
| S4 Reminders | [S4-Reminders.png](renders/S4-Reminders.png) | [S4-Reminders.dc.html](screens/S4-Reminders.dc.html) |
| S5 Apple Health | [S5-AppleHealth.png](renders/S5-AppleHealth.png) | [S5-AppleHealth.dc.html](screens/S5-AppleHealth.dc.html) |
| S6 Units | [S6-Units.png](renders/S6-Units.png) | [S6-Units.dc.html](screens/S6-Units.dc.html) |
| S7 Support and safe mode | [S7-Support.png](renders/S7-Support.png) | [S7-Support.dc.html](screens/S7-Support.dc.html) |
| S8 Privacy and data | [S8-Privacy.png](renders/S8-Privacy.png) | [S8-Privacy.dc.html](screens/S8-Privacy.dc.html) |
| S9 Delete account | [S9-DeleteAccount.png](renders/S9-DeleteAccount.png) | [S9-DeleteAccount.dc.html](screens/S9-DeleteAccount.dc.html) |
| S10 Account deleted | [S10-Deleted.png](renders/S10-Deleted.png) | [S10-Deleted.dc.html](screens/S10-Deleted.dc.html) |
| S11 Legal | [S11-Legal.png](renders/S11-Legal.png) | [S11-Legal.dc.html](screens/S11-Legal.dc.html) |

## Shared states

| Screen | Render | Source |
| --- | --- | --- |
| Safe mode: Progress | [X1-SafeMode-Progress.png](renders/X1-SafeMode-Progress.png) | [X1-SafeMode-Progress.dc.html](screens/X1-SafeMode-Progress.dc.html) |
| First day: Today | [X2-FirstDay-Today.png](renders/X2-FirstDay-Today.png) | [X2-FirstDay-Today.dc.html](screens/X2-FirstDay-Today.dc.html) |
| Offline and save failed: Quick log | [X3-Offline-QuickLog.png](renders/X3-Offline-QuickLog.png) | [X3-Offline-QuickLog.dc.html](screens/X3-Offline-QuickLog.dc.html) |
| Dark mode: Today | [X4-Dark-Today.png](renders/X4-Dark-Today.png) | [X4-Dark-Today.dc.html](screens/X4-Dark-Today.dc.html) |

## Shared parts

| Screen | Render | Source |
| --- | --- | --- |
| Tab bar (shared) | [TabBar.png](renders/TabBar.png) | [TabBar.dc.html](screens/TabBar.dc.html) |
