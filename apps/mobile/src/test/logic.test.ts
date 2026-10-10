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

test("subscription periods read in words, trials in days", async () => {
  const { period } = await import("@/data/period");
  assert.equal(period("P1W"), "7 days");
  assert.equal(period("P3D"), "3 days");
  assert.equal(period("P1M"), "1 month");
  assert.equal(period("P1Y"), "1 year");
  assert.equal(period(null), "");
});

test("trial reminder: 9am two days before a week's trial ends, scaled for sandbox, never in the past", async () => {
  const { trialReminderAt } = await import("@/data/trial");
  const start = new Date(2026, 9, 9, 14, 30), end = new Date(2026, 9, 16, 14, 30);
  const at = trialReminderAt(end.toISOString(), start.toISOString(), start.getTime())!;
  assert.equal(at.getDate(), 14); assert.equal(at.getHours(), 9); assert.equal(at.getMinutes(), 0);
  // Unknown start: still the real-world rule.
  assert.equal(trialReminderAt(end.toISOString(), null, start.getTime())!.getHours(), 9);
  // Sandbox: a 7-day trial lasts 3 minutes, so the reminder comes about 51 seconds before the end.
  const sStart = Date.UTC(2026, 9, 9, 12), sEnd = sStart + 3 * 60 * 1000;
  const sAt = trialReminderAt(new Date(sEnd).toISOString(), new Date(sStart).toISOString(), sStart)!;
  assert.equal(Math.round((sEnd - sAt.getTime()) / 1000), 51);
  // Already inside the last two days: nothing to schedule.
  assert.equal(trialReminderAt(end.toISOString(), start.toISOString(), new Date(2026, 9, 15).getTime()), null);
});

test("rating prompt: only after a week of having the app, never within 120 days, milestones and hard days", async () => {
  const { mayAsk, checkInMilestone, hardDay, streak } = await import("@/data/review");
  const now = new Date("2026-10-09T12:00:00Z");
  assert.equal(mayAsk("2026-10-05T12:00:00Z", null, now), false);
  assert.equal(mayAsk("2026-10-01T12:00:00Z", null, now), true);
  assert.equal(mayAsk("2026-01-01T12:00:00Z", "2026-07-01T12:00:00Z", now), false);
  assert.equal(mayAsk("2026-01-01T12:00:00Z", "2026-06-01T12:00:00Z", now), true);
  const entries = (n: number, end: string) => Object.fromEntries(Array.from({ length: n }, (_, i) => [addDays(end, -i), { yes: {} }]));
  assert.equal(checkInMilestone({ journal: { questions: [], entries: entries(7, "2026-10-08") } }, "2026-10-08"), "first-week");
  assert.equal(checkInMilestone({ journal: { questions: [], entries: entries(8, "2026-10-08") } }, "2026-10-08"), null);
  assert.equal(streak({ journal: { questions: [], entries: entries(28, "2026-10-08") } }, "2026-10-08"), 28);
  assert.equal(checkInMilestone({ journal: { questions: [], entries: entries(28, "2026-10-08") } }, "2026-10-08"), "four-week-streak");
  assert.equal(hardDay({ weights: [] }, "2026-10-08", { yes: {}, energy: 2 }), true);
  assert.equal(hardDay({ weights: [] }, "2026-10-08", { yes: {}, energy: 4, fullness: 3 }), false);
  assert.equal(hardDay({ weights: [{ date: "2026-10-09", kg: 80.4, source: "x" }, { date: "2026-10-08", kg: 80, source: "x" }] }, "2026-10-08", { yes: {} }), true);
});

test("check-in reminders: daily at the chosen time from the day after onboarding, rotating wording, skipping days done", async () => {
  const { checkInSchedule, CHECK_IN_VARIANTS } = await import("@/data/reminders");
  const now = new Date(2026, 9, 9, 10, 0); // Friday 9 October, 10am: today's 8am has passed
  const s = { startedOn: "2026-10-09", journal: { entries: {} as Record<string, unknown> } };
  const all = checkInSchedule(s, 8, 0, now, 7);
  assert.equal(all[0].day, "2026-10-10");
  assert.equal(all[0].at.getHours(), 8);
  assert.equal(all.length, 6);
  assert.notEqual(all[0].title, all[1].title);
  assert.equal(new Set(all.slice(0, 5).map((n) => n.title)).size, CHECK_IN_VARIANTS.length);
  // Yesterday's check-in already done before the reminder: no reminder that morning.
  s.journal.entries["2026-10-10"] = { yes: {} };
  assert.equal(checkInSchedule(s, 8, 0, now, 7).some((n) => n.day === "2026-10-11"), false);
});

