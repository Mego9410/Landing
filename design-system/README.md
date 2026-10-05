Landing helps people keep weight off for the year after they stop a GLP-1 jab. The people using it have often paid a lot, worked hard and feel anxious about regain. The brand's job is to feel like a soft place to land: calm, warm, round and on their side. Nothing in it should feel clinical, punishing or like a diet app.

"Landing" is a working name until trademark and App Store checks are done.

## Brand idea

**A gentle touchdown.** The mark is a sun descending in two soft steps and resting on a horizon. Every choice follows from that: round shapes, pastel light, slow transitions, and progress shown as steadiness rather than loss.

Three words to check work against: **soft, steady, on your side.**

## Voice and copy

- Write as a kind, knowledgeable friend. Use "you" and "your"; the app never says "I" except inside Coach replies.
- Plain UK English, sentence case everywhere, including buttons ("Start a reset week", not "Start A Reset Week").
- Short sentences. One idea per line. No exclamation marks in anything about weight; one is allowed in a celebration ("Four weeks steady!").
- No emoji in the product UI. Social posts may use them sparingly.
- Lead with what someone can do, never with what went wrong. "Things shifted a little this week. Here's a lighter week to reset." Not "You've regained 1.5%."
- Numbers are calm: weight to one decimal in kg (stones and pounds as a setting), score as a whole number, no red or green on weight changes.
- Promise line: **Keep what you've worked for.**

Words to use: steady, settle, routine, swap, reset week, landing score, your prescriber.
Words never to use: cheat, fail, bad food, guilt, willpower, streak lost, burn, slip-up, "back on track", "goal weight" in safe mode.

Medication is out of scope. Never write dose, taper, stop or restart advice. When a person asks, use the redirect wording from the `CoachBubble` guidelines and offer the prescriber pack.

## Colour

The palette is oat neutrals plus six pastels. Pastels are fills; each has a deeper `-ink` partner for text and icons.

- Screens sit on `surface` (oat). Cards use `surface-raised` with `shadow-sm` and `radius-lg`. Wells and tracks use `surface-sunk`.
- Text is `ink`, secondary text is `ink-muted`. Both only on the three surfaces.
- Text on any pastel fill is `on-pastel`. Never put `ink-muted` or a hue's own `-ink` on a pastel fill; they fail contrast.
- `apricot` is the brand hue: primary buttons, today's highlight, the sun. Use it once or twice per screen.
- `sage` = done and steady (ticked habits, the score ring). `lilac` = the coach. `sky` = information, hunger and prescriber notes. `butter` = gentle attention (early warning, reset week). `rose` = destructive actions only.
- Phases have a colour each: Land `sky`, Settle `sage`, Steady `lilac`.
- There is no alarm red. Drift and warnings use `butter`, because the app must never shame.
- Dark mode keeps the pastels slightly deeper and keeps `on-pastel` text dark on them.

## Type

- Headlines and numbers in **Fredoka** (`display`, `title`, `heading`, `numeral`). Everything else in **Nunito** (`body-lg`, `body`, `label`, `caption`). Both are free on Google Fonts; the stacks fall back to SF Pro Rounded on iPhone.
- Use `display` once per screen at most. Weekly lessons and coach replies use `body-lg` for comfortable reading.
- The landing score uses `numeral` with tabular figures.

## Shape, space and depth

- Everything is rounded. Buttons, chips and checkboxes are full pills or circles (`radius-full`); cards `radius-lg`; sheets `radius-xl`; inputs and bubbles `radius-md`.
- Use the 4px spacing scale. Screen gutter `space-4`, cards apart by `space-6`, card padding `space-4` (`space-5` for hero cards).
- Depth is soft and warm: `shadow-sm` for cards, `shadow-lg` for sheets. No borders on cards; inputs get a `line` border.
- Focus is the `focus-ring` shadow: a 3px gap, then a solid 2px `focus` ring.
- Motion: 200–300ms ease-out, small scale and fade. Ticking a habit gives a soft pop and a light haptic. Respect Reduce Motion.

## Imagery and iconography

- Icons are the original 2px rounded line set in `assets/Icons`, rendered with `currentColor`. Never use emoji as icons.
- No bathroom scales, tape measures, before/after bodies or syringes, anywhere, including marketing.
- Illustration, when needed, is built from the mark's shapes: discs, pills and soft horizons in the pastels. No faces.
- Photography (marketing only): warm natural light, real food, everyday movement, people over 30. No gym-mirror shots.

## Logo

- Use `landing-lockup.svg` on the waitlist site, App Store screenshots and prescriber pack header; `landing-mark.svg` alone at small sizes; `app-icon.svg` for the App Store.
- The wordmark is always lowercase "landing". Keep clear space equal to the sun's diameter.

## Components

Ten components cover the v1 screens: `Button`, `Chip`, `Card`, `HabitCheck`, `ScoreRing`, `HungerScale`, `NudgeCard`, `CoachBubble`, `TextField` and `TabBar`. They live in `components/bundle.js` as `window.Landing` (React 18). For the Expo app, port the same tokens and shapes to React Native StyleSheets; the CSS here is the reference.
