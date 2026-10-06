# @landing/engine

Landing's planning logic in plain TypeScript, shared by the Expo app, the prototype and the web. Today it holds the
food side of [the plan](../../docs/plan-movement-food-shopping.md) (§5). Session building and progression join it
later (§7.1).

```ts
import { planWeek, profile, shoppingList, swapOptions, replaceMeal } from "@landing/engine";

const me = profile({ weeksSinceLastDose: 6, weeksOnPlan: 3, diet: "vegetarian", allergens: ["peanuts"], household: 2 });
const week = planWeek(me, { seed: 1 });
const list = shoppingList(week, me);
```

## What it does

- **Fits each recipe to the person** (`personalise`): diet (vegetarian, vegan, pescatarian, halal, kosher, vegetarian
  without eggs, Jain), the 14 allergens as a hard filter, lactose intolerance, foods they can't face right now,
  pregnancy, kit, time, budget, heat, richness and salt. Swaps come from the vetted lists only. When a swap drops
  protein below the meal's target, it adds a top-up. When the main ingredient changes, the dish is renamed ("Tofu
  tikka traybake").
- **Sets the week's aims** (`targets`): the phase from weeks since the last dose (Land, Settle, Steady); protein a
  meal (25 g, 30 g to build strength, 20 g at breakfast); a daily protein guide from a reference weight; and the fibre
  ramp, 15 g a day plus 5 g a week up to 30 g. There are no calorie targets. Protein targets switch off for kidney
  disease and pregnancy.
- **Plans the week** (`planWeek`): 3, 4 or 5 cooked dinners, planned leftovers for dinner and lunch, a takeaway night
  and a free night. It adds two weekday breakfasts and one for the weekend, three lunches on rotation, and a protein
  snack at each of the hungriest times. Meals are scored on protein, the person's goal, the phase (gentle and quick
  in Land, fakeaways and batch cooking in Settle, variety in Steady), cuisines they like, diabetes and reflux
  preferences, and ingredients already on the list. A seed makes it repeatable, and a new seed shuffles it.
- **Swaps and edits** (`swapOptions`, `replaceMeal`): three alternatives with similar effort and enough protein.
  Leftovers follow a replaced dinner.
- **Picking a week by hand** (`emptyWeek`, `setMeal`, `leftoverOptions`, `progress`): start from an empty week (or a
  suggested one) and set each meal to a recipe, leftovers of an earlier dinner that still keeps, a takeaway night or
  nothing. Portions for leftovers are added to the night they're cooked.
- **The shopping list** (`shoppingList`): every ingredient added up across all the dishes that use it, with each
  dish's share (`uses`). For example, 260 g of chicken breast for Wednesday's fajitas plus 300 g for Thursday's tikka
  makes 560 g. Each item has the total in kitchen units and what to buy, rounded up to packs. Items are grouped by
  aisle, with leftovers and whole batches counted. Pantry staples are listed separately to check.
- **Words for the app** (`reasons`, `weekSummary`, `quantity`, `LABELS`): why a recipe suits someone, notes when a
  week runs high in fibre or low in protein, and kitchen amounts ("2 eggs", "1 tbsp", "150 ml").

`pnpm --filter @landing/engine test` runs the tests. They cover every diet against every ingredient, allergens after
swaps and top-ups, kosher's meat-and-dairy rule, pregnancy, kit and time limits, protein minimums, leftovers, swaps,
the shopping list and the fibre ramp. `pnpm --filter @landing/engine build` writes `dist/landing-food.js`
(`window.LandingFood`), which the prototype copies into `src/food.js`.
