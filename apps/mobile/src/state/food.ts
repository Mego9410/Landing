// The meal plan for the app: turns app state into an engine profile, and keeps this week's and next week's plans.
// The planning itself is @landing/engine, the same code the prototype runs. Every recipe is still a draft, so the app
// asks for drafts and labels them.
import { useMemo } from "react";
import type { Slot } from "@landing/content";
import { DAYS, emptyWeek, personaliseById, planWeek, profile, setMeal, shoppingList, swapOptions, type Personalised, type PlanOptions, type Profile, type Week } from "@landing/engine";
import { addDays, daysBetween, fmt, today, weekStart } from "@/data/dates";
import { jabStopped, useApp, weekOf, weeksOnPlan, type AppState } from "./store";

// Every recipe is live in the app. Their review records stay as they are until a dietitian signs each one off.
export const INCLUDE_DRAFTS = true;
const HUNGRY: Record<string, string> = { Morning: "morning", Lunchtime: "lunchtime", Afternoon: "afternoon", Evening: "evening", "Late night": "late-night" };

const profiles = new Map<string, Profile>();
/** The person as the engine sees them. `ahead` is 1 for next week, when they're a week further on. */
export function profileOf(s: AppState, ahead = 0): Profile {
  const f = s.food, week = Math.min(52, weekOf(s) + ahead);
  const p = {
    weeksSinceLastDose: jabStopped(s) ? week : 0,
    // Uncapped, so the fibre ramp and portions keep counting for late joiners and in year two.
    weeksOnPlan: s.startedOn ? weeksOnPlan(s) + ahead : Math.max(1, week - (f.joinedWeek ?? week) + 1),
    goal: s.settings.safeMode ? "steady" : f.goal, diet: f.diet, allergens: f.allergens, lactoseFree: f.lactoseFree, dislikes: [],
    aversions: f.aversions, kit: f.kit, maxMinutes: f.maxMinutes, household: f.household,
    hungryTimes: s.ob.hungryTimes.map((h) => HUNGRY[h]).filter(Boolean),
    cookNights: f.cookNights, conditions: f.conditions, cuisines: f.cuisines, budget: f.budget, safeMode: s.settings.safeMode,
  } as Profile;
  const key = JSON.stringify(p);
  if (!profiles.has(key)) profiles.set(key, profile(p));
  return profiles.get(key)!;
}

/** This week's seed: the person's own seed mixed with the week, so every week (and every person) gets a different plan. */
export function weekSeed(s: AppState, ahead = 0) {
  const weeks = Math.round(Date.parse(`${addDays(weekStart(today()), ahead * 7)}T12:00:00Z`) / (7 * 86_400_000));
  return (Math.imul(s.food.seed ^ 0x9e3779b9, 2654435761) + Math.imul(weeks, 40503)) >>> 0;
}

/**
 * A plan belongs to its week, the preferences it was made for and the seed, so a new week gets a new plan. Habit Only
 * mode is left out, so switching it on or off keeps the week (and any meals they've changed).
 */
export const planKey = (s: AppState) => weekStart(today()) + "#" + JSON.stringify(profileOf({ ...s, settings: { ...s.settings, safeMode: false } })) + "#" + s.food.seed;
const weeks = new Map<string, Week>();
/** This week's meals: the saved, edited plan if it still matches, otherwise a fresh plan for these preferences. */
export function thisWeek(s: AppState): Week {
  const key = planKey(s);
  if (s.food.plan && s.food.plan.key === key) return s.food.plan.week;
  const cacheKey = key + JSON.stringify(planOptions(s));
  if (!weeks.has(cacheKey)) weeks.set(cacheKey, freshWeek(s));
  return weeks.get(cacheKey)!;
}

/** What the planner needs besides the profile: the seed, recent weeks (so meals rest), favourites and "not for me". */
export function planOptions(s: AppState, ahead = 0): PlanOptions {
  const f = s.food;
  return { seed: weekSeed(s, ahead), includeDrafts: INCLUDE_DRAFTS, recent: recentFor(s, ahead), favourites: f.favourites ?? [], avoid: f.notForMe ?? [] };
}

/** Recipes from the weeks before this one (or next), newest first: recent[0] is the week before. */
export function recentFor(s: AppState, ahead = 0): string[][] {
  const start = addDays(weekStart(today()), ahead * 7), out: string[][] = [[], [], [], []];
  for (const e of s.food.recent ?? []) {
    const k = Math.round(daysBetween(e.start, start) / 7);
    if (k >= 1 && k <= out.length) out[k - 1].push(...e.ids);
  }
  return out;
}

const cookedIn = (week: Week) => [...new Set(week.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner, ...d.snacks]).filter((m) => m.kind === "cook" && m.recipe).map((m) => m.recipe!))];

/** Keeps this week's recipes in the recent history (the last five weeks); older weeks go into `had`. */
function remember(s: AppState, start: string, week: Week) {
  const f = s.food;
  const recent = (f.recent ?? []).filter((e) => e.start !== start);
  recent.unshift({ start, ids: cookedIn(week) });
  recent.sort((a, b) => (a.start < b.start ? 1 : -1));
  const had = new Set(f.had ?? []);
  for (const e of recent) if (e.start < start) for (const id of e.ids) had.add(id);
  f.recent = recent.slice(0, 5);
  f.had = [...had];
}

