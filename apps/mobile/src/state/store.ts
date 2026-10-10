// App state: one object, saved to the phone with AsyncStorage, read with useApp(). A new install starts empty at the
// health information and onboarding. Demo mode (Hannah, six weeks in, with a month of history) is for previews and
// App Review, and is switched on from a hidden control on the welcome screen.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import type { Week } from "@landing/engine";
import { habitsForWeek, OWN_HABITS, phaseOf, type Phase, type PhaseKey } from "@/data/content";
import { addDays, daysBetween, today, weekDates, weekdayIndex, weekStart } from "@/data/dates";
import { STARTER } from "@/data/journal";
import { REMINDER_DEFAULTS, type Reminders } from "@/data/reminders";
import type { Program } from "@/data/program";

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
  /** Set once this person has their own random seed (new installs used to share seed 1). */
  seeded?: boolean;
  /** This week's plan once edited, tied to the preferences and seed it came from. */
  plan: { key: string; week: Week } | null;
  ticked: Record<string, boolean>;
  /** Next week's meals, picked the week before. */
  next: { from: "blank" | "suggested"; week: Week; ticked: Record<string, boolean>; /** The Monday it starts. */ start?: string } | null;
  /** Recipes planned in recent weeks, newest first, so meals rest before they come back. */
  recent?: { start: string; ids: string[] }[];
  /** Every recipe planned in an earlier week or cooked along, for the "New to you" tag. */
  had?: string[];
  /** "Have it again": recipes that come back now and then. */
  favourites?: string[];
  /** "Not for me": recipes never planned again. */
  notForMe?: string[];
}

export interface Weight { date: string; kg: number; source: string }

/** One day's journal, kept under the day it describes. Scales run 1 to 5; fullness 1 is "Very hungry". */
export interface JournalEntry { yes: Record<string, boolean>; fullness?: number; energy?: number }

/** What happened on one day. Kept by date, so weekly totals and the steady score are worked out from these. */
export interface DayLog {
  /** Grams of protein by meal: Breakfast, Lunch, Dinner, Snack. */
  protein?: Record<string, number>;
  /** Habits ticked that day. */
  habits?: Record<string, boolean>;
  /** Strength sessions finished that day. */
  sessions?: ("A" | "B")[];
  /** Meals logged without grams (Habit Only mode). Each counts as a protein entry, with no number kept. */
  meals?: string[];
}

export type Units = "kg" | "stlb";

export type Theme = "system" | "light" | "dark";

export interface AppState {
  v: 3;
  name: string;
  onboarded: boolean;
  /** The day onboarding finished: the check-in about "yesterday" starts the day after. */
  startedOn: string | null;
  /** Demo mode: Hannah's dummy data and the preview controls in Settings. Off for real people. */
  demo: boolean;
  /** The last day the app was open, so a new day or week can be noticed. */
  lastSeen: string;
  ob: { status: "stopped" | "soon" | "on"; lastInjection: string; hungryTimes: Hungry[]; lowestWeight: number; proteinFreq: string };
  food: FoodPrefs;
  /** The week's habits. `week` is the plan week they belong to; a swap lasts until the week changes. */
  habits: { week: number; ids: string[]; swappedFrom: string | null };
  days: Record<string, DayLog>;
  weights: Weight[];
  workouts: { feel: string | null };
  demos: { who: string; still: boolean; ghost: boolean };
  lessonsRead: Record<number, boolean>;
  coach: { messages: { from: "you" | "coach"; text: string; redirect?: boolean }[] };
  settings: { safeMode: boolean; /** Light, dark, or follow the phone (the default). */ theme?: Theme; units: Units; reminders: Reminders; appleHealth: boolean; /** The reminder two days before a free trial ends; on unless turned off on the paywall. */ trialReminder?: boolean };
  journal: { questions: string[]; entries: Record<string, JournalEntry> };
  /** When the person accepted the health information at the start, and which wording they saw. */
  disclaimer: { acceptedAt: string; version: number } | null;
  /** The health check: answers by question, when and which wording; whether they've checked with their GP; and, for
   *  pregnancy or kidney disease, when they ticked the box to carry on. */
  health: { answers: Record<string, boolean>; checkedAt: string | null; version: number; gpCleared: boolean; referAgreed: { at: string; version: number } | null };
  /** Explicit consent to keep health information (weight, eating, check-ins): when it was given, which wording
   *  (CONSENT_VERSION), and, if they've since withdrawn it for the backup, when (the app then keeps working on this
   *  phone only, and nothing is uploaded). */
  consent: { healthDataAt: string; version?: string; backupOffAt?: string | null } | null;
  /** The last known subscription status, so the app opens offline. Only used when billing is on. `until` is when the
   *  trial ends or the plan renews (or ends, if `willRenew` is false). */
  subscription: { active: boolean; checkedAt: string; plan?: "yearly" | "monthly" | null; trial?: boolean; until?: string | null; willRenew?: boolean; /** Had the plan before and it has ended (not just never subscribed). */ ended?: boolean } | null;
  /** Onboarding answers that shape the plan's wording and later nudges (src/state/onboarding.ts). */
  story: Story;
  /** Their own strength programme: built from their answers and seed, a block per eight weeks, saved so it's backed up
   *  and stays the same across app updates (data/program.ts, state/plans.ts). */
  program?: Program | null;
  /** The phase whose start has been celebrated on Today (or that someone started in), so each change shows once. */
  phaseSeen?: PhaseKey | null;
  /** The habit they chose in place of "Your own routine" (Steady and year two). */
  ownHabit?: string | null;
  /** Lessons opened, by key ("w12", "r3", "y5"; see lessonForWeek). Older saves only have `lessonsRead`. */
  lessonKeys?: Record<string, boolean>;
  /** The last month on the plan whose look-back card was closed, so each shows once. */
  lookBackSeen?: number;
  /** When this copy last changed, so the newer of two copies wins when a backup and a phone disagree. */
  savedAt?: string;
}

