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

The app supports iPad in any orientation (full screen; iPhone stays portrait), so App Store Connect needs an **iPad 13" Display** set. `source/ipad-13/`
has raw screens at 2064 × 2752, captured from the web build at 1032 × 1376 points at 2x in demo mode. On iPad the
content sits in a centred column (680 points) with the tab bar centred below.
