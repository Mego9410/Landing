// App state: one object, saved to the phone with AsyncStorage, read with useApp(). Starts as Hannah in week 6
// (the prototype's demo) so every screen has something real to show; Settings can restart onboarding or reset.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import type { Week } from "@landing/engine";
import { habitsForWeek } from "@/data/content";
import { addDays, daysBetween, TODAY, weekdayIndex } from "@/data/dates";
import { STARTER } from "@/data/journal";

export type Hungry = "Morning" | "Lunchtime" | "Afternoon" | "Evening" | "Late night";

export interface FoodPrefs {
  goal: "steady" | "strength" | "fuller";
  diet: "none" | "vegetarian" | "vegan" | "pescatarian" | "halal" | "kosher" | "veg-no-egg" | "jain";
  allergens: string[];
  lactoseFree: boolean;
  aversions: string[];
  kit: string[];
  maxMinutes: number;
  household: number;
  cookNights: 3 | 4 | 5;
  conditions: string[];
  cuisines: string[];
  budget: 1 | 2 | 3;
  /** The week of the plan someone joined, for the fibre ramp. */
  joinedWeek: number | null;
  seed: number;
  /** This week's plan once edited, tied to the preferences and seed it came from. */
  plan: { key: string; week: Week } | null;
  ticked: Record<string, boolean>;
  /** Next week's meals, picked the week before. */
  next: { from: "blank" | "suggested"; week: Week; ticked: Record<string, boolean> } | null;
}

export interface Weight { date: string; kg: number; source: string }

/** One day's journal, kept under the day it describes. Scales run 1 to 5; fullness 1 is "Very hungry". */
export interface JournalEntry { yes: Record<string, boolean>; fullness?: number; energy?: number }

export interface AppState {
  v: 2;
  name: string;
  onboarded: boolean;
  ob: { status: "stopped" | "soon" | "on"; lastInjection: string; hungryTimes: Hungry[]; lowestWeight: number; proteinFreq: string };
  food: FoodPrefs;
  habits: { ids: string[]; done: Record<string, number>; today: Record<string, boolean>; swappedFrom: string | null };
  protein: Record<string, number>;
  weights: Weight[];
  workouts: { done: Record<string, string>; feel: string | null };
  demos: { who: string; still: boolean; ghost: boolean };
  lessonsRead: Record<number, boolean>;
  coach: { messages: { from: "you" | "coach"; text: string; redirect?: boolean }[] };
  settings: { safeMode: boolean; evening: boolean };
  scores: Record<number, number>;
  journal: { questions: string[]; entries: Record<string, JournalEntry> };
  /** When the person accepted the health information at the start, and which wording they saw. */
  disclaimer: { acceptedAt: string; version: number } | null;
}

/** Bump when the wording of the health information changes, so everyone sees and accepts it again. */
export const DISCLAIMER_VERSION = 1;
export const needsDisclaimer = (s: AppState) => !s.disclaimer || s.disclaimer.version < DISCLAIMER_VERSION;

export const FOOD_DEFAULTS: FoodPrefs = {
  goal: "steady", diet: "none", allergens: [], lactoseFree: false, aversions: [], kit: ["hob", "oven", "microwave", "kettle"],
  maxMinutes: 20, household: 1, cookNights: 4, conditions: [], cuisines: [], budget: 3, joinedWeek: null, seed: 1, plan: null, ticked: {}, next: null,
};

// The last eight weigh-ins match the prototype; earlier days follow the trend its progress chart draws.
const RECENT: [string, number, string][] = [["2026-10-05", 78.4, "Apple Health"], ["2026-10-04", 78.6, "Logged by you"], ["2026-10-03", 78.3, "Apple Health"], ["2026-10-02", 78.7, "Apple Health"], ["2026-10-01", 78.5, "Apple Health"], ["2026-09-30", 78.9, "Logged by you"], ["2026-09-29", 78.6, "Apple Health"], ["2026-09-28", 78.8, "Apple Health"]];
function seedWeights(): Weight[] {
  const out = RECENT.map(([date, kg, source]) => ({ date, kg, source }));
  for (let i = 8; i < 95; i++) {
    const v = i <= 35 ? 79.3 - 0.026 * (35 - i) + 0.22 * Math.sin(i * 1.1) + 0.12 * Math.sin(i * 0.37) : 78.2 + (i - 35) * 0.07 + 0.2 * Math.sin(i * 0.9);
    out.push({ date: addDays(TODAY, -i), kg: Math.round(v * 10) / 10, source: i % 4 === 1 ? "Logged by you" : "Apple Health" });
  }
  return out;
}