/** Where someone is with the jab, from onboarding. Sets `ob.status` too. */
export type Where = "on" | "tapering" | "recent" | "while" | "break";
export interface Story {
  where: Where | null;
  /** What brought them here, how they feel, and what they most want to hold on to: option ids, up to three for `matters`. */
  why: string[];
  feel: string[];
  matters: string[];
  /** When food noise gets loud, and the first thing they'll try then (an if-then plan). */
  foodNoise: string[];
  ifThen: string | null;
  /** How weight shows: as numbers, as a trend only, or not at all (which is safe mode). */
  weightView: "show" | "trend" | "hide";
  strengthAt: "home" | "gym";
  /** Extra kit at home for strength sessions: band, dumbbells, kettlebell. */
  kit?: string[];
  /** Their answer to the first check-in, "how are you feeling this morning?". */
  mood: string | null;
  /** Which welcome screen they saw (A/B test), and when they made their promise, if they did. */
  welcome: "A" | "B" | "C" | null;
  promisedAt: string | null;
}
export const STORY_DEFAULTS: Story = { where: null, why: [], feel: [], matters: [], foodNoise: [], ifThen: null, weightView: "show", strengthAt: "home", mood: null, welcome: null, promisedAt: null };

export const HEALTH_DEFAULTS: AppState["health"] = { answers: {}, checkedAt: null, version: 0, gpCleared: false, referAgreed: null };

/** Bump when the wording of the health information changes, so everyone sees and accepts it again. */
export const DISCLAIMER_VERSION = 1;
/** The health-information consent wording people agree to (app/consent.tsx). Recorded on the server with each backup. */
export const CONSENT_VERSION = "health-v1";
/** Health information may be backed up only with consent that hasn't been withdrawn for the backup. */
export const backupAllowed = (s: Pick<AppState, "consent">) => !!s.consent && !s.consent.backupOffAt;
export const needsDisclaimer = (s: AppState) => !s.disclaimer || s.disclaimer.version < DISCLAIMER_VERSION;

export const FOOD_DEFAULTS: FoodPrefs = {
  goal: "steady", diet: "none", allergens: [], lactoseFree: false, aversions: [], kit: ["hob", "oven", "microwave", "kettle"],
  maxMinutes: 20, household: 1, cookNights: 4, conditions: [], cuisines: [], budget: 3, joinedWeek: null, seed: 1, plan: null, ticked: {}, next: null,
};

// Hannah's weigh-ins: a gentle settle over the last month after a slow climb, with day-to-day wobble.
function seedWeights(t: string): Weight[] {
  const out: Weight[] = [];
  for (let i = 0; i < 95; i++) {
    const v = i <= 35 ? 78.5 + 0.22 * Math.sin(i * 1.1) + 0.12 * Math.sin(i * 0.37) + (i > 7 ? 0.025 * (i - 7) : 0)
      : 79.2 - (i - 35) * 0.016 + 0.2 * Math.sin(i * 0.9);
    out.push({ date: addDays(t, -i), kg: Math.round(v * 10) / 10, source: i % 4 === 1 ? "Logged by you" : "Apple Health" });
  }
  return out;
}

