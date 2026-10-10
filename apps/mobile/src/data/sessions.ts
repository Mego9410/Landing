// Sessions that step up gently. Three levels: weeks 1 to 4 as written; from week 5 a couple more reps (or 10 more
// seconds); from week 13 an extra set on most moves as well. After a session, "Too easy" moves the next ones up a
// level and "Tough" moves them down. Anyone who said they feel much worse after activity stays on level 1 (pacing,
// with no automatic progression). Weeks count from when they joined, so someone joining late still starts gently.
import { byId, PATTERNS } from "@landing/motion";
import { SESSIONS, type Move } from "./content";
import { today } from "./dates";
import { blockOf, newInBlock } from "./program";
import { weeksOnPlan } from "@/state/plans";
import type { AppState } from "@/state/store";
import { weekOf } from "@/state/store";

export type Level = 1 | 2 | 3;

export function sessionLevel(s: AppState): Level {
  if (s.health.answers.fatigue) return 1;
  // Saves from before the join week was kept count from the last injection, as they always have.
  const week = s.food.joinedWeek == null ? weekOf(s) : weeksOnPlan(s);
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

/** The moves for a session from this person's own programme (the block for their week on the plan, or the latest built),
 *  or the standard sessions before one exists. */
function blockNow(s: AppState) {
  const blocks = s.program?.blocks ?? [];
  return blocks.find((x) => x.block === blockOf(weeksOnPlan(s))) ?? blocks[blocks.length - 1];
}

function movesFor(s: AppState, id: "A" | "B"): Move[] {
  const b = blockNow(s);
  return b?.[id].length ? b[id] : SESSIONS[id].moves;
}

/** Exercises in the current block that this person hasn't had in an earlier one, for a "New this block" tag. */
export function newThisBlock(s: AppState): Set<string> {
  const b = blockNow(s);
  return b ? newInBlock(s.program, b.block) : new Set();
}

/** A session as it should be done now: about four minutes a move, a little longer at level 3. */
export function sessionFor(s: AppState, id: "A" | "B") {
  const moves = movesFor(s, id), level = sessionLevel(s);
  const minutes = s.program?.blocks.length ? Math.max(15, Math.round((moves.length * 4 + 5) / 5) * 5) : SESSIONS[id].minutes;
  return { ...SESSIONS[id], level, minutes: minutes + (level === 3 ? 5 : 0), moves: moves.map((m) => adjust(m, level)) };
}

/** "Your strength year": for each pattern in this block, the first exercise they had for it and the one they have now
 *  (`up` when it's a harder one). Empty before the programme exists. */
export function strengthYear(s: AppState): { pattern: string; from: string; to: string; up: boolean }[] {
  const blocks = s.program?.blocks ?? [], now = blockNow(s);
  if (!now) return [];
  const moves = (b: { A: Move[]; B: Move[] }) => [...b.A, ...b.B];
  return PATTERNS.flatMap((p) => {
    const to = moves(now).find((m) => byId(m.anim)?.pattern === p.id);
    const from = blocks.filter((b) => b.block <= now.block).flatMap(moves).find((m) => byId(m.anim)?.pattern === p.id);
    return to && from ? [{ pattern: p.name, from: from.name, to: to.name, up: (byId(to.anim)?.level ?? 0) > (byId(from.anim)?.level ?? 0) }] : [];
  });
}

/** Strength sessions done in each calendar month, from the month they started (up to the last 12), oldest first. */
export function sessionsByMonth(s: AppState, on = today()): { month: string; count: number }[] {
  const ym = (d: string) => d.slice(0, 7), end = ym(on), start = ym(s.startedOn ?? on);
  const months: string[] = [];
  for (let [y, m] = end.split("-").map(Number); months.length < 12; m--) {
    if (m === 0) { y--; m = 12; }
    const key = `${y}-${String(m).padStart(2, "0")}`;
    months.unshift(key);
    if (key <= start) break;
  }
  const count: Record<string, number> = {};
  for (const [d, log] of Object.entries(s.days)) if (d <= on) count[ym(d)] = (count[ym(d)] ?? 0) + (log.sessions?.length ?? 0);
  return months.map((month) => ({ month, count: count[month] ?? 0 }));
}
