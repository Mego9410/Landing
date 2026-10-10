/// <reference types="node" />
// The strength programme across a whole year, and the scores and history on Progress. Run with
// `pnpm --filter @landing/mobile test`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { byId, EXERCISES, PATTERNS } from "@landing/motion";
import { buildBlock, kitFor, ladder, withBlock, type Block, type Program, type ProgramInput } from "@/data/program";
import { addDays, today, weekDates, weekStart } from "@/data/dates";
import { scoreHistory, steadiestStretch, weekScore } from "@/state/score";
import { freshState, weekOf } from "@/state/store";

const home: ProgramInput = { at: "home", kit: [], answers: {}, perWeek: 2 };
const PROFILES: Record<string, ProgramInput> = {
  "home, no kit": home,
  "home, dumbbells": { ...home, kit: ["dumbbells"] },
  gym: { ...home, at: "gym" },
  fatigue: { ...home, answers: { fatigue: true } },
  "falls and floor": { ...home, answers: { falls: true, floor: true } },
  "pregnant, band": { ...home, kit: ["band"], answers: { pregnant: true } },
  "pregnant, no kit": { ...home, answers: { pregnant: true } },
  joints: { ...home, answers: { joints: true } },
  "gym, three a week": { ...home, at: "gym", perWeek: 3 },
};
const SEEDS = Array.from({ length: 25 }, (_, i) => 1000 + i * 7919);

/** A year of blocks (0 to 6), built one at a time as the app does. */
function year(input: ProgramInput, seed: number): Block[] {
  let p: Program | null = null;
  for (let b = 0; b <= 6; b++) p = withBlock(p, input, seed, b, "t");
  return p!.blocks;
}
const levelOf = (id: string) => byId(id)!.level;
const LEGACY_FLOOR = /^(hinge-1|push-4|push-5|press-4|row-1|row-5|pulldown-3|core-1|core-2|core-4|core-5|core-6|rotation-2|rotation-3|rotation-5|rotation-6)$/;
/** A floor move: the library's own flag (worked out from the poses), or one of the original list. */
const FLOOR = { test: (id: string) => LEGACY_FLOOR.test(id) || !!byId(id)?.floor };

test("no floor moves for anyone who finds the floor hard, or in pregnancy, in any block", () => {
  for (const answers of [{ floor: true }, { pregnant: true }, { falls: true, floor: true }]) {
    for (const kit of [[], ["band"], ["dumbbells"]]) {
      for (const seed of SEEDS) {
        for (const b of year({ ...home, kit, answers }, seed)) {
          const bad = [...b.A, ...b.B].find((m) => FLOOR.test(m.anim));
          assert.equal(bad, undefined, `${JSON.stringify(answers)} ${kit} seed ${seed} block ${b.block}: ${bad?.anim}`);
        }
      }
    }
  }
});

test("every session has a pull, five or more moves, and no move twice", () => {
  for (const [name, input] of Object.entries(PROFILES)) {
    for (const seed of SEEDS) {
      for (const b of year(input, seed)) {
        for (const s of [b.A, b.B]) {
          const ids = s.map((m) => m.anim);
          assert.equal(new Set(ids).size, ids.length, `${name} seed ${seed} block ${b.block}: ${ids}`);
          assert.ok(ids.some((id) => /^(row|pulldown)-/.test(id)), `${name} seed ${seed} block ${b.block}: no pull in ${ids}`);
          assert.ok(s.length >= 5, `${name} seed ${seed} block ${b.block}: ${s.length} moves`);
        }
      }
    }
  }
});

test("levels stay under the health check caps and never jump more than a level past the plan", () => {
  for (const seed of SEEDS) {
    for (const b of year({ ...home, answers: { pregnant: true } }, seed)) assert.ok([...b.A, ...b.B].every((m) => levelOf(m.anim) <= 3));
    for (const b of year({ ...home, answers: { bones: true } }, seed)) assert.ok([...b.A, ...b.B].filter((m) => m.anim.startsWith("hinge")).every((m) => levelOf(m.anim) <= 2));
    for (const b of year({ ...home, answers: { falls: true } }, seed)) assert.ok([...b.A, ...b.B].filter((m) => /^(balance|lunge)/.test(m.anim)).every((m) => levelOf(m.anim) <= 3));
    // Home, no kit, block 0 aims at level 2: nothing above 3 (the table row used to turn up here at level 5).
    const first = buildBlock(home, seed, 0);
    assert.ok([...first.A, ...first.B].every((m) => levelOf(m.anim) <= 3), `seed ${seed}: ${[...first.A, ...first.B].map((m) => m.anim)}`);
  }
});