// Three weeks of logs before today, plus this week so far: most habits most days, two sessions a week.
function seedDays(t: string, ids: string[]): Record<string, DayLog> {
  const out: Record<string, DayLog> = {};
  let r = 5;
  const rand = () => (r = (r * 16807) % 2147483647) / 2147483647;
  for (let i = 1; i <= 21 + weekdayIndex(t); i++) {
    const day = addDays(t, -i), wd = weekdayIndex(day), log: DayLog = { habits: {} };
    for (const id of ids) if (rand() < (id === "protein" ? 0.6 : 0.4)) log.habits![id] = true;
    // Sessions in earlier weeks; this week's are still to come, so Strength A is up next.
    if ((wd === 1 || wd === 4) && day < weekStart(t)) log.sessions = [wd === 1 ? "A" : "B"];
    log.protein = { Breakfast: 22 + Math.round(rand() * 12), Lunch: 25 + Math.round(rand() * 12), Dinner: 30 + Math.round(rand() * 10) };
    out[day] = log;
  }
  // Today so far: protein logged past the 100 g mark, habits still to tick.
  out[t] = { protein: { Breakfast: 30, Lunch: 34, Snack: 38 }, habits: {} };
  return out;
}

// About six weeks of Hannah's journal, up to yesterday. The answers lean on her weigh-ins so the
// insights show the patterns people usually see: drinks and eating out before a higher morning, sleep and protein
// before fuller days. Seeded, so the demo is the same every time.
function seedJournal(t: string, weights: Weight[]): Record<string, JournalEntry> {
  const kg: Record<string, number> = Object.fromEntries(weights.map((w) => [w.date, w.kg]));
  let r = 11;
  const rand = () => (r = (r * 16807) % 2147483647) / 2147483647;
  const scale = (v: number) => Math.max(1, Math.min(5, Math.round(v)));
  const rise = (day: string) => (kg[day] != null && kg[addDays(day, 1)] != null ? kg[addDays(day, 1)] - kg[day] : 0);
  // Yesterday is logged too, so the check-in shows as done. A few days are missed, as happens.
  const days = Array.from({ length: 42 }, (_, i) => addDays(t, -(i + 1))).filter((_, i) => i % 9 !== 4);
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

/** Hannah, six weeks after her last injection, with a month of history: for previews, App Review and testing. */
export function demoState(): AppState {
  // Week 6's habits, with a walk after dinner as the third (a swap Hannah made), so Today shows a realistic mix.
  const t = today(), weights = seedWeights(t), ids = habitsForWeek(6).map((id, i) => (i === 2 ? "walk" : id));
  return {
    v: 3, name: "Hannah", onboarded: true, startedOn: addDays(t, -35), demo: true, lastSeen: t,
    ob: { status: "stopped", lastInjection: addDays(weekStart(t), -35), hungryTimes: ["Afternoon", "Evening"], lowestWeight: 78.0, proteinFreq: "Some meals" },
    food: { ...FOOD_DEFAULTS, household: 2, joinedWeek: 4 },
    habits: { week: 6, ids, swappedFrom: null },
    days: seedDays(t, ids),
    weights,
    workouts: { feel: null },
    demos: { who: "mix", still: false, ghost: true },
    lessonsRead: {},
    coach: { messages: [
      { from: "you", text: "Should I go back on a lower dose?" },
      { from: "coach", redirect: true, text: "That's a decision for your prescriber, so I can't help with doses. I can make a one-page summary of your trend and habits to take with you." },
      { from: "you", text: "Yes please. And a quick high-protein lunch?" },
      { from: "coach", text: "Greek yoghurt, berries and a handful of nuts gets you about 30 g in two minutes. Want a savoury one too?" },
    ] },
    settings: { safeMode: false, units: "kg", reminders: REMINDER_DEFAULTS, appleHealth: false },
    journal: { questions: STARTER, entries: seedJournal(t, weights) },
    disclaimer: null,
    health: { ...HEALTH_DEFAULTS, checkedAt: addDays(t, -35), version: 1 },
    consent: { healthDataAt: addDays(t, -35) },
    subscription: null,
    story: { ...STORY_DEFAULTS },
  };
}

/** A new person: nothing logged, straight to onboarding. */
export function freshState(): AppState {
  const t = today();
  return {
    v: 3, name: "", onboarded: false, startedOn: null, demo: false, lastSeen: t,
    ob: { status: "stopped", lastInjection: addDays(weekStart(t), -35), hungryTimes: [], lowestWeight: 0, proteinFreq: "Some meals" },
    food: { ...FOOD_DEFAULTS },
    habits: { week: 1, ids: [], swappedFrom: null },
    days: {}, weights: [], workouts: { feel: null },
    demos: { who: "mix", still: false, ghost: true },
    lessonsRead: {}, coach: { messages: [] },
    settings: { safeMode: false, units: "kg", reminders: REMINDER_DEFAULTS, appleHealth: false },
    journal: { questions: STARTER, entries: {} },
    disclaimer: null,
    health: { ...HEALTH_DEFAULTS },
    consent: null,
    subscription: null,
    story: { ...STORY_DEFAULTS },
  };
}

/* ---------- the store ---------- */
// Named before the app was renamed to Steadie. Never change it: everyone's saved plan is under this key. The saved
// object carries its own version.
export const STORAGE_KEY = "landing-app-v2";
const KEY = STORAGE_KEY;
let state: AppState = freshState();
let hydrated = false;
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | undefined;

function emit() { listeners.forEach((l) => l()); }
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {}); }, 250);
}

