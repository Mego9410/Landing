import { HABITS } from "@/data/content";
import { today, weekDates } from "@/data/dates";
import { dayLog, habitDays, sessionsInWeek, set, type AppState } from "./store";

/** Ticked today. */
export const isTicked = (s: AppState, id: string) => !!dayLog(s).habits?.[id];

/** How a habit's going this week, for under its name. */
export function habitDetail(s: AppState, id: string) {
  const h = HABITS[id];
  if (h.kind === "days") return `${h.note} · ${habitDays(s, id)} of ${h.target} days`;
  if (h.kind === "sessions") return `${sessionsInWeek(s).length} of ${h.target} done`;
  return h.note;
}

export function toggleHabit(id: string, on: boolean) {
  const t = today();
  set((s) => {
    const log = (s.days[t] ??= {});
    log.habits = { ...log.habits };
    if (on) log.habits[id] = true; else delete log.habits[id];
  });
}

/** The next strength session still to do this week: A, then B. Null once both are done. */
export function nextSession(s: AppState): "A" | "B" | null {
  const done = sessionsInWeek(s);
  return !done.includes("A") ? "A" : !done.includes("B") ? "B" : null;
}

/** The day a session was done this week, if it was. */
export function sessionDoneOn(s: AppState, id: "A" | "B"): string | null {
  const t = today();
  return weekDates(t).find((d) => d <= t && dayLog(s, d).sessions?.includes(id)) ?? null;
}

export function logSession(id: "A" | "B") {
  const t = today();
  set((s) => { const log = (s.days[t] ??= {}); log.sessions = [...(log.sessions ?? []).filter((x) => x !== id), id]; });
}

/** Protein for one meal today. Breakfast with 25 g or more ticks "Protein at breakfast" too. */
export function logProtein(s: AppState, meal: string, g: number) {
  const log = (s.days[today()] ??= {});
  log.protein = { ...log.protein, [meal]: Math.round(g) };
  if (meal === "Breakfast" && g >= 25 && s.habits.ids.includes("protein")) log.habits = { ...log.habits, protein: true };
}
