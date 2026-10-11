// When Steadie may ask for an App Store rating: only at a good moment, at most once every 120 days, and only once the
// app has been around for a week. Pure, so it can be tested; src/state/review.ts does the asking.
import { addDays, daysBetween } from "./dates";
import type { AppState, JournalEntry } from "@/state/store";

export const REVIEW_GAP_DAYS = 120;
export const REVIEW_MIN_DAYS = 7;
export type Milestone = "first-week" | "weight-held" | "four-week-streak" | "phase";
/** How far apart a month of weigh-ins can be and still count as held steady. */
export const HELD_KG = 2;

/** Days in a row with a check-in, counting back from `day`. */
export function streak(s: Pick<AppState, "journal">, day: string): number {
  let n = 0;
  while (s.journal.entries[addDays(day, -n)]) n++;
  return n;
}

/** A check-in that says the day was hard: low energy, very hungry, or a weigh-in up on the one before. */
export function hardDay(s: Pick<AppState, "weights">, day: string, e: JournalEntry): boolean {
  if ((e.energy != null && e.energy <= 2) || (e.fullness != null && e.fullness <= 2)) return true;
  const sorted = [...s.weights].sort((a, b) => b.date.localeCompare(a.date));
  const [latest, before] = sorted;
  return !!latest && !!before && daysBetween(day, latest.date) <= 2 && latest.kg > before.kg;
}

/** Weight held for four weeks: at least three weigh-ins in the 28 days up to `day`, the first of them three or more
 *  weeks back, all within HELD_KG of each other, and none on or just before `day` up on the one before it. */
export function weightHeld(s: Partial<Pick<AppState, "weights">>, day: string): boolean {
  const inWindow = (s.weights ?? []).filter((w) => w.date <= day && daysBetween(w.date, day) < 28).sort((a, b) => a.date.localeCompare(b.date));
  if (inWindow.length < 3 || daysBetween(inWindow[0].date, day) < 21) return false;
  const kgs = inWindow.map((w) => w.kg);
  return Math.max(...kgs) - Math.min(...kgs) <= HELD_KG;
}

/** The milestone a just-saved check-in reaches, if any, in the playbook's order: a first full week in a row, weight
 *  held for four weeks, then 28 days in a row. (Phase milestones are asked from Today, when a new phase starts.) */
export function checkInMilestone(s: Pick<AppState, "journal"> & Partial<Pick<AppState, "weights">>, day: string): Milestone | null {
  const run = streak(s, day);
  if (run === 7) return "first-week";
  if (weightHeld(s, day)) return "weight-held";
  if (run === 28) return "four-week-streak";
  return null;
}

/** Whether the prompt may be shown now, given when the app was first opened and when it last asked. */
export function mayAsk(firstOpenAt: string, lastAskedAt: string | null | undefined, now = new Date()): boolean {
  const days = (iso: string) => (now.getTime() - new Date(iso).getTime()) / 86_400_000;
  if (days(firstOpenAt) < REVIEW_MIN_DAYS) return false;
  return !lastAskedAt || days(lastAskedAt) >= REVIEW_GAP_DAYS;
}
