// Today's plan: the handful of things worth doing today, in the order they're best done. Today counts these, and the
// first one not yet done is "Up next", so the screen always answers "what now?".
import { HABITS } from "@/data/content";
import { sessionFor } from "@/data/sessions";
import { today, yesterday } from "@/data/dates";
import type { IconName } from "@/components/Icon";
import { isTicked, nextSession, sessionDoneOn } from "./habits";
import { needsHealthCheck, proteinTargetsOff, sessionsPaused } from "./health";
import { mealsLogged, proteinToday, type AppState } from "./store";

export const PROTEIN_TARGET = 100;

/** Something to go and do: tapping it opens the screen where it's done. */
export interface Task { kind: "task"; id: string; label: string; /** The hero button when this is next. */ cta: string; detail: string; done: boolean; icon: IconName; href: string | { pathname: string; params: Record<string, string> } }
/** One of the week's habits, ticked in place. */
export interface HabitItem { kind: "habit"; id: string; done: boolean }
export type TodayItem = Task | HabitItem;

export function todayPlan(s: AppState): TodayItem[] {
  const items: TodayItem[] = [];
  if (needsHealthCheck(s)) items.push({ kind: "task", id: "health", icon: "check", done: false, href: { pathname: "/onboarding/health", params: { recheck: "1" } },
    label: "A quick health check", cta: "Do your health check", detail: "Every 12 weeks, so your plan still fits. About a minute" });
  const logged = !!s.journal.entries[yesterday()];
  // The morning check-in is about yesterday, so it starts the day after someone joins.
  if (!s.startedOn || s.startedOn < today()) items.push({ kind: "task", id: "journal", icon: "today", done: logged, href: logged ? "/journal/insights" : "/journal",
    label: logged ? "Yesterday is logged" : "Check in on yesterday", cta: "Check in on yesterday",
    detail: logged ? "See what shapes your days" : `${s.journal.questions.length + 2} quick questions, about a minute` });

  const g = proteinToday(s), meals = mealsLogged(s), safe = s.settings.safeMode || proteinTargetsOff(s);
  items.push({ kind: "task", id: "protein", icon: "plus", href: "/quick-log",
    done: safe ? meals >= 3 : g >= PROTEIN_TARGET,
    label: safe ? "Protein at each meal" : `${PROTEIN_TARGET} g of protein`, cta: "Log a meal's protein",
    detail: safe ? `${meals} ${meals === 1 ? "meal" : "meals"} logged so far · tap to log` : `${g} g so far · tap to log a meal` });

  // A session done today shows as done; otherwise the next one this week, if there is one. No session left is a rest day.
  const doneToday = (["A", "B"] as const).find((k) => sessionDoneOn(s, k) === today()), next = nextSession(s);
  const k = doneToday ?? next;
  if (k && !sessionsPaused(s)) {
    items.push({ kind: "task", id: "session", icon: "workout", done: !!doneToday, href: { pathname: "/workouts/[id]", params: { id: k } },
      cta: `Start ${sessionFor(s, k).name}`,
      label: doneToday ? `${sessionFor(s, k).name} done` : `${sessionFor(s, k).name} · ${sessionFor(s, k).minutes} minutes`,
      detail: doneToday ? "Nice work. That counts towards this week" : `${sessionFor(s, k).moves.length} exercises ${s.story.strengthAt === "gym" ? "at the gym" : "at home"}` });
  }

  // Session habits are covered by the session above.
  for (const id of s.habits.ids) if (HABITS[id] && HABITS[id].kind !== "sessions") items.push({ kind: "habit", id, done: isTicked(s, id) });
  return items;
}
