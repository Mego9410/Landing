# App Store artwork

The App Store listing for Steadie, from the brand handoff (`packages/design-system/brand/README.md`, section 6).

## Screenshots

Upload in this order. Apple requires the **iPhone 6.9" Display** set; the 6.3" set is optional.

- `listing/6.9/`: 1290 × 2796, for **iPhone 6.9" Display**. Made from the designer's 6.3" art, scaled up 7% with
  9 px of plain background trimmed.
- `listing/6.3/`: 1206 × 2622, the designer's originals, for **iPhone 6.3" Display**.

| # | File | Background | Headline |
| --- | --- | --- | --- |
| 1 | `iphone-01-hero.png` | apricot | Keep what you've worked for. |
| 2 | `iphone-02-plan.png` | peach | A year of support after the jab |
| 3 | `iphone-03-habits.png` | lilac | Three small habits a week |
| 4 | `iphone-04-strength.png` | sky | Strength for every body |
| 5 | `iphone-05-meals.png` | sage | Meals easier than a takeaway |
| 6 | `iphone-06-shopping.png` | butter | One shopping list for the week |
| 7 | `iphone-07-recipes.png` | peach | Recipes that suit how you eat |
| 8 | `iphone-08-score.png` | sage | A weekly score for habits, not weight |
| 9 | `iphone-09-checkins.png` | sky | See what shapes your steadier days |
| 10 | `iphone-10-on-your-side.png` | apricot | On your side, all year |

`header-3840x1646.png` is the product page header.

All files are saved without an alpha channel: App Store Connect rejects screenshots and icons with transparency.

### Check before uploading

- **Slide 10, "Try it free for 7 days":** true once both subscriptions have their 1-week free introductory offer in
  App Store Connect (see `docs/payments.md`).
- **Slide 10, "Your data stays yours: Kept on your phone":** since accounts, people who sign in also have a private
  backup. Consider "Kept private. Never sold, never used for ads." so it matches the privacy policy.

## Source screens

`source/` has the plain app screens (1290 × 2796, iPhone 6.9", with a 9:41 status bar) that the listing art is built
from, captured from the app in demo mode (Hannah, six weeks in). To remake them after the app changes: build the web
app (`pnpm --filter @landing/mobile web:export`), open it in demo mode (hold the welcome picture for three seconds),
capture each screen at 430 × 878 points at 3x, and add a 162 px status bar on top. The listing layout is in
`designs/brand/Steadie App Store Assets.dc.html`.

## iPad

The app supports iPad in any orientation (full screen; iPhone stays portrait), so App Store Connect needs an **iPad 13"
Display** set. `listing/ipad-13/` has ten screens at 2064 × 2752, ready to upload in this order:

| # | File | Screen |
| --- | --- | --- |
| 1 | `ipad-01-today.png` | Today: today's thought, up next, the day's list, the lesson and today's tip |
| 2 | `ipad-02-plan.png` | Plan: the week's days, tonight's dinner, meals and strength |
| 3 | `ipad-03-progress.png` | Progress: steady score, habit week, your year, strength, trend |
| 4 | `ipad-04-cook-along.png` | Cook-along with a timer running |
| 5 | `ipad-05-strength.png` | A strength session, mid-exercise |
| 6 | `ipad-06-recipes.png` | Recipes and collections |
| 7 | `ipad-07-your-month.png` | Your month, the four-weekly look back |
| 8 | `ipad-08-welcome.png` | The welcome screen (the film's first frame) |
| 9 | `ipad-09-today-dark.png` | Today in dark mode |
| 10 | `ipad-10-plan-dark.png` | Plan in dark mode |

They were captured from the web build at 1032 × 1352 points at 2x, in UK English, with the app's own demo (hold the
welcome film for three seconds: Hannah, six weeks in). The browser clock was set to Thursday 29 October, 9:41, so the
week has some ticks in it. A 24-point iPad status bar (9:41, Thu 29 Oct, Wi-Fi, 100%) was then added on top in each
screen's own background colour. On iPad the content sits in a centred column (680 points) with the tab bar centred below.