test("strength programme: personal, safe for the health check, matched to kit, and stepping up by block", async () => {
  const { buildBlock, kitFor, withBlock, blockOf } = await import("@/data/program");
  const { byId } = await import("@landing/motion");
  const home = { at: "home" as const, kit: [], answers: {}, perWeek: 2 };
  const a = buildBlock(home, 12345, 0), b = buildBlock(home, 12345, 0);
  assert.deepEqual(a, b, "same seed, same plan");
  assert.equal(a.A.length, 5); assert.ok(a.B.length >= 5);
  const ids = (x: typeof a) => [...x.A, ...x.B].map((m) => m.anim).join();
  const seen = new Set(Array.from({ length: 40 }, (_, i) => ids(buildBlock(home, 1000 + i * 7919, 0))));
  assert.ok(seen.size >= 10, `40 people should get many different plans (got ${seen.size})`);
  // Only kit they have at home.
  const kit = kitFor(home);
  for (const m of [...a.A, ...a.B]) assert.ok(byId(m.anim)!.equipment.every((q) => kit.has(q)), `${m.anim} needs kit they don't have`);
  // A gym plan can use gym kit; a later block is harder.
  const gymIds = Array.from({ length: 10 }, (_, i) => ids(buildBlock({ ...home, at: "gym" }, 50 + i, 2))).join();
  assert.match(gymIds, /squat-6|hinge-6|row-6|pulldown-5|press-6|push-6|lunge-6/);
  const level = (x: typeof a) => [...x.A, ...x.B].reduce((n, m) => n + byId(m.anim)!.level, 0);
  assert.ok(level(buildBlock(home, 9, 3)) > level(buildBlock(home, 9, 0)));
  // Floor work left out when getting down is hard; pacing keeps everything easy with fewer sets.
  const floor = buildBlock({ ...home, answers: { floor: true } }, 7, 2);
  assert.ok([...floor.A, ...floor.B].every((m) => !/hinge-1|push-4|push-5|core-2|core-4|core-5|rotation-2|rotation-3|rotation-5/.test(m.anim)));
  const tired = buildBlock({ ...home, answers: { fatigue: true } }, 7, 4);
  assert.ok([...tired.A, ...tired.B].every((m) => byId(m.anim)!.level <= 2 && m.sets === 2));
  // Falls: balance in both sessions.
  const falls = buildBlock({ ...home, answers: { falls: true } }, 7, 0);
  assert.ok(falls.A.some((m) => m.anim.startsWith("balance")) && falls.B.some((m) => m.anim.startsWith("balance")));
  // Blocks are kept once built; changing kit rebuilds with the same seed.
  const p1 = withBlock(null, home, 77, 0, "t");
  assert.equal(withBlock(p1, home, 99, 0, "t"), p1);
  const p2 = withBlock(p1, { ...home, kit: ["dumbbells"] }, 99, 0, "t");
  assert.equal(p2.seed, 77); assert.notEqual(p2.inputs, p1.inputs);
  assert.equal(blockOf(1), 0); assert.equal(blockOf(8), 0); assert.equal(blockOf(9), 1);
});

test("plans: everyone gets their own seeds, meals differ by person and week, and both plans are saved for the backup", async () => {
  const { ensurePlans, seedPlans } = await import("@/state/plans");
  const { weekSeed } = await import("@/state/food");
  const { sessionFor } = await import("@/data/sessions");
  const s = freshState(); s.onboarded = true; s.food.joinedWeek = 1;
  seedPlans(s);
  const t = freshState(); seedPlans(t);
  assert.notEqual(s.food.seed, t.food.seed, "two people, two seeds");
  assert.notEqual(weekSeed(s), weekSeed(t));
  assert.notEqual(weekSeed(s), weekSeed(s, 1), "next week differs");
  ensurePlans(s);
  assert.ok(s.food.plan?.week, "this week's meals saved in the plan");
  assert.equal(s.program?.blocks.length, 1, "first strength block saved");
  const saved = JSON.stringify(s.program), seed = s.food.seed;
  ensurePlans(s);
  assert.equal(JSON.stringify(s.program), saved, "nothing changes when nothing is due");
  assert.equal(s.food.seed, seed);
  assert.deepEqual(sessionFor(s, "A").moves.map((m) => m.anim), s.program!.blocks[0].A.map((m) => m.anim), "sessions come from their own programme");
  // The backup is the app state, so a round trip keeps both plans.
  const back = migrate(JSON.parse(JSON.stringify(s)))!;
  assert.deepEqual(back.program, s.program); assert.deepEqual(back.food.plan, s.food.plan);
});

test("cook-along: timers, ingredients and swaps found in recipe steps", async () => {
  const { timersIn, ingredientsIn, withSwaps, clock } = await import("@/data/cook");
  const two = timersIn("Microwave for 45 seconds, stir, then 30 seconds at a time until just set.");
  assert.deepEqual(two.map((t) => [t.label, t.seconds]), [["Microwave", 45], ["Microwave again", 30]]);
  const range = timersIn("Roast for 18 to 20 minutes, until the chicken is cooked through.")[0];
  assert.equal(range.seconds, 1080); assert.equal(range.upTo, 1200); assert.equal(range.text, "18 to 20 min"); assert.equal(range.label, "Roast");
  assert.equal(timersIn("Boil the eggs for 9 minutes, then cool under cold water and peel.")[0].label, "Boil eggs");
  assert.equal(timersIn("Spread the cottage cheese over the crispbreads.").length, 0);
  const porridge = timersIn("Mix the oats and milk in a big microwave-safe bowl. Cook for 2 minutes, stir, then 1 minute more.");
  assert.deepEqual(porridge.map((t) => [t.label, t.seconds]), [["Cook", 120], ["Cook again", 60]]);
  const names: Record<string, string> = { chicken: "chicken thighs", tofu: "firm tofu", rice: "microwave rice", peas: "frozen peas" };
  const name = (id: string) => names[id] ?? id;
  assert.deepEqual(ingredientsIn("Add the rice and peas, then the chicken thighs.", ["chicken", "rice", "peas", "tofu"], name), ["chicken", "rice", "peas"]);
  assert.equal(withSwaps("Add the chicken thighs. Chicken thighs cook fast.", [{ from: "chicken", to: "tofu" }], name), "Add the firm tofu. Firm tofu cook fast.");
  assert.equal(clock(65), "1:05"); assert.equal(clock(3725), "1:02:05"); assert.equal(clock(0), "0:00");
});
