import { HABITS } from "@/data/content";
import { set, type AppState } from "./store";

export function habitDetail(s: AppState, id: string) {
  const h = HABITS[id], n = s.habits.done[id] ?? 0;
  if (h.kind === "days") return `${h.note} · ${n} of ${h.target} days`;
  if (h.kind === "sessions") return `${Object.keys(s.workouts.done).length} of ${h.target} done`;
  return h.note;
}

export function toggleHabit(id: string, on: boolean) {
  set((s) => {
    if (!!s.habits.today[id] === on) return;
    s.habits.today[id] = on;
    s.habits.done[id] = Math.max(0, (s.habits.done[id] ?? 0) + (on ? 1 : -1));
  });
}

/** The next strength session still to do this week. */
export const nextSession = (s: AppState): "A" | "B" | null => (!s.workouts.done.A ? "A" : !s.workouts.done.B ? "B" : null);