/** Changes state with a function that edits a copy. `quiet` is for housekeeping the app does by itself (a new day, the
 *  subscription check): it's saved, but doesn't count as a change, so it can't make an older copy look newer than a
 *  backup made since. */
export function set(fn: (s: AppState) => void, { quiet = false }: { quiet?: boolean } = {}) {
  const next: AppState = JSON.parse(JSON.stringify(state));
  fn(next);
  if (!quiet) next.savedAt = new Date().toISOString();
  state = next;
  save();
  emit();
}
export function replace(next: AppState) { state = next; save(); emit(); }
export const get = () => state;
/** Calls back after every change, for the backup. */
export function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; }

export function useApp(): AppState {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

/** Brings an older save up to date. Version 2 kept today's ticks without dates, so those are dropped. */
export function migrate(saved: Record<string, unknown>): AppState | null {
  if (!saved || typeof saved !== "object") return null;
  const base = freshState();
  if (saved.v === 3) {
    const s = saved as unknown as AppState;
    return { ...base, ...s, food: { ...FOOD_DEFAULTS, ...s.food }, settings: { ...base.settings, ...s.settings }, health: { ...HEALTH_DEFAULTS, ...s.health }, story: { ...STORY_DEFAULTS, ...s.story } };
  }
  if (saved.v === 2) {
    const old = saved as Record<string, any>;
    const wasDemo = old.name === "Hannah";
    const start = wasDemo ? demoState() : base;
    return {
      ...start,
      name: old.name ?? start.name, onboarded: !!old.onboarded,
      ob: { ...start.ob, ...old.ob }, food: { ...FOOD_DEFAULTS, ...old.food, plan: null, next: null },
      weights: Array.isArray(old.weights) ? old.weights : start.weights,
      demos: { ...start.demos, ...old.demos }, lessonsRead: old.lessonsRead ?? {}, coach: old.coach ?? start.coach,
      settings: { ...start.settings, safeMode: !!old.settings?.safeMode },
      journal: old.journal ?? start.journal, disclaimer: old.disclaimer ?? null,
      // Earlier versions had no health check: real people are asked it on their next visit.
    };
  }
  return null;
}

/** Loads the saved state once, before the first screen shows. With no save, a new person starts at onboarding. */
export async function hydrate(): Promise<void> {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const next = raw ? migrate(JSON.parse(raw)) : null;
    if (next) state = next;
  } catch {
    // A broken save shouldn't stop the app opening: start fresh rather than crash.
  }
  hydrated = true;
  emit();
}

/* ---------- derived values ---------- */
/** Calendar weeks (Monday to Sunday) from the week of the last injection, uncapped: 0 or less while it's still to come,
 *  53 and on in year two. */
export const jabWeek = (s: AppState, on = today()) => Math.floor(daysBetween(weekStart(s.ob.lastInjection), weekStart(on)) / 7) + 1;
/** The plan week, 1 to 52, for the year's content. Week 1 before the last jab, and 52 after the year. */
export const weekOf = (s: AppState, on = today()) => Math.max(1, Math.min(52, jabWeek(s, on)));
/** The last jab is still to come: the weeks of getting ready. */
export const gettingReady = (s: AppState, on = today()) => s.ob.lastInjection > on;
/** Whole weeks until the last jab, at least 1, while getting ready. */
export const weeksToLastJab = (s: AppState, on = today()) => Math.max(1, Math.ceil(daysBetween(on, s.ob.lastInjection) / 7));
/** The last jab has happened, whether they said so or the planned date has passed. */
export const jabStopped = (s: AppState, on = today()) => s.ob.status === "stopped" || !gettingReady(s, on);
/** The week of year two (1 is week 53), or 0 before it. */
export const yearTwoWeek = (s: AppState, on = today()) => Math.max(0, jabWeek(s, on) - 52);
/** Where someone is now: getting ready, Land, Settle, Steady or year two. */
export const stageOf = (s: AppState, on = today()): Phase => (gettingReady(s, on) ? phaseOf(0) : phaseOf(jabWeek(s, on)));
/** A short label for where someone is: "Getting ready", "Week 12 of 52" or "Year two, week 3". */
export const stageLabel = (s: AppState, on = today()) =>
  gettingReady(s, on) ? "Getting ready" : yearTwoWeek(s, on) ? `Year two, week ${yearTwoWeek(s, on)}` : `Week ${weekOf(s, on)} of 52`;
