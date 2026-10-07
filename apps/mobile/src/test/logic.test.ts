/// <reference types="node" />
// The app's pure logic: dates, units, the steady score, today's plan, journal maths, the health check and saved-data
// migration. Run with `pnpm --filter @landing/mobile test`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { addDays, daysBetween, isoDate, today, weekDates, weekdayIndex, weekStart } from "@/data/dates";
import { change, kgFromStLb, weight } from "@/data/units";
import { applyHealth, needsHealthCheck, proteinTargetsOff, referrals, sessionsPaused } from "@/state/health";
import { insights } from "@/state/journal";
import { weekScore } from "@/state/score";
import { demoState, freshState, migrate, sessionsInWeek, steadyZone, weekOf, type AppState } from "@/state/store";
import { headline, todayPlan } from "@/state/today";

const clone = (s: AppState): AppState => JSON.parse(JSON.stringify(s));

test("dates: weeks start on Monday and survive month ends", () => {
  assert.equal(weekdayIndex("2026-10-05"), 0);
  assert.equal(weekStart("2026-10-11"), "2026-10-05");
  assert.equal(weekStart("2026-11-01"), "2026-10-26");
  assert.deepEqual(weekDates("2026-10-07").slice(0, 2), ["2026-10-05", "2026-10-06"]);
  assert.equal(addDays("2026-03-28", 2), "2026-03-30"); // across the clocks going forward
  assert.equal(daysBetween("2026-10-25", "2026-10-26"), 1); // and back
  assert.equal(isoDate(new Date(2026, 0, 5, 23, 59)), "2026-01-05");
});

test("units: kilograms and stones and pounds", () => {
  assert.equal(weight(78.44, "kg"), "78.4 kg");
  assert.equal(weight(78.4, "stlb"), "12 st 5 lb");
  assert.equal(change(-0.45, "kg"), "0.5 kg");
  assert.equal(Math.round(kgFromStLb(12, 5) * 10) / 10, 78.5);
});

test("a new person starts empty, with no score and no check-in on day one", () => {
  const s = freshState();
  assert.equal(s.onboarded, false);
  assert.equal(s.demo, false);
  assert.equal(weekScore(s, addDays(weekStart(today()), -7)), null);
  s.onboarded = true; s.startedOn = today();
  assert.ok(!todayPlan(s).some((i) => i.id === "journal"), "no check-in about the day before they joined");
});

test("the plan week counts calendar weeks from the last injection", () => {
  const s = freshState();
  s.ob.lastInjection = weekStart(today());
  assert.equal(weekOf(s), 1);
  s.ob.lastInjection = addDays(weekStart(today()), -14);
  assert.equal(weekOf(s), 3);
});

test("steady score: full marks for a steady week, and none of it is a target", () => {
  const s = freshState();
  const monday = addDays(weekStart(today()), -7);
  s.ob.lastInjection = addDays(monday, -35);
  s.ob.lowestWeight = 80;
  for (const d of weekDates(monday)) s.days[d] = { habits: { protein: true, pause: true } };
  s.days[weekDates(monday)[1]].sessions = ["A"];
  s.days[weekDates(monday)[4]].sessions = ["B"];
  s.weights = weekDates(monday).map((date) => ({ date, kg: 80.5, source: "Logged by you" }));
  assert.equal(weekScore(s, monday)?.score, 100);
  s.weights = weekDates(monday).map((date) => ({ date, kg: 83.1, source: "Logged by you" })); // 1.5 kg over the zone
  assert.equal(weekScore(s, monday)?.score, 70);
  s.settings.safeMode = true; // check-ins replace the trend
  assert.equal(weekScore(s, monday)?.usedWeight, false);
});

test("sessions count only in their own week", () => {
  const s = freshState();
  s.days[addDays(weekStart(today()), -1)] = { sessions: ["A"] };
  assert.deepEqual(sessionsInWeek(s), []);
});

test("today's plan: next step, and safe wording for protein", () => {
  const s = demoState();
  const plan = todayPlan(s);
  assert.equal(plan[0].id, "journal");
  assert.match(headline(0, 5), /^Five small things/);
  assert.equal(headline(5, 5), "That's today done");
  s.settings.safeMode = true;
  const protein = todayPlan(s).find((i) => i.id === "protein");
  assert.ok(protein && protein.kind === "task" && !/ g /.test(protein.label));
});

test("health check: GP answers pause sessions, referrals switch filters on", () => {
  const s = freshState();
  applyHealth(s, { surgery: true, pregnant: true, joints: true });
  assert.equal(sessionsPaused(s), true);
  assert.deepEqual(referrals(s), ["pregnant"]);
  assert.equal(proteinTargetsOff(s), true);
  assert.equal(s.settings.safeMode, true);
  assert.ok(s.food.conditions.includes("pregnancy"));
  s.health.gpCleared = true;
  assert.equal(sessionsPaused(s), false);
  const t = clone(s);
  applyHealth(t, { surgery: false, pregnant: false });
  assert.ok(!t.food.conditions.includes("pregnancy"), "a yes that becomes a no is removed");
  assert.equal(needsHealthCheck(t), false);
  t.health.checkedAt = addDays(today(), -84);
  assert.equal(needsHealthCheck(t), true, "asked again after 12 weeks");
});