test("pacing never steps up, and keeps two sets", () => {
  for (const seed of SEEDS) {
    for (const b of year({ ...home, answers: { fatigue: true } }, seed)) {
      for (const m of [...b.A, ...b.B]) {
        assert.equal(m.sets, 2);
        assert.equal(m.scheme, undefined);
        // Level 1 (or its seated version), unless nothing at level 1 suits their kit.
        assert.ok(levelOf(m.anim) <= 1 || !/^(squat|push|press|lunge|carry|core|balance|calf)/.test(m.anim), `seed ${seed} block ${b.block}: ${m.anim}`);
      }
    }
  }
});

test("once a pattern can't step up, each block still differs from the one before, and never drops a level", () => {
  for (const [name, input] of Object.entries(PROFILES)) {
    if (input.answers.fatigue) continue;
    for (const seed of SEEDS) {
      const blocks = year(input, seed);
      for (let i = 1; i < blocks.length; i++) {
        const key = (b: Block) => [...b.A, ...b.B].map((m) => `${m.anim}|${m.reps}`).sort().join();
        assert.notEqual(key(blocks[i]), key(blocks[i - 1]), `${name} seed ${seed}: block ${i} same as block ${i - 1}`);
        // A move repeated from the block before is done a different way.
        const before = new Map([...blocks[i - 1].A, ...blocks[i - 1].B].map((m) => [m.anim, m.scheme]));
        for (const m of [...blocks[i].A, ...blocks[i].B]) {
          if (before.has(m.anim)) assert.ok(m.scheme && m.scheme !== before.get(m.anim), `${name} seed ${seed} block ${i}: ${m.anim} repeated as it was`);
        }
        // The hardest exercise of each pattern never goes down from one block to the next.
        const top = (b: Block) => { const t: Record<string, number> = {}; for (const m of [...b.A, ...b.B]) { const e = byId(m.anim)!; t[e.pattern] = Math.max(t[e.pattern] ?? 0, e.level); } return t; };
        const was = top(blocks[i - 1]), now = top(blocks[i]);
        for (const p in now) if (was[p] != null) assert.ok(now[p] >= was[p], `${name} seed ${seed} block ${i}: ${p} went from ${was[p]} to ${now[p]}`);
      }
    }
  }
});

test("saved blocks stay as they are; a saved floor move is swapped out for someone who can't get down", () => {
  const p = withBlock(null, home, 5, 0, "t");
  assert.equal(withBlock(p, home, 5, 0, "t"), p);
  const floorInput = { ...home, answers: { floor: true } };
  const saved = withBlock(null, floorInput, 5, 0, "t");
  const old: Program = { ...saved, blocks: [{ ...saved.blocks[0], A: [{ name: "Table row", anim: "row-5", sets: 3, reps: "10", cue: "" }, ...saved.blocks[0].A.slice(1)] }] };
  const fixed = withBlock(old, floorInput, 5, 0, "t");
  assert.ok(![...fixed.blocks[0].A, ...fixed.blocks[0].B].some((m) => FLOOR.test(m.anim)));
  assert.deepEqual(fixed.blocks[0].B, old.blocks[0].B, "the rest of the block is kept");
});

test("a perfect week with a swapped habit scores full marks", () => {
  const s = freshState(); s.onboarded = true;
  s.ob.lastInjection = addDays(weekStart(today()), -7 * 3);
  const week = weekOf(s);
  const last = addDays(weekStart(today()), -7);
  const days = weekDates(last);
  const ids = ["protein", "strength", "water"];
  const fill = (swap: string) => {
    for (const d of days) s.days[d] = { habits: { protein: true, [swap]: true } };
    s.days[days[0]].sessions = ["A"]; s.days[days[2]].sessions = ["B"];
    for (const d of days) s.journal.entries[d] = { yes: {} };
  };
  s.settings.safeMode = true;
  // Last week, with its third habit swapped for "table": the slot still counts.
  s.habits = { week, ids, swappedFrom: null };
  fill("table");
  assert.equal(weekScore(s, last)!.score, 100);
  // This week's own habits (as swapped) are the ones that count.
  const monday = weekStart(today());
  s.habits = { week, ids: ["protein", "strength", "table"], swappedFrom: "water" };
  for (const d of weekDates(monday)) s.days[d] = { habits: { protein: true, table: true } };
  s.days[monday].sessions = ["A", "B"];
  for (const d of weekDates(monday)) s.journal.entries[d] = { yes: {} };
  assert.equal(weekScore(s, monday)!.score, 100);
});

