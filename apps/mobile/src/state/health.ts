// What the health check's answers change in the app (movement plan §4.2). Answers set preferences and pause things;
// they never lock anyone out, and the app never gives medical advice about them.
import type { Condition } from "@landing/engine";
import { daysBetween, today } from "@/data/dates";
import { HEALTH_QUESTIONS, HEALTH_VERSION, NOTES, RECHECK_DAYS } from "@/data/health";
import type { AppState } from "./store";

const yes = (s: AppState, id: string) => !!s.health.answers[id];
const anyOf = (s: AppState, kind: "gp" | "refer" | "gentle") => HEALTH_QUESTIONS.some((q) => q.kind === kind && yes(s, q.id));

/** Strength sessions wait until they've checked with their GP. */
export const sessionsPaused = (s: AppState) => anyOf(s, "gp") && !s.health.gpCleared;
/** Pregnancy or kidney disease, which need the referral and the tick box. */
export const referrals = (s: AppState) => (["pregnant", "kidney"] as const).filter((id) => yes(s, id));
/** Sessions start with the easier version of each move. */
export const easierFirst = (s: AppState) => ["joints", "bones", "falls", "floor", "fatigue"].some((id) => yes(s, id));
/** Protein targets are off for pregnancy and kidney disease, as in the meal engine. */
export const proteinTargetsOff = (s: AppState) => yes(s, "pregnant") || yes(s, "kidney");
/** Notes to show on session screens, from the gentler-track answers. */
export const sessionNotes = (s: AppState) => HEALTH_QUESTIONS.filter((q) => q.kind === "gentle" && yes(s, q.id)).map((q) => NOTES[q.id]).filter((n): n is string => !!n);

/** Due for the health check: never done, the wording has changed, or 12 weeks since the last one. */
export function needsHealthCheck(s: AppState) {
  if (s.demo) return false;
  return !s.health.checkedAt || s.health.version < HEALTH_VERSION || daysBetween(s.health.checkedAt, today()) >= RECHECK_DAYS;
}

/** Saves the answers and switches on what they mean for food: pregnancy and kidney filters, low salt for very high
 *  blood pressure, carb notes for diabetes. Pregnancy turns safe mode on (no weight features, no numbers). */
export function applyHealth(st: AppState, answers: Record<string, boolean>) {
  const before = st.health.answers;
  st.health = { ...st.health, answers, checkedAt: today(), version: HEALTH_VERSION };
  // A new "yes" to a GP question needs a fresh "I've checked"; so does a new referral need a fresh tick.
  const newGp = HEALTH_QUESTIONS.some((q) => q.kind === "gp" && answers[q.id] && !before[q.id]);
  if (newGp) st.health.gpCleared = false;
  if ((answers.pregnant && !before.pregnant) || (answers.kidney && !before.kidney)) st.health.referAgreed = null;

  // Each condition the check covers is added on a yes and removed when a yes becomes a no. Otherwise it's left as
  // the person set it in food preferences.
  const FROM: [string, Condition][] = [["pregnant", "pregnancy"], ["kidney", "kidney"], ["bp", "high-blood-pressure"], ["diabetes", "type-2-diabetes"]];
  let conditions = [...st.food.conditions] as Condition[];
  for (const [q, c] of FROM) {
    if (answers[q] && !conditions.includes(c)) conditions.push(c);
    if (!answers[q] && before[q]) conditions = conditions.filter((x) => x !== c);
  }
  st.food.conditions = conditions;
  if (answers.pregnant) st.settings.safeMode = true;
  st.food.plan = null;
}
