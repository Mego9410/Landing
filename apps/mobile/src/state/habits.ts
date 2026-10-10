import { HABITS } from "@/data/content";
import { fmt, today, weekDates } from "@/data/dates";
import { dayLog, habitDays, sessionsInWeek, set, type AppState } from "./store";

/** Done once in the week, not every day (like planning the week's meals). These sit outside the day's ring. */
export const isWeekly = (id: string) => HABITS[id]?.kind === "weekly";

/** Ticked today, or for a weekly habit, on any day this week. */
export const isTicked = (s: AppState, id: string) => (isWeekly(id) ? habitDays(s, id) > 0 : !!dayLog(s).habits?.[id]);

/** How a habit's going this week, for under its name. */
export function habitDetail(s: AppState, id: string) {
  const h = HABITS[id];
  if (h.kind === "days") return `${h.note} · ${habitDays(s, id)} of ${h.target} days`;
  if (h.kind === "sessions") return `${sessionsInWeek(s).length} of ${h.target} done`;
  if (h.kind === "weekly") {
    const on = weekDates(today()).find((d) => d <= today() && dayLog(s, d).habits?.[id]);
    return on ? `Done on ${fmt.weekday(on)} · that's this week sorted` : h.note;
  }
  return h.note;
}

export function toggleHabit(id: string, on: boolean) {
  const t = today();
  set((s) => {
    // Unticking a weekly habit clears whichever day this week it was ticked on.
    const days = !on && isWeekly(id) ? weekDates(t).filter((d) => d <= t) : [t];
    for (const d of days) {
      if (!on && !s.days[d]?.habits?.[id]) continue;
      const log = (s.days[d] ??= {});
      log.habits = { ...log.habits };
      if (on) log.habits[id] = true; else delete log.habits[id];
    }
  });
}

/** Sessions a week: two, or three in Settle when the week's habit asks for an optional third. */
export const sessionTarget = (s: AppState) => (s.habits.ids.includes("strength3") ? 3 : 2);

/** The next strength session this week: A, then B, then A again for a third. Null once the week's are done. */
export function nextSession(s: AppState): "A" | "B" | null {
  const done = sessionsInWeek(s);
  if (done.length >= sessionTarget(s)) return null;
  const a = done.filter((x) => x === "A").length, b = done.length - a;
  return a <= b ? "A" : "B";
}

/** This week's sessions in order (A, B, then A again when the target is three), each with the day it was done. */
export function weekSessions(s: AppState): { id: "A" | "B"; doneOn: string | null }[] {
  const t = today(), done = weekDates(t).filter((d) => d <= t).flatMap((d) => (dayLog(s, d).sessions ?? []).map((id) => ({ id, d })));
  const slots: ("A" | "B")[] = sessionTarget(s) === 3 ? ["A", "B", "A"] : ["A", "B"];
  return slots.map((id) => {
    const i = done.findIndex((x) => x.id === id);
    const hit = i >= 0 ? done.splice(i, 1)[0] : null;
    return { id, doneOn: hit?.d ?? null };
  });
}

/** The day a session was done this week, if it was. */
export function sessionDoneOn(s: AppState, id: "A" | "B"): string | null {
  const t = today();
  return weekDates(t).find((d) => d <= t && dayLog(s, d).sessions?.includes(id)) ?? null;
}

export function logSession(id: "A" | "B") {
  const t = today();
  set((s) => { const log = (s.days[t] ??= {}); log.sessions = [...(log.sessions ?? []), id]; });
}

/** Protein for one meal today, added to anything already logged for it (a second snack adds up). Breakfast reaching
 *  25 g or more ticks "Protein at breakfast" too. */
export function logProtein(s: AppState, meal: string, g: number) {
  const log = (s.days[today()] ??= {});
  const total = Math.round((log.protein?.[meal] ?? 0) + g);
  log.protein = { ...log.protein, [meal]: total };
  if (meal === "Breakfast" && total >= 25 && s.habits.ids.includes("protein")) log.habits = { ...log.habits, protein: true };
}

/** A meal logged without grams, for Habit Only mode: it counts towards "Protein at each meal", with no number kept. */
export function logMeal(s: AppState, meal: string) {
  const log = (s.days[today()] ??= {});
  if (!log.meals?.includes(meal)) log.meals = [...(log.meals ?? []), meal];
}
