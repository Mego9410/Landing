// Each person's own strength programme, built from the movement library (@landing/motion: 12 patterns, each a ladder of
// six levels plus a seated version) and their answers: home or gym, the kit they have, the health check, the days they
// picked, and a seed of their own. Two sessions, A and B, of five moves each, covering every main pattern between them.
// It steps up a level every eight weeks (a "block"); each block is built once, saved in the plan and backed up, so the
// sessions don't change under someone when the app updates (a fix or a new idea here only shapes blocks not yet built).
// Once a pattern can't step up any further, each new block brings a different way of doing the move (slower, a pause,
// one and a half reps) so the sessions still feel fresh all year. Pure, so it can be tested.
import { byId, EXERCISES, type Equipment, type Exercise, type Pattern } from "@landing/motion";
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

/** A different way of doing a move someone has already done: in the reps and the cue. */
export type Scheme = "slow" | "lower" | "pause" | "half" | "longer" | "smooth";
export interface ProgramMove extends Move { scheme?: Scheme }
export interface Block { block: number; A: ProgramMove[]; B: ProgramMove[] }
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
const FLOOR = new Set(["hinge-1", "push-4", "push-5", "press-4", "row-1", "row-5", "pulldown-3", "core-1", "core-2", "core-4", "core-5", "core-6", "rotation-2", "rotation-3", "rotation-5", "rotation-6"]);

