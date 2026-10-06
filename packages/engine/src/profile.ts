// What we know about the person, from onboarding and Settings, that shapes their meals. Preferences, not diagnoses:
// conditions only switch on filters the plan describes (§5.4), never advice.
import type { Allergen, Cuisine } from "@landing/content";

export type Diet = "none" | "vegetarian" | "vegan" | "pescatarian" | "halal" | "kosher" | "veg-no-egg" | "jain";

/** What the person wants food to do for them. There is deliberately no weight-loss goal (plan §5.1). */
export type Goal = "steady" | "strength" | "fuller";

/** Foods someone can't face right now, often after a GLP-1. Rechecked after 8 weeks (plan §5.4). */
export type Aversion = "spicy" | "rich" | "strong-smells" | "meat" | "fish" | "eggs" | "dairy";

export type KitOwned = "hob" | "oven" | "air-fryer" | "microwave" | "kettle";
export type HungryTime = "morning" | "lunchtime" | "afternoon" | "evening" | "late-night";
export type Condition = "type-2-diabetes" | "high-blood-pressure" | "reflux" | "pregnancy" | "kidney";

export interface Profile {
  /** Weeks since the last injection (1 is the first week off). 0 while still on the jab. */
  weeksSinceLastDose: number;
  /** Weeks since joining Landing, for the fibre ramp. */
  weeksOnPlan: number;
  goal: Goal;
  diet: Diet;
  allergens: Allergen[];
  /** Lactose intolerance, which is not a milk allergy: lactose-free dairy keeps the protein. */
  lactoseFree: boolean;
  /** Ingredient ids the person never wants. */
  dislikes: string[];
  aversions: Aversion[];
  kit: KitOwned[];
  /** The most hands-on time someone wants to spend on a weekday meal, in minutes. Oven and simmering time don't count. */
  maxMinutes: number;
  /** Portions for dinner: everyone eating. */
  household: number;
  hungryTimes: HungryTime[];
  /** Dinners to cook a week. The rest are leftovers, a planned takeaway and a free night (plan §5.5). */
  cookNights: 3 | 4 | 5;
  conditions: Condition[];
  /** Cuisines to see more of. */
  cuisines: Cuisine[];
  /** The most someone wants to spend a portion: 1 under £1.50, 2 up to £2.50, 3 any. */
  budget: 1 | 2 | 3;
  safeMode: boolean;
  /** Optional, for the daily protein guide. A reference weight, not current weight (clinical lead to confirm). */
  referenceWeightKg?: number;
}

export const DEFAULT_PROFILE: Profile = {
  weeksSinceLastDose: 1, weeksOnPlan: 1, goal: "steady", diet: "none", allergens: [], lactoseFree: false, dislikes: [],
  aversions: [], kit: ["hob", "oven", "microwave", "kettle"], maxMinutes: 20, household: 1, hungryTimes: ["afternoon"],
  cookNights: 4, conditions: [], cuisines: [], budget: 3, safeMode: false,
};

export const profile = (p: Partial<Profile> = {}): Profile => ({ ...DEFAULT_PROFILE, ...p });

/** Words for the app. */
export const LABELS = {
  diet: { none: "No particular diet", vegetarian: "Vegetarian", vegan: "Vegan", pescatarian: "Pescatarian", halal: "Halal", kosher: "Kosher", "veg-no-egg": "Vegetarian, no eggs", jain: "Jain" } satisfies Record<Diet, string>,
  goal: { steady: "Hold steady", strength: "Build strength", fuller: "Feel fuller for longer" } satisfies Record<Goal, string>,
  aversion: { spicy: "Spicy food", rich: "Rich or greasy food", "strong-smells": "Strong smells, like oily fish", meat: "Meat", fish: "Fish", eggs: "Eggs", dairy: "Milk and dairy" } satisfies Record<Aversion, string>,
  kit: { hob: "Hob", oven: "Oven", "air-fryer": "Air fryer", microwave: "Microwave", kettle: "Kettle" } satisfies Record<KitOwned, string>,
  condition: { "type-2-diabetes": "Type 2 diabetes", "high-blood-pressure": "High blood pressure", reflux: "Reflux or heartburn", pregnancy: "Pregnancy", kidney: "Kidney disease" } satisfies Record<Condition, string>,
  allergen: { celery: "Celery", gluten: "Gluten", crustaceans: "Crustaceans", eggs: "Eggs", fish: "Fish", lupin: "Lupin", milk: "Milk", molluscs: "Molluscs", mustard: "Mustard", peanuts: "Peanuts", sesame: "Sesame", soya: "Soya", sulphites: "Sulphites", "tree-nuts": "Tree nuts" } satisfies Record<Allergen, string>,
};
