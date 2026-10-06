// The meal plan for the app: turns app state into an engine profile, and keeps this week's and next week's plans.
// The planning itself is @landing/engine, the same code the prototype runs. Every recipe is still a draft, so the app
// asks for drafts and labels them.
import { useMemo } from "react";
import type { Slot } from "@landing/content";
import { DAYS, emptyWeek, personaliseById, planWeek, profile, type Personalised, type Profile, type Week } from "@landing/engine";
import { addDays, fmt, TODAY } from "@/data/dates";
import { useApp, weekOf, type AppState } from "./store";

export const INCLUDE_DRAFTS = true;
const HUNGRY: Record<string, string> = { Morning: "morning", Lunchtime: "lunchtime", Afternoon: "afternoon", Evening: "evening", "Late night": "late-night" };

const profiles = new Map<string, Profile>();
/** The person as the engine sees them. `ahead` is 1 for next week, when they're a week further on. */
export function profileOf(s: AppState, ahead = 0): Profile {
  const f = s.food, week = Math.min(52, weekOf(s) + ahead);
  const p = {
    weeksSinceLastDose: s.ob.status === "stopped" ? week : 0,
    weeksOnPlan: Math.max(1, week - (f.joinedWeek ?? week) + 1),
    goal: s.settings.safeMode ? "steady" : f.goal, diet: f.diet, allergens: f.allergens, lactoseFree: f.lactoseFree, dislikes: [],
    aversions: f.aversions, kit: f.kit, maxMinutes: f.maxMinutes, household: f.household,
    hungryTimes: s.ob.hungryTimes.map((h) => HUNGRY[h]).filter(Boolean),
    cookNights: f.cookNights, conditions: f.conditions, cuisines: f.cuisines, budget: f.budget, safeMode: s.settings.safeMode,
  } as Profile;
  const key = JSON.stringify(p);
  if (!profiles.has(key)) profiles.set(key, profile(p));
  return profiles.get(key)!;
}

export const planKey = (s: AppState) => JSON.stringify(profileOf(s)) + "#" + s.food.seed;
const weeks = new Map<string, Week>();
/** This week's meals: the saved, edited plan if it still matches, otherwise a fresh plan for these preferences. */
export function thisWeek(s: AppState): Week {
  const key = planKey(s);
  if (s.food.plan && s.food.plan.key === key) return s.food.plan.week;
  if (!weeks.has(key)) weeks.set(key, planWeek(profileOf(s), { seed: s.food.seed, includeDrafts: INCLUDE_DRAFTS }));
  return weeks.get(key)!;
}
export function saveThisWeek(s: AppState, week: Week) { s.food.plan = { key: planKey(s), week }; }

export type Which = "this" | "next";
export const weekFor = (s: AppState, which: Which): Week | null => (which === "next" ? s.food.next?.week ?? null : thisWeek(s));
export function saveWeekFor(s: AppState, which: Which, week: Week) {
  if (which === "next") s.food.next = { from: s.food.next?.from ?? "blank", ticked: s.food.next?.ticked ?? {}, week };
  else saveThisWeek(s, week);
}
export const profileFor = (s: AppState, which: Which) => profileOf(s, which === "next" ? 1 : 0);

export function startNextWeek(s: AppState, from: "blank" | "suggested") {
  const p = profileOf(s, 1);
  s.food.next = { from, ticked: {}, week: from === "blank" ? emptyWeek(p) : planWeek(p, { seed: s.food.seed + 7, includeDrafts: INCLUDE_DRAFTS }) };
}

export const mealAt = (week: Week, day: number, slot: Slot, index = 0) => (slot === "snack" ? week.days[day].snacks[index] : week.days[day][slot]);
export const px = (s: AppState, id: string, which: Which = "this"): Personalised => personaliseById(id, profileFor(s, which));

/** Next week runs Monday 12 to Sunday 18 October in the demo. */
export const NEXT_START = addDays(TODAY, 7);
export const nextDate = (day: number) => fmt.dayMonth(addDays(NEXT_START, day));
export const dayName = (day: number) => DAYS[day];

export const SLOT_NAME: Record<Slot, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack" };
export const SLOT_TONE: Record<Slot, "butter" | "sky" | "apricot" | "sage"> = { breakfast: "butter", lunch: "sky", dinner: "apricot", snack: "sage" };

/** "32 min, 10 hands-on". Washing up isn't included. */
export function minutes(r: { total: number; handsOn: number }) {
  if (r.total <= 1) return "No cooking";
  return r.handsOn === r.total ? `${r.total} min` : `${r.total} min, ${r.handsOn} hands-on`;
}
export const proteinText = (s: AppState, g: number) => (s.settings.safeMode ? "protein-rich" : `about ${g} g protein`);

/** The profile for this week, memoised on the state. */
export function useProfile(which: Which = "this") {
  const s = useApp();
  return useMemo(() => profileFor(s, which), [s, which]);
}