/** Where each pattern starts (1 to 6), and the highest it may reach, from the health check and where they train. */
function levels(input: ProgramInput): { start: number; cap: Record<Pattern, number> } {
  const a = input.answers;
  const cap = Object.fromEntries(["squat", "hinge", "push", "press", "row", "pulldown", "lunge", "carry", "core", "rotation", "balance", "calf"].map((p) => [p, 6])) as Record<Pattern, number>;
  let start = input.at === "gym" ? 3 : 2;
  if (a.fatigue) { start = 1; for (const p in cap) cap[p as Pattern] = 2; } // and no stepping up (see buildBlock)
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

/** The exercises someone can do for a pattern, easiest first. Seated versions only for pacing. */
function ladder(pattern: Pattern, kit: Set<Equipment>, input: ProgramInput): Exercise[] {
  const noFloor = !!(input.answers.floor || input.answers.pregnant), lowest = input.answers.fatigue ? 0 : 1;
  return EXERCISES.filter((e) => e.pattern === pattern && e.level >= lowest && e.equipment.every((q) => kit.has(q)) && !(noFloor && FLOOR.has(e.id)))
    .sort((x, y) => x.level - y.level);
}

// Ways to do a move again once it can't step up: rep moves get slower or harder in the middle, holds get a little longer.
const SCHEMES: Record<Scheme, { reps: string; cue: string }> = {
  slow: { reps: " · slow", cue: "Slow this block: three seconds each way, with a one-second pause in between." },
  lower: { reps: " · slow return", cue: "This block, about a second for the effort, then four seconds back to the start." },
  pause: { reps: " · pause", cue: "This block, pause for two seconds at the hardest point of each one." },
  half: { reps: " · 1½ reps", cue: "One and a half reps this block: lower, come halfway back, lower again, then all the way." },
  longer: { reps: "", cue: "Ten seconds longer this block. Stop whenever you need to." },
  smooth: { reps: "", cue: "Ten seconds longer, as smooth and steady as you can, with slow easy breaths." },
};
// Trunk moves done for reps (a dead bug, a bird dog) only get slower or a pause.
const REP_SCHEMES: Scheme[] = ["slow", "lower", "pause", "half"], TRUNK_SCHEMES: Scheme[] = ["slow", "pause"], HOLD_SCHEMES: Scheme[] = ["longer", "smooth"];
const schemesFor = (pattern: Pattern, reps: string) =>
  /seconds/.test(reps) ? HOLD_SCHEMES : pattern === "core" || pattern === "rotation" || pattern === "balance" || pattern === "carry" ? TRUNK_SCHEMES : REP_SCHEMES;

/** What the block before had (its exercises, the highest level of each pattern, how each move was done), and every
 *  scheme each exercise has had in any block so far. */
interface Prev { ids: Set<string>; level: Partial<Record<Pattern, number>>; scheme: Record<string, Scheme | undefined>; tried: Record<string, Set<Scheme>> }
function prevOf(earlier: Block[]): Prev | null {
  const b = earlier[earlier.length - 1];
  if (!b) return null;
  const prev: Prev = { ids: new Set(), level: {}, scheme: {}, tried: {} };
  for (const m of [...b.A, ...b.B]) {
    const e = byId(m.anim);
    prev.ids.add(m.anim);
    prev.scheme[m.anim] = m.scheme;
    if (e) prev.level[e.pattern] = Math.max(prev.level[e.pattern] ?? 0, e.level);
  }
  for (const m of earlier.flatMap((x) => [...x.A, ...x.B])) if (m.scheme) (prev.tried[m.anim] ??= new Set()).add(m.scheme);
  return prev;
}

/** One move for a pattern at a target level: an exercise at that level, or the one just below, chosen by the seed.
 *  Never more than a level above the target (the stand-in pattern takes over instead), never one already in this
 *  session, and never below last block's level for the pattern. A move repeated from last block gets a new scheme. */
function pick(pattern: Pattern, level: number, max: number, kit: Set<Equipment>, input: ProgramInput, rand: () => number, used: Set<string>, mine: Set<string>, prev: Prev | null): ProgramMove | null {
  const ok = ladder(pattern, kit, input).filter((e) => e.level <= max && e.level <= level + 1 && !mine.has(e.id));
  if (!ok.length) return null;
  const fatigue = !!input.answers.fatigue;
  const top = Math.max(...ok.filter((e) => e.level <= level).map((e) => e.level), -1);
  const floor = prev?.level[pattern];
  // At their ceiling for this pattern: stay at last block's level, with a sibling they didn't do last block if there is
  // one. Pacing never steps up, so it swaps between the move and its seated version instead.
  const same = floor == null ? [] : fatigue ? ok.filter((e) => e.level <= top && e.level >= top - 1) : top <= floor ? ok.filter((e) => e.level >= floor && e.level <= Math.max(top, floor)) : [];
  let chosen: Exercise;
  if (same.length) {
    const order = [same.filter((e) => !prev!.ids.has(e.id) && !used.has(e.id)), same.filter((e) => !prev!.ids.has(e.id)), same.filter((e) => !used.has(e.id)), same];
    const pool = order.find((x) => x.length)!;
    chosen = pool[Math.floor(rand() * pool.length)];
  } else {
    // An exercise already in the other session beats a harder one; nothing easier than last block if it can be helped.
    const steady = floor != null && ok.some((e) => e.level >= floor) ? ok.filter((e) => e.level >= floor) : ok;
    const fresh = steady.filter((e) => !used.has(e.id)), all = fresh.length ? fresh : steady;
    const near = all.filter((e) => e.level === level || e.level === level - 1);
    const pool = near.length ? near : [all.reduce((best, e) => (Math.abs(e.level - level) < Math.abs(best.level - level) ? e : best))];
    // Prefer the target level two times in three.
    const atLevel = pool.filter((e) => e.level === level);
    chosen = atLevel.length && (rand() < 0.67 || atLevel.length === pool.length) ? atLevel[Math.floor(rand() * atLevel.length)] : pool[Math.floor(rand() * pool.length)];
  }
  used.add(chosen.id);
  mine.add(chosen.id);
  const easier = ladder(pattern, kit, input).filter((e) => e.level < chosen.level).pop();
  const base = SIDED[chosen.id] ?? REPS[pattern];
  // Pacing stays as it is; everyone else gets a different way of doing a move they did last block.
  let scheme: Scheme | undefined;
  if (!fatigue && prev?.ids.has(chosen.id)) {
    const options = schemesFor(pattern, base).filter((x) => x !== prev.scheme[chosen.id]);
    const unseen = options.filter((x) => !prev.tried[chosen.id]?.has(x)), from = unseen.length ? unseen : options;
    scheme = from[Math.floor(rand() * from.length)];
  }
  const holdLonger = scheme === "longer" || scheme === "smooth";
  return {
    name: chosen.name, anim: chosen.id, ...(easier ? { easier: easier.id } : {}),
    sets: fatigue ? 2 : pattern === "balance" || pattern === "carry" || pattern === "rotation" ? 2 : 3,
    reps: scheme ? (holdLonger ? base.replace(/^(\d+)/, (n) => String(Number(n) + 10)) : base + SCHEMES[scheme].reps) : base,
    cue: scheme ? `${SCHEMES[scheme].cue} ${chosen.cue}` : chosen.cue,
    ...(scheme ? { scheme } : {}),
  };
}

const STAND_IN: Record<Pattern, Pattern[]> = {
  // Pulls only stand in for pulls, so every session has one (the supported bottle row needs only a counter and a bottle).
  squat: ["lunge"], hinge: ["squat"], push: ["press"], press: ["push"], row: ["pulldown"], pulldown: ["row"],
  lunge: ["squat"], carry: ["calf", "balance"], core: ["rotation"], rotation: ["core"], balance: ["calf"], calf: ["balance"],
};

/** The two sessions for one block. Each session has a lower-body move, a push or press, a pull, a trunk move and a
 *  steadying move, and between them every main pattern. The seed decides the pairings and the exact exercises.
 *  `earlier` is the blocks before it as they had them (worked out afresh if not given), so a new block follows on. */
export function buildBlock(input: ProgramInput, seed: number, block: number, earlier?: Block[]): Block {
  if (!earlier) {
    earlier = [];
    for (let b = 0; b < block; b++) earlier.push(buildBlock(input, seed, b, [...earlier]));
  }
  const before = prevOf(earlier.filter((b) => b.block < block).sort((a, b) => a.block - b.block));
  const rand = rng(seed * 31 + block * 7919);
  const kit = kitFor(input);
  const { start, cap } = levels(input);
  // Pacing: sessions don't step up on their own, so the level stays where it started.
  const step = input.answers.fatigue ? 0 : block;
  const level = (p: Pattern) => Math.max(1, Math.min(cap[p], start + step));
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
  const session = (ps: Pattern[]) => {
    const mine = new Set<string>();
    return ps.map((p) => [p, ...STAND_IN[p]].reduce<ProgramMove | null>((m, q) => m ?? pick(q, level(q), cap[q], kit, input, rand, used, mine, before), null)).filter((m): m is ProgramMove => !!m);
  };
  return { block, A: session(plan.A), B: session(plan.B) };
}

/** The block for a given week on the plan (week 1 is block 0). */
export const blockOf = (weeksOnPlan: number) => Math.max(0, Math.floor((Math.max(1, weeksOnPlan) - 1) / WEEKS_PER_BLOCK));

/** A fresh programme record, or the same one with any missing block (or a rebuild if the inputs changed) added. */
export function withBlock(program: Program | null, input: ProgramInput, seed: number, block: number, now = new Date().toISOString()): Program {
  const key = inputsKey(input);
  const base: Program = program && program.inputs === key ? program : { v: PROGRAM_VERSION, seed: program?.seed ?? seed, inputs: key, builtAt: now, blocks: [] };
  const have = base.blocks.find((b) => b.block === block);
  if (have) {
    // A saved block is kept as it is, unless it has a floor move for someone who shouldn't get down to the floor.
    if (!unsafe(have, input)) return base;
    return { ...base, blocks: base.blocks.map((b) => (b === have ? safeBlock(have, input, base.seed) : b)) };
  }
  return { ...base, blocks: [...base.blocks, buildBlock(input, base.seed, block, base.blocks.filter((b) => b.block < block))].sort((a, b) => a.block - b.block) };
}

const noFloor = (input: ProgramInput) => !!(input.answers.floor || input.answers.pregnant);
const unsafe = (b: Block, input: ProgramInput) => noFloor(input) && [...b.A, ...b.B].some((m) => FLOOR.has(m.anim));

/** The block with each floor move swapped for the same slot from a fresh build (or left out if that's a repeat). */
function safeBlock(b: Block, input: ProgramInput, seed: number): Block {
  const fresh = buildBlock(input, seed, b.block);
  const fix = (ms: ProgramMove[], alt: ProgramMove[]) => ms.flatMap((m, i) => {
    if (!FLOOR.has(m.anim)) return [m];
    const swap = alt[i] && !FLOOR.has(alt[i].anim) ? alt[i] : alt.find((x) => byId(x.anim)?.pattern === byId(m.anim)?.pattern);
    return swap && !ms.some((x) => x.anim === swap.anim) ? [swap] : [];
  });
  return { ...b, A: fix(b.A, fresh.A), B: fix(b.B, fresh.B) };
}

/** Exercise ids in this block that weren't in any block before it, for "New this block". Empty for the first block. */
export function newInBlock(program: Program | null | undefined, block: number): Set<string> {
  const blocks = program?.blocks ?? [], now = blocks.find((b) => b.block === block);
  const earlier = blocks.filter((b) => b.block < block);
  if (!now || !earlier.length) return new Set();
  const seen = new Set(earlier.flatMap((b) => [...b.A, ...b.B].map((m) => m.anim)));
  return new Set([...now.A, ...now.B].map((m) => m.anim).filter((id) => !seen.has(id)));
}
