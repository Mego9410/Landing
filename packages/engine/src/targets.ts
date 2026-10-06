// What a week of meals aims for, given where the person is since stopping (plan §5.1 and food research §1).
// No calorie targets, ever. Protein and fibre guides are shown in grams only outside safe mode.
import type { Slot } from "@landing/content";
import { proteinTarget } from "./personalise.ts";
import type { Profile } from "./profile.ts";

export type Phase = "land" | "settle" | "steady";

export interface Targets {
  phase: Phase;
  /** Protein to reach at each meal, in grams. */
  protein: Record<Slot, number>;
  /** A daily protein range in grams, or null when targets are off (kidney disease, pregnancy). */
  proteinDay: [number, number] | null;
  /** This week's daily fibre aim on the ramp, and where the ramp ends. */
  fibreDay: number;
  fibreGoal: number;
  /** Short lines for the meal plan screen, in the app's voice. */
  notes: string[];
}

export const FIBRE_START = 15;
export const FIBRE_STEP = 5;
export const FIBRE_GOAL = 30;

export function phaseOf(weeksSinceLastDose: number): Phase {
  if (weeksSinceLastDose <= 8) return "land";
  return weeksSinceLastDose <= 26 ? "settle" : "steady";
}

export function targets(p: Profile): Targets {
  const phase = phaseOf(p.weeksSinceLastDose);
  const off = p.conditions.includes("kidney") || p.conditions.includes("pregnancy");
  const protein = { breakfast: proteinTarget("breakfast", p), lunch: proteinTarget("lunch", p), dinner: proteinTarget("dinner", p), snack: proteinTarget("snack", p) };
  // Reference weight, not current weight, for the daily range (1.0 to 1.2 g/kg; clinical lead to confirm).
  const proteinDay: [number, number] | null = off ? null
    : p.referenceWeightKg ? [Math.round(p.referenceWeightKg * (p.goal === "strength" ? 1.2 : 1.0)), Math.round(p.referenceWeightKg * (p.goal === "strength" ? 1.5 : 1.2))]
    : p.goal === "strength" ? [100, 130] : [90, 120];
  const fibreDay = Math.min(FIBRE_GOAL, FIBRE_START + FIBRE_STEP * Math.max(0, p.weeksOnPlan - 1));

  const notes: string[] = [];
  if (p.weeksSinceLastDose === 0) notes.push("While you're still on the jab, small meals with protein first are the place to start.");
  else if (phase === "land") notes.push("Your appetite may still be finding its feet. Start with a smaller plate, protein first, and have more if you're still hungry.");
  else if (phase === "settle") notes.push("Regular meals at roughly the same times make hunger easier to plan around.");
  else notes.push("The routines are yours now. Mix in new recipes whenever you fancy a change.");
  if (fibreDay < FIBRE_GOAL) notes.push(p.safeMode ? "We're adding a little more fibre each week, with plenty to drink." : `Fibre this week: about ${fibreDay} g a day, building to ${FIBRE_GOAL} g. Drink plenty as it goes up.`);
  if (p.goal === "fuller") notes.push("Meals lean on protein, fibre and veg, which tend to keep you fuller.");
  if (p.goal === "strength") notes.push("Meals lean on protein to go with your strength sessions.");
  if (p.conditions.includes("reflux")) notes.push("Dinners stay on the gentle side. Eating two to three hours before bed often helps.");
  if (p.conditions.includes("type-2-diabetes")) notes.push("Carbs stay to about a fist-sized portion. If you take insulin or gliclazide, keep your usual hypo plan to hand.");
  if (off) notes.push("Protein targets are switched off for you. Your healthcare team's advice on portions comes first.");
  return { phase, protein, proteinDay, fibreDay, fibreGoal: FIBRE_GOAL, notes };
}
