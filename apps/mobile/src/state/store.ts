// App state: one object, saved to the phone with AsyncStorage, read with useApp(). Starts as Hannah in week 6
// (the prototype's demo) so every screen has something real to show; Settings can restart onboarding or reset.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import type { Week } from "@landing/engine";
import { habitsForWeek } from "@/data/content";
import { addDays, daysBetween, TODAY } from "@/data/dates";

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
}

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

export function demoState(): AppState {
  return {
    v: 2, name: "Hannah", onboarded: true,
    ob: { status: "stopped", lastInjection: "2026-08-31", hungryTimes: ["Afternoon", "Evening"], lowestWeight: 78.0, proteinFreq: "Some meals" },
    food: { ...FOOD_DEFAULTS, household: 2, joinedWeek: 4 },
    habits: { ids: ["protein", "strength", "pause"], done: { protein: 4, strength: 1, pause: 2 }, today: { protein: true }, swappedFrom: null },
    protein: { Breakfast: 30, Lunch: 34 },
    weights: seedWeights(),
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
  };
}

/** A fresh start for onboarding: today's weigh-in only, nothing logged. */
export function freshState(): AppState {
  const s = demoState();
  return { ...s, onboarded: false, protein: {}, weights: s.weights.filter((w) => w.date === TODAY), workouts: { done: {}, feel: null },
    habits: { ids: [], done: {}, today: {}, swappedFrom: null }, coach: { messages: [] }, food: { ...FOOD_DEFAULTS }, lessonsRead: {} };
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
