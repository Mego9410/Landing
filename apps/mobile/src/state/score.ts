// The steady score: one whole number a week, out of 100, for how steady the week's routines were. Built from:
//   habits   40  each non-session habit's days ticked, up to its target, averaged
//   sessions 30  strength sessions done, out of 2
//   trend    30  where the 7-day average ended the week against the steady zone (full marks inside it, easing off
//                over 1.5 kg above it). In safe mode, or with no weigh-ins, this part is morning check-ins out of 7.
// It's never shown as a target to hit, and a lower week is described gently ("a wobblier week, and that's fine").
// Habits are the week's own: this week's as they are now (swaps included); for past weeks, the habits that week had,
// with any other habit ticked that week counting for the third one (in case they swapped it).
import { habitsForWeek, HABITS } from "@/data/content";
import { addDays, today, weekDates, weekStart } from "@/data/dates";
import { avg7, dayLog, sessionsInWeek, steadyBase, steadyZone, weekOf, weeksOnPlan, type AppState } from "./store";

export interface WeekScore { score: number; habits: number; sessions: number; trend: number; usedWeight: boolean }

/** The score for the week starting on `monday`, or null if nothing was logged that week. */
export function weekScore(s: AppState, monday: string): WeekScore | null {
  const dates = weekDates(monday), sunday = dates[6];
  const anything = dates.some((d) => Object.keys(dayLog(s, d)).length || s.journal.entries[d]);
  if (!anything) return null;

  const slots = habitSlots(s, monday, dates);
  const habits = slots.length ? slots.reduce((a, h) => a + Math.min(1, h.days / HABITS[h.id].target), 0) / slots.length : 0;
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

/** The week's non-session habits: this week's as they are now (with any swap), or the plan's for a past week. */
export function weekHabits(s: AppState, monday: string): string[] {
  const week = weekOf(s, monday), current = s.habits.week === week && s.habits.ids.length ? s.habits.ids : habitsForWeek(week);
  return current.filter((id) => HABITS[id]?.kind !== "sessions");
}

/** Days ticked for each of the week's habits, on the given dates. For a past week, the last habit (the one people swap)
 *  also counts days of any habit outside the plan, in case they swapped it that week. */
export function habitSlots(s: AppState, monday: string, dates = weekDates(monday)): { id: string; days: number }[] {
  const ids = weekHabits(s, monday);
  const daysOf = (id: string) => dates.filter((d) => dayLog(s, d).habits?.[id]).length;
  const past = s.habits.week !== weekOf(s, monday);
  const other = past ? Math.max(0, ...Object.keys(HABITS).filter((id) => !ids.includes(id) && HABITS[id].kind !== "sessions").map(daysOf)) : 0;
  return ids.map((id, i) => ({ id, days: Math.max(daysOf(id), i === ids.length - 1 ? other : 0) }));
}

/** Scores for the last `n` full weeks, oldest first (null where nothing was logged). */
export function scoreHistory(s: AppState, n = 12): { monday: string; week: number; score: number | null }[] {
  const last = addDays(weekStart(today()), -7);
  return Array.from({ length: n }, (_, i) => {
    const monday = addDays(last, -7 * (n - 1 - i));
    return { monday, week: weeksOnPlan(s, monday), score: weekScore(s, monday)?.score ?? null };
  });
}

/** Last full week's score and the one before, for Progress. */
export function recentScores(s: AppState) {
  const last = addDays(weekStart(today()), -7);
  return { last: weekScore(s, last), before: weekScore(s, addDays(last, -7)), week: weekOf(s, last) };
}
