// Each person's own strength programme, built from the movement library (@landing/motion: 12 patterns, each a ladder of
// six levels plus a seated version) and their answers: home or gym, the kit they have, the health check, the days they
// picked, and a seed of their own. Two sessions, A and B, of five moves each, covering every main pattern between them.
// It steps up a level every eight weeks (a "block"); each block is built once, saved in the plan and backed up, so the
// sessions don't change under someone when the app updates. Pure, so it can be tested.
import { EXERCISES, type Equipment, type Exercise, type Pattern } from "@landing/motion";
import type { Move } from "./content";

export interface ProgramInput {
  at: "home" | "gym";
  /** Extra kit at home: band, dumbbells, kettlebell. */
  kit: string[];
  /** Health check answers (see data/health.ts). */
  answers: Record<string, boolean | undefined>;
  /** Sessions a week they're aiming for (2 or 3). */
  perWeek: number;
}

export interface Block { block: number; A: Move[]; B: Move[] }
export interface Program { v: 1; seed: number; inputs: string; builtAt: string; blocks: Block[] }
export const PROGRAM_VERSION = 1;
export const WEEKS_PER_BLOCK = 8;

// Everyday things most homes have; the rest only if they say so (or at a gym).
const HOME_KIT: Equipment[] = ["chair", "wall", "counter", "step", "mat", "bottles", "bags", "backpack", "broom", "cushion", "table"];
const EXTRA: Record<string, Equipment[]> = { band: ["band"], dumbbells: ["dumbbells"], kettlebell: ["kettlebell"] };
const GYM_KIT: Equipment[] = [...HOME_KIT, "band", "dumbbells", "kettlebell", "bench", "barbell", "cable", "machine", "pull-up bar"];

/** The kit available for this person. */
export function kitFor(input: ProgramInput): Set<Equipment> {
  if (input.at === "gym") return new Set(GYM_KIT);
  return new Set([...HOME_KIT, ...input.kit.flatMap((k) => EXTRA[k] ?? [])]);
}

/** A key for the inputs that shape the moves: when it changes, the current block is rebuilt (same seed). */
export const inputsKey = (i: ProgramInput) =>
  JSON.stringify([i.at, [...i.kit].sort(), ["floor", "falls", "joints", "bones", "fatigue", "pregnant"].filter((k) => i.answers[k]), i.perWeek]);

/** mulberry32, as the meal planner uses. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Moves done lying or kneeling on the floor: left out for anyone who finds getting down and up hard, and in pregnancy.
const FLOOR = new Set(["hinge-1", "push-4", "push-5", "press-4", "row-1", "pulldown-3", "core-1", "core-2", "core-4", "core-5", "core-6", "rotation-2", "rotation-3", "rotation-5", "rotation-6"]);

/** Where each pattern starts (1 to 6), and the highest it may reach, from the health check and where they train. */
function levels(input: ProgramInput): { start: number; cap: Record<Pattern, number> } {
  const a = input.answers;
  const cap = Object.fromEntries(["squat", "hinge", "push", "press", "row", "pulldown", "lunge", "carry", "core", "rotation", "balance", "calf"].map((p) => [p, 6])) as Record<Pattern, number>;
  let start = input.at === "gym" ? 3 : 2;
  if (a.fatigue) { start = 1; for (const p in cap) cap[p as Pattern] = 2; }
  if (a.falls || a.floor) { start = Math.min(start, 2); cap.balance = 3; cap.lunge = Math.min(cap.lunge, 2); }
  if (a.joints) { start = Math.min(start, 2); cap.lunge = Math.min(cap.lunge, 3); cap.squat = Math.min(cap.squat, 4); }
  if (a.bones) { cap.hinge = Math.min(cap.hinge, 2); cap.core = Math.min(cap.core, 3); }
  if (a.pregnant) { start = Math.min(start, 2); for (const p in cap) cap[p as Pattern] = Math.min(cap[p as Pattern], 3); }
  return { start, cap };
}

const REPS: Record<Pattern, string> = {
  squat: "10", hinge: "10", push: "8", press: "10", row: "10", pulldown: "12", lunge: "8 each leg", carry: "30 seconds",
  core: "8 each side", rotation: "20 seconds each side", balance: "20 seconds each side", calf: "12",
};
const SIDED: Partial<Record<string, string>> = { "row-4": "10 each arm", "core-3": "20 seconds", "core-4": "20 seconds", "core-5": "6 each side", "carry-3": "30 seconds each side", "lunge-1": "20 seconds each side" };

/** The exercises someone can do for a pattern, easiest first. */
function ladder(pattern: Pattern, kit: Set<Equipment>, input: ProgramInput): Exercise[] {
  const noFloor = !!(input.answers.floor || input.answers.pregnant);
  return EXERCISES.filter((e) => e.pattern === pattern && e.level >= 1 && e.equipment.every((q) => kit.has(q)) && !(noFloor && FLOOR.has(e.id)))
    .sort((x, y) => x.level - y.level);
}