/** Weeks since they started the plan, uncapped (week 1 is their first). Counted from the day onboarding finished; older
 *  saves without it count from the plan week they joined, or else from the last jab. */
export function weeksOnPlan(s: AppState, on = today()) {
  if (s.startedOn) return Math.max(1, Math.floor(daysBetween(weekStart(s.startedOn), weekStart(on)) / 7) + 1);
  return Math.max(1, jabWeek(s, on) - (s.food.joinedWeek ?? 1) + 1);
}
/** Whole four-week months on the plan so far: 0 in the first four weeks, 1 from week 5, and so on. */
export const monthOnPlan = (s: AppState, on = today()) => Math.floor((weeksOnPlan(s, on) - 1) / 4);
/** This week's habits: the plan's, with their own pick in place of "Your own routine". `week` changes every calendar
 *  week (getting ready and year two included), so a swap ends when the week does. */
export function habitsNow(s: AppState, on = today()): { week: number; ids: string[] } {
  const week = jabWeek(s, on), ids = habitsForWeek(week), own = s.ownHabit;
  if (own && ids[0] === "ownRoutine") {
    ids[0] = own;
    if (ids[2] === own) ids[2] = OWN_HABITS.find((id) => !ids.includes(id)) ?? "pause";
  }
  return { week, ids };
}
export function setWeek(s: AppState, week: number) {
  s.ob.lastInjection = addDays(weekStart(today()), -((week - 1) * 7));
  s.habits = { ...habitsNow(s), swappedFrom: null };
}
/** Sets the last jab's date (or when it's planned). A date today or earlier means they've stopped; a later one, soon. */
export function setLastJab(s: AppState, date: string) {
  s.ob.lastInjection = date;
  if (date <= today()) s.ob.status = "stopped";
  else if (s.ob.status === "stopped") s.ob.status = "soon";
  s.habits = { ...habitsNow(s), swappedFrom: null };
}

export const dayLog = (s: AppState, day = today()): DayLog => s.days[day] ?? {};
const sum = (r: Record<string, number> | undefined) => Object.values(r ?? {}).reduce((a, b) => a + (+b || 0), 0);
export const proteinOn = (s: AppState, day = today()) => sum(dayLog(s, day).protein);
export const proteinToday = (s: AppState) => proteinOn(s);
/** Meals with protein logged, with or without grams. */
export const mealsLogged = (s: AppState, day = today()) => new Set([...Object.keys(dayLog(s, day).protein ?? {}), ...(dayLog(s, day).meals ?? [])]).size;

/** Sessions finished in the week a date falls in, in the order they were done. */
export function sessionsInWeek(s: AppState, on = today()): ("A" | "B")[] {
  return weekDates(on).filter((d) => d <= on).flatMap((d) => dayLog(s, d).sessions ?? []);
}
/** Days in the week (up to `on`) with a habit ticked. */
export const habitDays = (s: AppState, id: string, on = today()) => weekDates(on).filter((d) => d <= on && dayLog(s, d).habits?.[id]).length;

export function avg7(s: AppState, end = today()): number | null {
  const vals = s.weights.filter((w) => { const n = daysBetween(w.date, end); return n >= 0 && n < 7; }).map((w) => w.kg);
  return vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : null;
}
/** The weight the steady zone starts from: the lowest weight they gave in onboarding, or else their first weigh-in. */
export function steadyBase(s: AppState): number | null {
  if (s.ob.lowestWeight) return s.ob.lowestWeight;
  const first = [...s.weights].sort((a, b) => (a.date < b.date ? -1 : 1))[0];
  return first ? first.kg : null;
}
/** Up to 2% above the base: day-to-day changes inside it are mostly water. */
export const steadyZone = (s: AppState): [number, number] => { const b = steadyBase(s) ?? 0; return [b, Math.round(b * 1.02 * 10) / 10]; };