/** Recipes they've had before this week: planned in an earlier week, or cooked along. */
function hadBefore(s: AppState): Set<string> {
  const start = weekStart(today()), out = new Set(s.food.had ?? []);
  for (const e of s.food.recent ?? []) if (e.start < start) for (const id of e.ids) out.add(id);
  return out;
}
/** A meal they've never had, once there's an earlier week to compare with. */
export function isNew(s: AppState, id: string) {
  const had = hadBefore(s);
  return had.size > 0 && !had.has(id);
}
/** Marks a recipe as had (after cooking along), so it stops showing as new. */
export function markHad(s: AppState, id: string) {
  if (!(s.food.had ?? []).includes(id)) s.food.had = [...(s.food.had ?? []), id];
}

/** "Have it again": brings a recipe back now and then, once it's rested. Calling again takes it off. */
export function toggleFavourite(s: AppState, id: string) {
  const fav = s.food.favourites ?? [];
  s.food.favourites = fav.includes(id) ? fav.filter((x) => x !== id) : [...fav, id];
  s.food.notForMe = (s.food.notForMe ?? []).filter((x) => x !== id);
}
/** "Not for me": never planned or suggested again. Calling again takes it off. */
export function toggleNotForMe(s: AppState, id: string) {
  const no = s.food.notForMe ?? [];
  s.food.notForMe = no.includes(id) ? no.filter((x) => x !== id) : [...no, id];
  s.food.favourites = (s.food.favourites ?? []).filter((x) => x !== id);
}

/** A newly made plan for this week (not saved: state/plans.ts saves it into the plan so it's backed up). */
export const freshWeek = (s: AppState) => planWeek(profileOf(s), planOptions(s));
export function saveThisWeek(s: AppState, week: Week) {
  s.food.plan = { key: planKey(s), week };
  remember(s, weekStart(today()), week);
}

/**
 * After a change of preferences, next week's meals that no longer suit (a new diet, an allergy) are swapped for the
 * best suggestion, or left empty to choose. Meals that still suit stay as they are.
 */
export function refitNext(s: AppState) {
  const nx = s.food.next;
  if (!nx) return;
  const p = profileOf(s, 1), opts = planOptions(s, 1);
  let week = nx.week;
  week.days.forEach((d) => {
    const meals: [Slot, number, string | undefined, string | undefined][] = [["breakfast", 0, d.breakfast.recipe, d.breakfast.kind], ["lunch", 0, d.lunch.recipe, d.lunch.kind], ["dinner", 0, d.dinner.recipe, d.dinner.kind], ...d.snacks.map((m, i): [Slot, number, string | undefined, string | undefined] => ["snack", i, m.recipe, m.kind])];
    for (const [slot, i, id, kind] of meals) {
      if (!id || kind === "leftover" || personaliseById(id, p).ok) continue;
      const best = swapOptions(week, p, d.day, slot, { n: 1, includeDrafts: INCLUDE_DRAFTS, seed: s.food.seed + d.day, recent: opts.recent, favourites: opts.favourites, avoid: opts.avoid })[0];
      week = setMeal(week, p, d.day, slot, best ? { recipe: best.recipe.id } : { kind: "free" }, i);
    }
  });
  s.food.next = { ...nx, week };
}
export type Which = "this" | "next";
export const weekFor = (s: AppState, which: Which): Week | null => (which === "next" ? s.food.next?.week ?? null : thisWeek(s));
export function saveWeekFor(s: AppState, which: Which, week: Week) {
  if (which === "next") s.food.next = { from: s.food.next?.from ?? "blank", ticked: s.food.next?.ticked ?? {}, week, start: s.food.next?.start ?? nextStart() };
  else saveThisWeek(s, week);
}
export const profileFor = (s: AppState, which: Which) => profileOf(s, which === "next" ? 1 : 0);

export function startNextWeek(s: AppState, from: "blank" | "suggested") {
  const p = profileOf(s, 1);
  s.food.next = { from, ticked: {}, start: nextStart(), week: from === "blank" ? emptyWeek(p) : planWeek(p, planOptions(s, 1)) };
}

export const mealAt = (week: Week, day: number, slot: Slot, index = 0) => (slot === "snack" ? week.days[day].snacks[index] : week.days[day][slot]);
export const px = (s: AppState, id: string, which: Which = "this"): Personalised => personaliseById(id, profileFor(s, which));

/** How many things are on this week's shopping list (not counting the cupboard basics). */
export const shoppingCount = (s: AppState) => shoppingList(thisWeek(s), profileFor(s, "this")).aisles.reduce((n, a) => n + a.items.length, 0);

/** Next Monday. */
export const nextStart = () => addDays(weekStart(today()), 7);
export const nextDate = (day: number) => fmt.dayMonth(addDays(nextStart(), day));
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
