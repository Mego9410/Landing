// When Steadie may ask for an App Store rating: only at a good moment, at most once every 120 days, and only once the
// app has been around for a week. Pure, so it can be tested; src/state/review.ts does the asking.
import { addDays, daysBetween } from "./dates";
import type { AppState, JournalEntry } from "@/state/store";

export const REVIEW_GAP_DAYS = 120;
export const REVIEW_MIN_DAYS = 7;
export type Milestone = "first-week" | "four-week-streak" | "phase";

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

/** The milestone a just-saved check-in reaches, if any: the seventh check-in, or the 28th day in a row. */
export function checkInMilestone(s: Pick<AppState, "journal">, day: string): Milestone | null {
  const count = Object.keys(s.journal.entries).length;
  if (count === 7) return "first-week";
  if (streak(s, day) === 28) return "four-week-streak";
  return null;
}

/** Whether the prompt may be shown now, given when the app was first opened and when it last asked. */
export function mayAsk(firstOpenAt: string, lastAskedAt: string | null | undefined, now = new Date()): boolean {
  const days = (iso: string) => (now.getTime() - new Date(iso).getTime()) / 86_400_000;
  if (days(firstOpenAt) < REVIEW_MIN_DAYS) return false;
  return !lastAskedAt || days(lastAskedAt) >= REVIEW_GAP_DAYS;
}
