// The steady score: one whole number a week, out of 100, for how steady the week's routines were. Built from:
//   habits   40  each non-session habit's days ticked, up to its target, averaged
//   sessions 30  strength sessions done, out of 2
//   trend    30  where the 7-day average ended the week against the steady zone (full marks inside it, easing off
//                over 1.5 kg above it). In safe mode, or with no weigh-ins, this part is morning check-ins out of 7.
// It's never shown as a target to hit, and a lower week is described gently ("a wobblier week, and that's fine").
import { habitsForWeek, HABITS } from "@/data/content";
import { addDays, today, weekDates, weekStart } from "@/data/dates";
import { avg7, dayLog, sessionsInWeek, steadyBase, steadyZone, weekOf, type AppState } from "./store";

export interface WeekScore { score: number; habits: number; sessions: number; trend: number; usedWeight: boolean }

/** The score for the week starting on `monday`, or null if nothing was logged that week. */
export function weekScore(s: AppState, monday: string): WeekScore | null {
  const dates = weekDates(monday), sunday = dates[6];
  const anything = dates.some((d) => Object.keys(dayLog(s, d)).length || s.journal.entries[d]);
  if (!anything) return null;

  const ids = habitsForWeek(weekOf(s, monday)).filter((id) => HABITS[id]?.kind !== "sessions");
  const habits = ids.length ? ids.reduce((a, id) => a + Math.min(1, dates.filter((d) => dayLog(s, d).habits?.[id]).length / HABITS[id].target), 0) / ids.length : 0;
  const sessions = Math.min(1, sessionsInWeek(s, sunday).length / 2);

  const avg = s.settings.safeMode || steadyBase(s) == null ? null : avg7(s, sunday);
  let trend: number;
  if (avg != null) {
    const [, hi] = steadyZone(s);
    trend = Math.max(0, Math.min(1, 1 - Math.max(0, avg - hi) / 1.5));
  } else {
    trend = dates.filter((d) => s.journal.entries[d]).length / 7;
  }
  return { score: Math.round(habits * 40 + sessions * 30 + trend * 30), habits, sessions, trend, usedWeight: avg != null };
}

/** Last full week's score and the one before, for Progress. */
export function recentScores(s: AppState) {
  const last = addDays(weekStart(today()), -7);
  return { last: weekScore(s, last), before: weekScore(s, addDays(last, -7)), week: weekOf(s, last) };
}
