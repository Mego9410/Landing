// Moving the app on when the day or week changes: called when the app opens, comes back to the foreground, and once a
// minute while it's open. Day logs are kept by date, so a new day needs nothing; a new week resets the habits to the
// plan week's set (ending any swap) and, if next week's meals were picked, makes them this week's plan.
import { AppState as RNAppState } from "react-native";
import { habitsForWeek } from "@/data/content";
import { today, weekStart } from "@/data/dates";
import { saveThisWeek } from "./food";
import { get, set, weekOf } from "./store";

export function rollover() {
  const t = today(), s = get();
  if (s.lastSeen === t) return;
  set((st) => {
    const week = weekOf(st, t);
    if (st.onboarded && st.habits.week !== week) st.habits = { week, ids: habitsForWeek(week), swappedFrom: null };
    if (weekStart(st.lastSeen) !== weekStart(t)) {
      st.food.ticked = {};
      if (st.food.next && st.food.next.start === weekStart(t)) { saveThisWeek(st, st.food.next.week); st.food.ticked = st.food.next.ticked; }
      if (!st.food.next?.start || st.food.next.start <= weekStart(t)) st.food.next = null;
    }
    st.lastSeen = t;
  });
}

/** Starts watching for a new day. Returns a function that stops watching. */
export function watchDay(): () => void {
  rollover();
  const timer = setInterval(rollover, 60_000);
  const sub = RNAppState.addEventListener("change", (a) => { if (a === "active") rollover(); });
  return () => { clearInterval(timer); sub.remove(); };
}