test("journal: patterns need enough days on both sides", () => {
  const s = demoState();
  const { ready, learning } = insights(s);
  assert.ok(ready.length > 0);
  for (const i of ready) for (const e of i.effects) assert.ok(e.nWith >= 7 && e.nWithout >= 7);
  s.journal.entries = {};
  assert.equal(insights(s).ready.length, 0);
  assert.ok(learning.length + ready.length > 0);
});

test("steady zone falls back to the first weigh-in", () => {
  const s = freshState();
  s.weights = [{ date: "2026-09-01", kg: 90, source: "x" }, { date: "2026-08-01", kg: 85, source: "x" }];
  assert.deepEqual(steadyZone(s), [85, 86.7]);
});

test("older saves are brought up to date", () => {
  const m = migrate({ v: 2, name: "Sam", onboarded: true, ob: { status: "stopped", lastInjection: "2026-09-01" }, protein: { Breakfast: 30 }, habits: { ids: ["protein"], today: { protein: true } }, weights: [{ date: "2026-10-01", kg: 80, source: "x" }], settings: { safeMode: true } });
  assert.ok(m);
  assert.equal(m.v, 3);
  assert.equal(m.name, "Sam");
  assert.equal(m.settings.safeMode, true);
  assert.equal(m.settings.units, "kg");
  assert.deepEqual(m.days, {});
  const again = migrate(JSON.parse(JSON.stringify({ ...m, settings: { safeMode: false } })));
  assert.equal(again?.settings.reminders.checkIn.on, false, "new settings get their defaults");
  assert.equal(migrate({ v: 1 }), null);
});

test("weekly content: a lesson for every week, habits that rotate, sessions that step up", async () => {
  const { WEEKLY_LESSONS, lessonFor } = await import("@/data/lessons");
  const { habitsForWeek } = await import("@/data/content");
  const { sessionFor } = await import("@/data/sessions");
  assert.equal(WEEKLY_LESSONS.length, 52);
  assert.equal(lessonFor(9).title, "Meals that hold you steady");
  assert.equal(lessonFor(99).title, lessonFor(52).title);
  assert.notDeepEqual(habitsForWeek(1), habitsForWeek(3));
  assert.deepEqual(habitsForWeek(10).slice(0, 2), ["proteinAll", "strength3"]);
  const s = freshState();
  s.ob.lastInjection = weekStart(today());
  assert.equal(sessionFor(s, "A").level, 1);
  s.ob.lastInjection = addDays(weekStart(today()), -7 * 14);
  const a3 = sessionFor(s, "A");
  assert.equal(a3.level, 3);
  assert.equal(a3.moves[0].reps, "12");
  assert.equal(a3.moves[0].sets, 4);
  s.workouts.feel = "Tough";
  assert.equal(sessionFor(s, "A").level, 2);
  s.health.answers.fatigue = true;
  assert.equal(sessionFor(s, "A").level, 1, "pacing: no automatic progression");
});

test("a third session in Settle weeks", async () => {
  const { nextSession } = await import("@/state/habits");
  const s = freshState();
  s.habits.ids = ["proteinAll", "strength3", "mealplan"];
  const d = weekDates(today());
  s.days[d[0]] = { sessions: ["A", "B"] };
  assert.equal(nextSession(s), "A");
  s.habits.ids = ["protein", "strength", "pause"];
  assert.equal(nextSession(s), null);
});

test("backup: an empty phone never replaces a real backup, and two plans that have never met are asked about", async () => {
  const { decide, forThisPhone } = await import("@/state/merge");
  const plan = { ...freshState(), onboarded: true, savedAt: "2026-10-01T09:00:00Z" };
  const blank = freshState();
  assert.equal(decide(blank, plan, false), "restore");
  assert.equal(decide(blank, null, false), "none");
  assert.equal(decide(plan, null, false), "upload");
  assert.equal(decide(plan, plan, false), "ask");
  assert.equal(decide({ ...plan, savedAt: "2026-10-02T09:00:00Z" }, plan, true), "upload");
  assert.equal(decide(plan, { ...plan, savedAt: "2026-10-02T09:00:00Z" }, true), "restore");
  assert.equal(decide({ ...plan, demo: true }, null, true), "none");
  // Restoring resets Apple Health (each phone asks permission) and keeps the newer acceptance of the health information.
  const restored = forThisPhone({ ...plan, settings: { ...plan.settings, appleHealth: true }, disclaimer: null }, { ...blank, disclaimer: { acceptedAt: "2026-10-07", version: 1 } });
  assert.equal(restored.settings.appleHealth, false);
  assert.equal(restored.disclaimer?.version, 1);
});
