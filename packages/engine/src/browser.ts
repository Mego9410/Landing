// Browser build: `window.LandingFood`, for the prototype (and the web, if it ever needs it). Built by
// scripts/build.ts into dist/landing-food.js. Everything the meal screens need, with the library data included.
import { INGREDIENT, MEAL_DEALS, ORDERING_WELL, RECIPE, RECIPES } from "@landing/content";

export * from "./index.ts";
export const recipes = RECIPES;
export const recipe = RECIPE;
export const ingredient = INGREDIENT;
export const mealDeals = MEAL_DEALS;
export const orderingWell = ORDERING_WELL;

export const COLLECTIONS = [
  { id: "quick", label: "10 minutes or less" },
  { id: "no-cook", label: "No cooking" },
  { id: "fakeaway", label: "Fakeaways" },
  { id: "batch", label: "Batch and freeze" },
  { id: "gentle", label: "Gentle on the stomach" },
  { id: "store-cupboard", label: "Store cupboard" },
  { id: "microwave", label: "Microwave only" },
  { id: "on-the-go", label: "On the go" },
  { id: "family", label: "Family" },
] as const;
