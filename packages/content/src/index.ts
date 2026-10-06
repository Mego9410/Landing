export * from "./types.ts";
export { INGREDIENTS, INGREDIENT } from "./ingredients.ts";
export { RECIPES, RECIPE, MEAL_DEALS, ORDERING_WELL } from "./recipes.ts";
export { SWAPS, TOP_UPS } from "./swaps.ts";
export { nutritionOf, rounded, type Nutrition } from "./nutrition.ts";

/** The minimums the Easy standard sets for each slot (plan §5.2). */
export const PROTEIN_MIN = { breakfast: 15, lunch: 25, dinner: 25, snack: 10 } as const;
/** One portion of veg, in grams. */
export const VEG_PORTION = 80;
