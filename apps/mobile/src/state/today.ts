// Today's plan: the handful of things worth doing today, in the order they're best done. The hero ring on Today
// counts these, and the first one not yet done is the "next up" button, so the screen always answers "what now?".
import { DAYS } from "@landing/engine";
import { HABITS, SESSIONS } from "@/data/content";
import { TODAY, weekdayIndex } from "@/data/dates";
import type { IconName } from "@/components/Icon";
import { nextSession } from "./habits";
import { YESTERDAY } from "./journal";
import { proteinToday, type AppState } from "./store";

export const PROTEIN_TARGET = 100;

/** Something to go and do: tapping it opens the screen where it's done. */
export interface Task { kind: "task"; id: string; label: string; /** The hero button when this is next. */ cta: string; detail: string; done: boolean; icon: IconName; href: string | { pathname: string; params: Record<string, string> } }
/** One of the week's habits, ticked in place. */
export interface HabitItem { kind: "habit"; id: string; done: boolean }
export type TodayItem = Task | HabitItem;

export function todayPlan(s: AppState): TodayItem[] {
  const items: TodayItem[] = [];
  const logged = !!s.journal.entries[YESTERDAY];
  items.push({ kind: "task", id: "journal", icon: "today", done: logged, href: logged ? "/journal/insights" : "/journal",
    label: logged ? "Yesterday is logged" : "Check in on yesterday", cta: "Check in on yesterday",
    detail: logged ? "See what shapes your days" : `${s.journal.questions.length + 2} quick questions, about a minute` });

  const g = proteinToday(s), meals = Object.keys(s.protein).length, safe = s.settings.safeMode;
  items.push({ kind: "task", id: "protein", icon: "plus", href: "/quick-log",
    done: safe ? meals >= 3 : g >= PROTEIN_TARGET,
    label: safe ? "Protein at each meal" : `${PROTEIN_TARGET} g of protein`, cta: "Log a meal's protein",
    detail: safe ? `${meals} ${meals === 1 ? "meal" : "meals"} logged so far · tap to log` : `${g} g so far · tap to log a meal` });

  // A session done today shows as done; otherwise the next one this week, if there is one. No session left is a rest day.
  const today = DAYS[weekdayIndex(TODAY)];
  const doneToday = (["A", "B"] as const).find((k) => s.workouts.done[k] === today), next = nextSession(s);
  const k = doneToday ?? next;
  if (k) {
    items.push({ kind: "task", id: "session", icon: "workout", done: !!doneToday, href: { pathname: "/workouts/[id]", params: { id: k } },
      cta: `Start ${SESSIONS[k].name}`,
      label: doneToday ? `${SESSIONS[k].name} done` : `${SESSIONS[k].name} · ${SESSIONS[k].minutes} minutes`,
      detail: doneToday ? "Nice work. That counts towards this week" : `${SESSIONS[k].moves.length} exercises at home` });
  }

  // Session habits are covered by the session above.
  for (const id of s.habits.ids) if (HABITS[id] && HABITS[id].kind !== "sessions") items.push({ kind: "habit", id, done: !!s.habits.today[id] });
  return items;
}

const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
const word = (n: number) => WORDS[n] ?? String(n);

/** The hero's headline: how the day's going, never how it isn't. */
export function headline(done: number, total: number): string {
  if (done >= total) return "That's today done";
  if (done === 0) return `${word(total)} small things today`;
  return `${word(total - done)} left for today`;
}