/** One move for a pattern at a target level: an exercise at that level, or the one just below, chosen by the seed. */
function pick(pattern: Pattern, level: number, max: number, kit: Set<Equipment>, input: ProgramInput, rand: () => number, used: Set<string>): Move | null {
  // Never above their ceiling for the pattern; an exercise already in the other session beats a harder one.
  const ok = ladder(pattern, kit, input).filter((e) => e.level <= max);
  const fresh = ok.filter((e) => !used.has(e.id)), all = fresh.length ? fresh : ok;
  if (!all.length) return null;
  const near = all.filter((e) => e.level === level || e.level === level - 1);
  const pool = near.length ? near : [all.reduce((best, e) => (Math.abs(e.level - level) < Math.abs(best.level - level) ? e : best))];
  // Prefer the target level two times in three.
  const atLevel = pool.filter((e) => e.level === level);
  const chosen = atLevel.length && (rand() < 0.67 || atLevel.length === pool.length) ? atLevel[Math.floor(rand() * atLevel.length)] : pool[Math.floor(rand() * pool.length)];
  used.add(chosen.id);
  const easier = all.filter((e) => e.level < chosen.level).pop() ?? ladder(pattern, kit, input).filter((e) => e.level < chosen.level).pop();
  const fatigue = !!input.answers.fatigue;
  return {
    name: chosen.name, anim: chosen.id, ...(easier ? { easier: easier.id } : {}),
    sets: fatigue ? 2 : pattern === "balance" || pattern === "carry" || pattern === "rotation" ? 2 : 3,
    reps: SIDED[chosen.id] ?? REPS[pattern], cue: chosen.cue,
  };
}

const STAND_IN: Record<Pattern, Pattern[]> = {
  squat: ["lunge"], hinge: ["squat"], push: ["press"], press: ["push"], row: ["pulldown"], pulldown: ["row", "press"],
  lunge: ["squat"], carry: ["calf", "balance"], core: ["rotation"], rotation: ["core"], balance: ["calf"], calf: ["balance"],
};

/** The two sessions for one block. Each session has a lower-body move, a push or press, a pull, a trunk move and a
 *  steadying move, and between them every main pattern. The seed decides the pairings and the exact exercises. */
export function buildBlock(input: ProgramInput, seed: number, block: number): Block {
  const rand = rng(seed * 31 + block * 7919);
  const kit = kitFor(input);
  const { start, cap } = levels(input);
  const level = (p: Pattern) => Math.max(1, Math.min(cap[p], start + block));
  const coin = () => rand() < 0.5;
  const pullA: Pattern = coin() ? "row" : "pulldown", pullB: Pattern = pullA === "row" ? "pulldown" : "row";
  const trunkA: Pattern = coin() ? "core" : "rotation", trunkB: Pattern = trunkA === "core" ? "rotation" : "core";
  const steady = input.answers.falls ? ["balance", "balance"] as Pattern[] : coin() ? ["calf", "carry"] as Pattern[] : ["carry", "calf"] as Pattern[];
  const plan: Record<"A" | "B", Pattern[]> = {
    A: ["squat", "push", pullA, trunkA, steady[0]],
    B: ["hinge", "press", "lunge", pullB, trunkB],
  };
  // A third weekly session reuses A, so B gets the steadying move A didn't.
  if (input.perWeek >= 3 || input.answers.falls) plan.B.push(steady[1]);
  const used = new Set<string>();
  // When nothing in a pattern suits their kit or health (say, pull-downs with no band), the nearest pattern stands in.
  const session = (ps: Pattern[]) => ps.map((p) => [p, ...STAND_IN[p]].reduce<Move | null>((m, q) => m ?? pick(q, level(q), cap[q], kit, input, rand, used), null)).filter((m): m is Move => !!m);
  return { block, A: session(plan.A), B: session(plan.B) };
}

/** The block for a given week on the plan (week 1 is block 0). */
export const blockOf = (weeksOnPlan: number) => Math.max(0, Math.floor((Math.max(1, weeksOnPlan) - 1) / WEEKS_PER_BLOCK));

/** A fresh programme record, or the same one with any missing block (or a rebuild if the inputs changed) added. */
export function withBlock(program: Program | null, input: ProgramInput, seed: number, block: number, now = new Date().toISOString()): Program {
  const key = inputsKey(input);
  const base: Program = program && program.inputs === key ? program : { v: PROGRAM_VERSION, seed: program?.seed ?? seed, inputs: key, builtAt: now, blocks: [] };
  if (base.blocks.some((b) => b.block === block)) return base;
  return { ...base, blocks: [...base.blocks, buildBlock(input, base.seed, block)].sort((a, b) => a.block - b.block) };
}
