// Moving the app on when the day or week changes: called when the app opens, comes back to the foreground, and once a
// minute while it's open. Day logs are kept by date, so a new day needs nothing; a new week resets the habits to the
// plan week's set (ending any swap) and, if next week's meals were picked, makes them this week's plan.
import { AppState as RNAppState } from "react-native";
import { daysBetween, today, weekStart } from "@/data/dates";
import { syncWeights } from "./appleHealth";
import { saveThisWeek } from "./food";
import { track } from "./events";
import { install, updateInstall } from "./install";
import { ensurePlans, plansDue } from "./plans";
import { refreshReminders } from "./reminders";
import { get, habitsNow, set } from "./store";

export function rollover() {
  const t = today(), s = get();
  // This week's meals and the strength block, saved into the plan (and so the backup) as soon as they're due.
  if (plansDue(s)) set(ensurePlans, { quiet: true });
  if (s.lastSeen === t) return;
  set((st) => {
    const h = habitsNow(st, t);
    if (st.onboarded && st.habits.week !== h.week) st.habits = { ...h, swappedFrom: null };
    if (weekStart(st.lastSeen) !== weekStart(t)) {
      st.food.ticked = {};
      if (st.food.next && st.food.next.start === weekStart(t)) { saveThisWeek(st, st.food.next.week); st.food.ticked = st.food.next.ticked; }
      if (!st.food.next?.start || st.food.next.start <= weekStart(t)) st.food.next = null;
    }
    st.lastSeen = t;
  }, { quiet: true });
  // A full week since onboarding finished: counted once per install.
  const started = get().startedOn;
  if (started && daysBetween(started, t) >= 7) install(started).then((i) => { if (!i.week1Sent) { updateInstall({ week1Sent: true }); track("week_1_completed"); } }).catch(() => {});
}

/** Starts watching for a new day. Returns a function that stops watching. */
export function watchDay(): () => void {
  rollover();
  refreshReminders(get());
  syncWeights().catch(() => {});
  const timer = setInterval(rollover, 60_000);
  const sub = RNAppState.addEventListener("change", (a) => { if (a === "active") { rollover(); refreshReminders(get()); syncWeights().catch(() => {}); } });
  return () => { clearInterval(timer); sub.remove(); };
}
