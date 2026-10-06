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

/** Sessions a week: two, or three in Settle when the week's habit asks for an optional third. */
export const sessionTarget = (s: AppState) => (s.habits.ids.includes("strength3") ? 3 : 2);

/** The next strength session this week: A, then B, then A again for a third. Null once the week's are done. */
export function nextSession(s: AppState): "A" | "B" | null {
  const done = sessionsInWeek(s);
  if (done.length >= sessionTarget(s)) return null;
  const a = done.filter((x) => x === "A").length, b = done.length - a;
  return a <= b ? "A" : "B";
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

/** Protein for one meal today. Breakfast with 25 g or more ticks "Protein at breakfast" too. */
export function logProtein(s: AppState, meal: string, g: number) {
  const log = (s.days[today()] ??= {});
  log.protein = { ...log.protein, [meal]: Math.round(g) };
  if (meal === "Breakfast" && g >= 25 && s.habits.ids.includes("protein")) log.habits = { ...log.habits, protein: true };
}