test("score history and the steadiest stretch", () => {
  const s = freshState();
  s.ob.lastInjection = addDays(weekStart(today()), -7 * 20);
  assert.equal(scoreHistory(s).length, 12);
  assert.ok(scoreHistory(s).every((h) => h.score == null));
  const h = [60, 70, null, 80, 85, 82, 50].map((score, i) => ({ week: 10 + i, score }));
  assert.deepEqual(steadiestStretch(h), { from: 13, to: 15 });
  assert.equal(steadiestStretch([{ week: 1, score: 50 }, { week: 2, score: null }]), null);
});

test("the library's floor flag covers every move on the original floor list", () => {
  for (const e of EXERCISES) if (LEGACY_FLOOR.test(e.id)) assert.ok(e.floor, e.id);
});

test("pregnancy: nothing lying on the back and no loaded twisting; falls: no unsupported single-leg work", () => {
  for (const kit of [[], ["band"], ["dumbbells"], ["kettlebell"]]) {
    for (const seed of SEEDS) {
      for (const b of year({ ...home, kit, answers: { pregnant: true } }, seed)) {
        const bad = [...b.A, ...b.B].find((m) => byId(m.anim)!.supine || byId(m.anim)!.twist);
        assert.equal(bad, undefined, `pregnant ${kit} seed ${seed} block ${b.block}: ${bad?.anim}`);
      }
      for (const b of year({ ...home, kit, answers: { falls: true } }, seed)) {
        const bad = [...b.A, ...b.B].find((m) => byId(m.anim)!.unsteady);
        assert.equal(bad, undefined, `falls ${kit} seed ${seed} block ${b.block}: ${bad?.anim}`);
      }
    }
  }
});

const VARIETY: Record<string, ProgramInput> = {
  ...PROFILES,
  "home, band": { ...home, kit: ["band"] },
  "home, kettlebell": { ...home, kit: ["kettlebell"] },
  bones: { ...home, answers: { bones: true } },
};

test("every level a profile actually reaches has at least two different exercises for it", () => {
  for (const [name, input] of Object.entries(VARIETY)) {
    const reached = new Set<string>();
    for (const seed of SEEDS) for (const b of year(input, seed)) for (const m of [...b.A, ...b.B]) { const e = byId(m.anim)!; reached.add(`${e.pattern}:${e.level}`); }
    for (const slot of reached) {
      const [pattern, level] = slot.split(":");
      const n = ladder(pattern as (typeof PATTERNS)[number]["id"], kitFor(input), input).filter((e) => e.level === Number(level)).length;
      assert.ok(n >= 2, `${name}: only ${n} option at ${slot}`);
    }
  }
});

test("at the same level as the block before, a different exercise is chosen when there is one", () => {
  for (const [name, input] of Object.entries(VARIETY)) {
    for (const seed of SEEDS) {
      const blocks = year(input, seed);
      for (let i = 1; i < blocks.length; i++) {
        const before = new Set([...blocks[i - 1].A, ...blocks[i - 1].B].map((m) => m.anim));
        const now = [...blocks[i].A, ...blocks[i].B].map((m) => m.anim);
        for (const id of now.filter((x) => before.has(x))) {
          const e = byId(id)!;
          // A repeat is only allowed when every other option at that level is already in this block or was last block.
          const others = ladder(e.pattern, kitFor(input), input).filter((x) => x.level === e.level && x.id !== id && !now.includes(x.id) && !before.has(x.id));
          assert.equal(others.length, 0, `${name} seed ${seed} block ${i}: repeated ${id} though ${others.map((x) => x.id)} was free`);
        }
      }
    }
  }
});

test("capped profiles meet many more distinct moves across the year", () => {
  for (const [name, input, least] of [["falls and floor", { ...home, answers: { falls: true, floor: true } }, 24], ["pregnant, no kit", { ...home, answers: { pregnant: true } }, 24], ["fatigue", { ...home, answers: { fatigue: true } }, 22]] as const) {
    for (const seed of SEEDS) {
      const ids = new Set(year(input, seed).flatMap((b) => [...b.A, ...b.B].map((m) => m.anim)));
      assert.ok(ids.size >= least, `${name} seed ${seed}: only ${ids.size} distinct moves`);
    }
  }
});
