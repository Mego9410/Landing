// Sessions that step up gently. Three levels: weeks 1 to 4 as written; from week 5 a couple more reps (or 10 more
// seconds); from week 13 an extra set on most moves as well. After a session, "Too easy" moves the next ones up a
// level and "Tough" moves them down. Anyone who said they feel much worse after activity stays on level 1 (pacing,
// with no automatic progression).
import { SESSIONS, type Move } from "./content";
import type { AppState } from "@/state/store";
import { weekOf } from "@/state/store";

export type Level = 1 | 2 | 3;

export function sessionLevel(s: AppState): Level {
  if (s.health.answers.fatigue) return 1;
  const week = weekOf(s);
  let level = week >= 13 ? 3 : week >= 5 ? 2 : 1;
  if (s.workouts.feel === "Too easy") level += 1;
  if (s.workouts.feel === "Tough") level -= 1;
  return Math.max(1, Math.min(3, level)) as Level;
}

/** "10" → "12", "8 each leg" → "10 each leg", "20 seconds each side" → "30 seconds each side". */
function moreReps(reps: string): string {
  return reps.replace(/^(\d+)( seconds)?/, (_, n: string, secs?: string) => `${Number(n) + (secs ? 10 : 2)}${secs ?? ""}`);
}

function adjust(m: Move, level: Level): Move {
  if (level === 1) return m;
  const reps = moreReps(m.reps);
  return { ...m, reps, sets: level === 3 ? Math.min(4, m.sets + (m.sets >= 3 ? 1 : 0)) : m.sets };
}

/** A session as it should be done now. */
export function sessionFor(s: AppState, id: "A" | "B") {
  const base = SESSIONS[id], level = sessionLevel(s);
  return { ...base, level, minutes: base.minutes + (level === 3 ? 5 : 0), moves: base.moves.map((m) => adjust(m, level)) };
}
