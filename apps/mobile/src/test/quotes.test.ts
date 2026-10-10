/// <reference types="node" />
// Today's thought: one a day, the same for everyone, all 60 before a repeat, and short, calm and number-free. Run with
// `npm test`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { addDays } from "@/data/dates";
import { QUOTES, quoteFor } from "@/data/quotes";

test("quotes: the same date always gives the same thought", () => {
  assert.equal(QUOTES.length, 60);
  assert.equal(quoteFor("2026-10-10"), quoteFor("2026-10-10"));
  assert.equal(quoteFor("2026-01-01"), QUOTES[0]);
});

test("quotes: consecutive days differ, and 60 days give all 60", () => {
  for (let i = 0; i < 400; i++) assert.notEqual(quoteFor(addDays("2026-03-01", i)), quoteFor(addDays("2026-03-01", i + 1)));
  for (const start of ["2025-12-15", "2026-03-28", "2026-10-24", "2027-06-01"]) {
    const run = Array.from({ length: 60 }, (_, i) => quoteFor(addDays(start, i)));
    assert.equal(new Set(run).size, 60, `from ${start}`);
  }
});

test("quotes: short, no exclamation marks, nothing about weight or dieting", () => {
  for (const q of QUOTES) {
    assert.ok(q.length <= 90, q);
    assert.ok(!q.includes("!"), q);
    // Whole words for the short units, so "wellbeing" doesn't read as "lb".
    assert.doesNotMatch(q, /weight|\bkgs?\b|\bstones?\b|\blbs?\b|calorie|diet/i, q);
  }
});
