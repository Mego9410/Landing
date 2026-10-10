// Each person's own plans, made once and kept: a random seed of their own for meals and for strength, this week's meal
// plan saved into the plan (rather than worked out again each time the app opens), and the strength programme's current
// block. Everything here lives in the app state, so it's on the phone, in "Export my data", and in the backup when
// they're signed in. Called when onboarding finishes and whenever the day changes (state/rollover.ts).
import { blockOf, withBlock, type ProgramInput } from "@/data/program";
import { freshWeek, planKey, saveThisWeek } from "./food";
import { sessionTarget } from "./habits";
import { weekOf, type AppState } from "./store";

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

/** Weeks since they started the plan (week 1 is their first). */
export const weeksOnPlan = (s: AppState) => Math.max(1, weekOf(s) - (s.food.joinedWeek ?? weekOf(s)) + 1);

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
