# @landing/content

The food library: ingredients, recipes and the vetted swap lists, as typed data. The planning logic that uses it
lives in [`@landing/engine`](../engine/).

**Everything here is a draft.** Nutrition values are typical UK figures written from general knowledge, not yet
checked against CoFID 2021 or pack labels. Costs are estimates. Nobody has cooked or timed the recipes. Every recipe
has `review: { status: "draft" }`. The app shows approved recipes only. The prototype shows drafts, with a label.
The dietitian approves recipes, and the cook confirms timings, through the CMS ([plan §7.1](../../docs/plan-movement-food-shopping.md)).

## What's here

| File | What |
| --- | --- |
| `src/ingredients.ts` | About 120 ingredients: nutrition per 100 g (protein, carbs, fibre, fat, salt), kind for diet rules, the 14 FSA allergens, root veg (Jain), pantry staples, pregnancy flags, aisle, and how each is bought (tins, packs, each) |
| `src/recipes.ts` | 70 recipes: 14 breakfasts, 15 lunches, 30 dinners (12 fakeaways, 11 batch) and 11 snacks, drawn from [food research §3](../../docs/research/food.md). Also the meal-deal formulas and the takeaway-night "ordering well" notes |
| `src/swaps.ts` | Substitutes for each ingredient in order of preference, with a grams ratio and a note where protein drops; protein top-ups |
| `src/nutrition.ts` | Nutrition per portion from a list of ingredient lines |

A recipe can limit its swaps with `only`, when its method can't take one. Boiled eggs can't become tofu, and smash
burgers need a mince that holds together. Those recipes are left out for people who'd need that swap, rather than
shown with instructions that don't work.

## The check

`pnpm --filter @landing/content check` (add `--table` for every recipe's nutrition) fails on:

- unknown ingredients or swaps, and duplicate ids
- anything outside the Easy standard ([plan §5.2](../../docs/plan-movement-food-shopping.md)): more than 6 shopping
  ingredients, more than 15 minutes hands-on, more than 20 minutes in total, more than 3 things to wash up, mains
  under 25 g protein (breakfasts 15 g, snacks 10 g), mains without a portion (80 g) of veg
- tags that don't match the recipe: "gentle" with chilli or over 15 g fat, "no-cook" that needs kit, "batch" that
  makes fewer than 4
- diet-culture words and emoji

Batch recipes (4 or more portions) may take longer. **Proposed, for the team to decide:** tray bakes with 10 minutes
or less hands-on may take up to 25 minutes in total, because the oven does the work. The check lists these six as
notes rather than errors.
