# Accessibility

What the app does for accessibility, checked on 9 October 2026, and what to enter in App Store Connect.

## What was checked and fixed

- **Larger Text (Dynamic Type).** All text scales with the iPhone's text size (React Native scales every font size by
  the system setting). Buttons, text fields, chips, badges and pills grew from fixed heights to minimum heights, so
  text wraps instead of being cut off. At the larger accessibility sizes (`useLargeText()`, font scale 1.35 or more)
  side-by-side layouts stack: Today's day ring and headline, the two plan tiles, and each check-in question above its
  Yes/No buttons. The plan tiles no longer truncate to two lines. Text inside fixed shapes grows a little less so it
  stays inside: tab labels (up to 1.4×), the day ring's numbers and the check-in scale numbers (1.2–1.3×), and the
  avatar initial.
- **VoiceOver.** Every button, icon button, tab, toggle, tick box and radio has a role and a label (a scan found no
  unlabelled icon-only buttons). The check-in's Yes/No and 1–5 buttons carry their question as a hint, so the answer
  is never read without context. The Plan screen's 52 week dots are one element ("Land: week 6 of 8, 5 done") instead
  of 52 stops. Decorative illustrations (welcome, sign-in and lesson headers, the logo) are hidden from VoiceOver; the
  exercise animations are read as an image with the exercise's name. Disabled buttons say so.
- **Contrast.** Every text colour on every background it's used on meets WCAG AA (4.5:1) in both light and dark
  themes. The lowest is muted text on the sunk background in light mode, 5.0:1. The peach (apricot) buttons with dark
  text are 9.3:1 (light) and 9.1:1 (dark); muted grey on the dark background is 7.8:1.
- **Reduce Motion.** The exercise demonstrations stop animating and show a still pose when Reduce Motion is on (they
  can also be paused in Settings → Exercise demos). There are no other animations apart from scroll-linked fades.
- **Hit areas.** Everything tappable is at least 44×44 points: the meal planner's day tabs, Today's shortcut pills, the
  coach's topic chips and "Make my summary", the choice chips and the check-in buttons were raised to 44.
- **No pop-ups.** Confirmations (sign out, delete account, delete everything, which plan to keep when signing in) are
  inline cards and steps, not system alerts.

## Before you claim it: a 10-minute check on a real iPhone

1. Settings → Accessibility → Display & Text Size → Larger Text: turn on Larger Accessibility Sizes and drag to the
   largest. Go through onboarding, Today, the check-in, Plan, a recipe, a workout and Settings. Nothing should be cut
   off or overlap.
2. Turn on VoiceOver (triple-click the side button if set up). Do a check-in and tick a habit by swiping only.
3. Turn on Reduce Motion and open a workout: the demonstration should be still.
4. Switch to Dark Mode and look through the same screens.

## App Store Connect → App Accessibility

Tick only what's true for the common tasks (onboarding, the daily check-in, ticking habits, meals, workouts):

| Feature | Claim? | Why |
| --- | --- | --- |
| **VoiceOver** | Yes, after the device check above | Everything is labelled, decorative images hidden, check-in readable in order |
| **Larger Text** | Yes, after the device check above | Text scales and layouts stack at accessibility sizes |
| **Dark Interface** | Yes | The app follows the iPhone's light or dark setting throughout |
| **Sufficient Contrast** | Yes | All text meets WCAG AA in both themes (see above) |
| **Reduced Motion** | Yes | The only animations (exercise demos) stop with Reduce Motion |
| Voice Control | Not yet | Likely works (everything has a label), but hasn't been tested |
| Differentiate Without Color Alone | No | Selected chips are shown mainly by fill colour |
| Captions, Audio Descriptions | No (not applicable) | The app has no video or audio |