// About six weeks of Hannah's journal, leaving yesterday for her to fill in. The answers lean on her weigh-ins so the
// insights show the patterns people usually see: drinks and eating out before a higher morning, sleep and protein
// before fuller days. Seeded, so the demo is the same every time.
function seedJournal(weights: Weight[]): Record<string, JournalEntry> {
  const kg: Record<string, number> = Object.fromEntries(weights.map((w) => [w.date, w.kg]));
  let r = 11;
  const rand = () => (r = (r * 16807) % 2147483647) / 2147483647;
  const scale = (v: number) => Math.max(1, Math.min(5, Math.round(v)));
  const rise = (day: string) => (kg[day] != null && kg[addDays(day, 1)] != null ? kg[addDays(day, 1)] - kg[day] : 0);
  const days = Array.from({ length: 42 }, (_, i) => addDays(TODAY, -(i + 2))).filter((_, i) => i % 9 !== 3); // a few days missed, as happens
  const sorted = days.map(rise).sort((a, b) => a - b), q = (p: number) => sorted[Math.floor(p * (sorted.length - 1))];
  const out: Record<string, JournalEntry> = {};
  for (const day of days) {
    const up = rise(day), weekend = weekdayIndex(day) >= 4;
    const drink = rand() < (up >= q(0.7) ? 0.8 : weekend ? 0.15 : 0.05);
    const out_ = rand() < (up >= q(0.6) ? 0.55 : weekend ? 0.2 : 0.08);
    const late = rand() < (up >= q(0.5) ? 0.5 : 0.2) || (drink && rand() < 0.5);
    const sleep7 = rand() < (drink ? 0.35 : 0.7), stress = rand() < (weekend ? 0.15 : 0.35);
    const breakfastProtein = rand() < 0.65, steps = rand() < (weekend ? 0.7 : 0.45);
    out[day] = {
      yes: { sleep7, breakfastProtein, late, drink, out: out_, steps, stress },
      fullness: scale(3 + (sleep7 ? 0.5 : -0.6) + (breakfastProtein ? 0.6 : -0.4) + (stress ? -0.5 : 0) + (rand() - 0.5) * 1.2),
      energy: scale(3 + (sleep7 ? 0.7 : -0.6) + (steps ? 0.5 : -0.2) + (drink ? -0.4 : 0) + (stress ? -0.4 : 0) + (rand() - 0.5) * 1.2),
    };
  }
  return out;
}

export function demoState(): AppState {
  const weights = seedWeights();
  return {
    v: 2, name: "Hannah", onboarded: true,
    ob: { status: "stopped", lastInjection: "2026-08-31", hungryTimes: ["Afternoon", "Evening"], lowestWeight: 78.0, proteinFreq: "Some meals" },
    food: { ...FOOD_DEFAULTS, household: 2, joinedWeek: 4 },
    habits: { ids: ["protein", "strength", "pause"], done: { protein: 4, strength: 1, pause: 2 }, today: { protein: true }, swappedFrom: null },
    protein: { Breakfast: 30, Lunch: 34 },
    weights,
    workouts: { done: { A: "Thursday" }, feel: null },
    demos: { who: "mix", still: false, ghost: true },
    lessonsRead: {},
    coach: { messages: [
      { from: "you", text: "Should I go back on a lower dose?" },
      { from: "coach", redirect: true, text: "That's a decision for your prescriber, so I can't help with doses. I can make a one-page summary of your trend and habits to take with you." },
      { from: "you", text: "Yes please. And a quick high-protein lunch?" },
      { from: "coach", text: "Greek yoghurt, berries and a handful of nuts gets you about 30 g in two minutes. Want a savoury one too?" },
    ] },
    settings: { safeMode: false, evening: false },
    scores: { 2: 64, 3: 70, 4: 72, 5: 78 },
    journal: { questions: STARTER, entries: seedJournal(weights) },
    disclaimer: null,
  };
}

/** A fresh start for onboarding: today's weigh-in only, nothing logged. */
export function freshState(): AppState {
  const s = demoState();
  return { ...s, onboarded: false, protein: {}, weights: s.weights.filter((w) => w.date === TODAY), workouts: { done: {}, feel: null },
    habits: { ids: [], done: {}, today: {}, swappedFrom: null }, coach: { messages: [] }, food: { ...FOOD_DEFAULTS }, lessonsRead: {},
    journal: { questions: STARTER, entries: {} }, disclaimer: null };
}

/* ---------- the store ---------- */
const KEY = "landing-app-v2";
let state: AppState = demoState();
let hydrated = false;
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | undefined;

function emit() { listeners.forEach((l) => l()); }
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {}); }, 250);
}

/** Changes state with a function that edits a copy. */
export function set(fn: (s: AppState) => void) {
  const next: AppState = JSON.parse(JSON.stringify(state));
  fn(next);
  state = next;
  save();
  emit();
}
export function replace(next: AppState) { state = next; save(); emit(); }
export const get = () => state;

export function useApp(): AppState {
  return useSyncExternalStore((l) => { listeners.add(l); return () => { listeners.delete(l); }; }, () => state, () => state);
}

/** Loads the saved state once, before the first screen shows. */
export async function hydrate(): Promise<void> {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as AppState;
      if (saved && saved.v === 2) state = { ...demoState(), ...saved, food: { ...FOOD_DEFAULTS, ...saved.food } };
    }
  } catch {
    // A broken save shouldn't stop the app opening: carry on with the demo.
  }
  hydrated = true;
  emit();
}

/* ---------- derived values ---------- */
export const weekOf = (s: AppState) => Math.max(1, Math.min(52, Math.floor(daysBetween(s.ob.lastInjection, TODAY) / 7) + 1));
export function setWeek(s: AppState, week: number) {
  s.ob.lastInjection = addDays(TODAY, -((week - 1) * 7));
  const ids = habitsForWeek(week);
  s.habits = { ids, done: Object.fromEntries(ids.map((id) => [id, 0])), today: {}, swappedFrom: null };
}
export const proteinToday = (s: AppState) => Object.values(s.protein).reduce((a, b) => a + (+b || 0), 0);
export function avg7(s: AppState, end = TODAY): number | null {
  const vals = s.weights.filter((w) => { const n = daysBetween(w.date, end); return n >= 0 && n < 7; }).map((w) => w.kg);
  return vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : null;
}
export const steadyZone = (s: AppState): [number, number] => [s.ob.lowestWeight, Math.round(s.ob.lowestWeight * 1.02 * 10) / 10];
