/// <reference types="node" />
// Plan and Progress helpers: the shopping list count, the week's sessions with the day each was done, and a habit's
// week grid. Run with `npm test`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { today, weekDates } from "@/data/dates";
import { shoppingCount } from "@/state/food";
import { habitWeekGrid, weekSessions } from "@/state/habits";
import { demoState } from "@/state/store";

test("plan: the shopping list count is the items across its aisles", () => {
  const s = demoState();
  assert.ok(shoppingCount(s) > 5);
});

test("plan: the week's sessions pair each one with the day it was done", () => {
  const s = demoState(), [mon] = weekDates(today());
  assert.deepEqual(weekSessions(s).map((x) => [x.id, x.doneOn]), [["A", null], ["B", null]]);
  s.days[mon] = { ...s.days[mon], sessions: ["A"] };
  assert.deepEqual(weekSessions(s).map((x) => [x.id, x.doneOn]), [["A", mon], ["B", null]]);
  // A third session in weeks that aim for three: A, B, then A again, matched in the order they were done.
  s.habits.ids = s.habits.ids.map((id) => (id === "strength" ? "strength3" : id));
  if (!s.habits.ids.includes("strength3")) s.habits.ids.push("strength3");
  s.days[mon] = { ...s.days[mon], sessions: ["A", "A"] };
  assert.deepEqual(weekSessions(s).map((x) => [x.id, x.doneOn]), [["A", mon], ["B", null], ["A", mon]]);
});

test("progress: a habit's week grid marks done days, missed past days and days to come", () => {
  const s = demoState(), t = today(), dates = weekDates(t);
  const grid = habitWeekGrid(s, "protein");
  assert.equal(grid.length, 7);
  dates.forEach((d, i) => {
    if (d > t) assert.equal(grid[i], "future");
    else assert.equal(grid[i], s.days[d]?.habits?.protein ? "done" : "missed");
  });
  s.days[dates[0]] = { ...s.days[dates[0]], sessions: ["A"] };
  assert.equal(habitWeekGrid(s, "sessions")[0], "done");
});
