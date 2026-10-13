/// <reference types="node" />
// Today's tip: one a day, the same for everyone, all 60 before a repeat, and short, calm and free of numbers to hit.
// Run with `npm test`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { addDays } from "@/data/dates";
import { TIPS, tipFor } from "@/data/tips";

test("tips: the same date gives the same tip, consecutive days differ, and 60 days give all 60", () => {
  assert.equal(TIPS.length, 60);
  assert.equal(new Set(TIPS).size, 60);
  assert.equal(tipFor("2026-10-13"), tipFor("2026-10-13"));
  for (let i = 0; i < 400; i++) assert.notEqual(tipFor(addDays("2026-03-01", i)), tipFor(addDays("2026-03-01", i + 1)));
  for (const start of ["2025-12-15", "2026-10-24", "2027-06-01"]) {
    assert.equal(new Set(Array.from({ length: 60 }, (_, i) => tipFor(addDays(start, i)))).size, 60, `from ${start}`);
  }
});

test("tips: short, calm and nothing about weight, dieting or banned words", () => {
  for (const t of TIPS) {
    assert.ok(t.length <= 115, t);
    assert.ok(!t.includes("!"), t);
    assert.doesNotMatch(t, /weight|\bkgs?\b|\blbs?\b|calorie|diet|cheat|fail|willpower|back on track|journey|guilt|detox|superfood|\bdose|\bjab/i, t);
  }
});
