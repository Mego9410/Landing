# App Store screenshots

Nine plain app screenshots at **1290 × 2796** (iPhone 6.9" display), with an iOS status bar and nothing else, for
framing and captioning elsewhere. App Store Connect scales 6.9" screenshots down for smaller iPhones. The captions
below are suggestions.

| # | File | Suggested caption |
| --- | --- | --- |
| 1 | `01-today.png` | Keep what you've worked for. A calm plan for the year after your weight-loss jab. |
| 2 | `02-meals.png` | Easy meals, planned for you. High-protein dinners, leftovers and a takeaway night. |
| 3 | `03-run.png` | Strength at home in 25 minutes. Clear demos, with an easier version of every move. |
| 4 | `04-progress.png` | A score for habits, not the scales. Your steady score rewards routines that last. |
| 5 | `05-insights.png` | See what shapes your days. A one-minute morning check-in shows your patterns. |
| 6 | `06-plan.png` | A 12-month plan, one week at a time. Land, settle, then steady. |
| 7 | `07-week.png` | Three small habits a week. Swap any that don't suit you, and read a short lesson. |
| 8 | `08-shopping.png` | One shopping list for the week. Every ingredient added up. |
| 9 | `09-recipes.png` | Recipes that fit how you eat. Vegetarian, halal, no-cook, budget and more. |

The screens are the real app (the web build) in demo mode, with Hannah's dummy data, six weeks in. Apple asks that
screenshots show the app in use; they do. Captions avoid weight-loss promises and medicine names, in line with the
brand rules and UK advertising rules for health products.

To remake them after the app changes: build the web app (`pnpm --filter @landing/mobile web:export`), open it in demo
mode (hold the welcome picture for three seconds), capture each screen at 430 × 878 points at 3x, and add a 162 px
iOS status bar (9:41) on top to make 1290 × 2796.
