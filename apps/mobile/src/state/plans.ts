// Each person's own plans, made once and kept: a random seed of their own for meals and for strength, this week's meal
// plan saved into the plan (rather than worked out again each time the app opens), and the strength programme's current
// block. Everything here lives in the app state, so it's on the phone, in "Export my data", and in the backup when
// they're signed in. Called when onboarding finishes and whenever the day changes (state/rollover.ts).
import { HABITS } from "@/data/content";
import { addDays, today, weekDates, weekStart } from "@/data/dates";
import { lessonForWeek, type LessonPick } from "@/data/lessons";
import { blockOf, withBlock, type ProgramInput } from "@/data/program";
import { freshWeek, planKey, saveThisWeek } from "./food";
import { sessionTarget } from "./habits";
import { insights, type Insight } from "./journal";
import { weekScore } from "./score";
import { dayLog, gettingReady, jabWeek, monthOnPlan, weeksOnPlan, type AppState } from "./store";

/** A random 31-bit seed. Not secret, so Math.random is fine. */
const newSeed = () => (Math.floor(Math.random() * 0x7fffffff) + 1) >>> 0;

export function programInput(s: AppState): ProgramInput {
  return { at: s.story.strengthAt, kit: s.story.kit ?? [], answers: s.health.answers, perWeek: Math.max(sessionTarget(s), s.settings.reminders.sessions.days.length >= 3 ? 3 : 2) };
}

/** Gives a new person their own meal and strength seeds at the very start, so everything previewed during onboarding is
 *  exactly what they get. Keeps any seeds they already have. */
export function seedPlans(st: AppState) {
  if (!st.food.seeded) { st.food.seed = newSeed(); st.food.seeded = true; st.food.plan = null; }
  if (!st.program) st.program = { v: 1, seed: newSeed(), inputs: "", builtAt: new Date().toISOString(), blocks: [] };
}

// Weeks on the plan count on past week 52 (and from the start, for anyone who joined late), so the strength
// programme keeps moving to new blocks.
export { weeksOnPlan };

/** Makes sure this person has their own seeds, this week's meals saved, and the strength block for now built. Edits `st`
 *  in place (call inside set()). Changes nothing once all of that is in place. */
export function ensurePlans(st: AppState) {
  if (!st.onboarded) return;
  if (!st.food.seeded) { st.food.seed = newSeed(); st.food.seeded = true; st.food.plan = null; }
  if (!st.food.plan || st.food.plan.key !== planKey(st)) saveThisWeek(st, freshWeek(st));
  st.program = withBlock(st.program ?? null, programInput(st), st.program?.seed ?? newSeed(), blockOf(weeksOnPlan(st)));
}

/** True if ensurePlans would change anything (so callers can skip a save when nothing is due). */
export function plansDue(s: AppState) {
  if (!s.onboarded) return false;
  if (!s.food.seeded || !s.food.plan || s.food.plan.key !== planKey(s)) return true;
  const p = s.program;
  if (!p) return true;
  const fresh = withBlock(p, programInput(s), p.seed, blockOf(weeksOnPlan(s)));
  return fresh !== p;
}

/** This week's lesson: a getting-ready one before the last jab, the plan week's, or year two's (new or a refresher). */
export const lessonNow = (s: AppState, on = today()): LessonPick =>
  gettingReady(s, on) ? lessonForWeek(0, weeksOnPlan(s, on)) : lessonForWeek(jabWeek(s, on));

/** Read already: by key, or for plan weeks, in the older by-week record too. */
export const lessonRead = (s: AppState, key: string) => !!s.lessonKeys?.[key] || (key[0] === "w" && !!s.lessonsRead[Number(key.slice(1))]);

/** Marks a lesson read (call inside set()). */
export function markLessonRead(st: AppState, key: string) {
  st.lessonKeys = { ...st.lessonKeys, [key]: true };
  if (key[0] === "w") st.lessonsRead[Number(key.slice(1))] = true;
}

export interface LookBack {
  month: number; checkIns: number; sessions: number;
  /** The habit ticked on the most days, and how many. */
  kept: { id: string; label: string; days: number } | null;
  /** Steady scores for the four weeks, oldest first (null for a week with nothing logged). */
  scores: (number | null)[];
  /** The clearest pattern from the check-ins, if there is one yet. Weight is left out in Habit Only mode. */
  pattern: Insight | null;
}

/** The four weeks before this one, for the month's look-back. */
export function lookBack(s: AppState, on = today()): LookBack {
  const mondays = [4, 3, 2, 1].map((n) => addDays(weekStart(on), -7 * n));
  const days = mondays.flatMap((m) => weekDates(m));
  const counts: Record<string, number> = {};
  for (const d of days) for (const [id, on_] of Object.entries(dayLog(s, d).habits ?? {})) if (on_ && HABITS[id] && HABITS[id].kind !== "sessions") counts[id] = (counts[id] ?? 0) + 1;
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return {
    month: monthOnPlan(s, on),
    checkIns: days.filter((d) => s.journal.entries[d]).length,
    sessions: days.reduce((n, d) => n + (dayLog(s, d).sessions?.length ?? 0), 0),
    kept: top ? { id: top[0], label: HABITS[top[0]].label, days: top[1] } : null,
    scores: mondays.map((m) => weekScore(s, m)?.score ?? null),
    pattern: insights(s).ready.find((i) => i.lead) ?? null,
  };
}

/** The look-back card shows in the first week of each new four-week month on the plan, until it's closed. */
export const lookBackDue = (s: AppState, on = today()) => {
  const m = monthOnPlan(s, on);
  return m >= 1 && (weeksOnPlan(s, on) - 1) % 4 === 0 && (s.lookBackSeen ?? 0) < m;
};
