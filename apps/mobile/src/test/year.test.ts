/// <reference types="node" />
// The year's shape: getting ready before the last jab, the 52 weeks, year two after them, weeks on the plan for late
// joiners and old saves, the tips, the lessons and logging a meal twice. Run with `npm test`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { habitsForWeek, phaseOf, TIPS, tipFor } from "@/data/content";
import { addDays, today, weekStart } from "@/data/dates";
import { lessonByKey, lessonForWeek, PREP_LESSONS, YEAR_TWO_LESSONS, yearTwoLessonFor } from "@/data/lessons";
import { isTicked, logMeal, logProtein } from "@/state/habits";
import { lookBackDue } from "@/state/plans";
import { freshState, gettingReady, habitsNow, jabWeek, mealsLogged, migrate, monthOnPlan, proteinToday, setLastJab, stageOf, weekOf, weeksOnPlan, weeksToLastJab, yearTwoWeek } from "@/state/store";

const monday = weekStart(today());

test("getting ready: a last jab still to come isn't week 1 of Land", () => {
  const s = freshState();
  s.ob.lastInjection = addDays(today(), 30);
  assert.ok(gettingReady(s));
  assert.equal(stageOf(s).key, "ready");
  assert.equal(weeksToLastJab(s), 5);
  assert.equal(weekOf(s), 1, "weekOf still gives existing callers week 1");
  assert.ok(jabWeek(s) <= 0);
  assert.deepEqual(habitsNow(s).ids, habitsForWeek(1), "week 1's habits");
  // The date passing starts week 1.
  assert.equal(stageOf(s, addDays(today(), 30)).key, "land");
  assert.ok(!gettingReady(s, addDays(today(), 30)));
  // Saying it's happened sets the date and the status.
  s.ob.status = "soon";
  setLastJab(s, today());
  assert.equal(s.ob.status, "stopped");
  assert.equal(jabWeek(s), 1);
  assert.equal(stageOf(s).key, "land");
});

test("week 52 to 53: year two begins, and phaseOf never breaks", () => {
  const s = freshState();
  s.ob.lastInjection = addDays(monday, -51 * 7);
  assert.equal(jabWeek(s), 52); assert.equal(yearTwoWeek(s), 0); assert.equal(stageOf(s).key, "steady");
  s.ob.lastInjection = addDays(monday, -52 * 7);
  assert.equal(jabWeek(s), 53); assert.equal(weekOf(s), 52, "content week stays capped");
  assert.equal(yearTwoWeek(s), 1); assert.equal(stageOf(s).key, "yearTwo");
  assert.equal(phaseOf(0).key, "ready"); assert.equal(phaseOf(26).key, "settle"); assert.equal(phaseOf(27).key, "steady"); assert.equal(phaseOf(200).key, "yearTwo");
  assert.equal(habitsForWeek(53).length, 3);
  assert.deepEqual(habitsForWeek(53), habitsForWeek(27));
  assert.notDeepEqual(habitsNow(s).week, habitsNow(s, addDays(today(), 7)).week, "habits move on each week in year two");
});

test("year two: own habit in place of 'Your own routine', without doubling up", () => {
  const s = freshState();
  s.ob.lastInjection = addDays(monday, -52 * 7);
  assert.equal(habitsNow(s).ids[0], "ownRoutine");
  s.ownHabit = "walk";
  const ids = habitsNow(s).ids;
  assert.equal(ids[0], "walk");
  assert.equal(new Set(ids).size, 3);
});

test("weeks on the plan: uncapped from starting, for late joiners and old saves", () => {
  const s = freshState();
  s.ob.lastInjection = addDays(monday, -66 * 7); // week 67, in year two
  s.startedOn = addDays(monday, -40 * 7); // joined at week 27
  assert.equal(weeksOnPlan(s), 41, "counts past week 52 from the jab");
  assert.equal(monthOnPlan(s), 10);
  s.startedOn = null; s.food.joinedWeek = 27;
  s.ob.lastInjection = addDays(monday, -60 * 7);
  assert.equal(weeksOnPlan(s), 35, "old save: from the week they joined, uncapped");
  s.food.joinedWeek = null;
  assert.equal(weeksOnPlan(s), 61, "no joined week: from the last jab");
  // An old save without the new fields still loads.
  const old = migrate(JSON.parse(JSON.stringify({ ...freshState(), startedOn: undefined, phaseSeen: "land" })))!;
  assert.ok(old);
  assert.equal(weeksOnPlan(old) >= 1, true);
});

test("the month's look-back is due on each four-week anniversary, once", () => {
  const s = freshState(); s.onboarded = true;
  s.startedOn = addDays(monday, -4 * 7);
  assert.ok(lookBackDue(s));
  s.lookBackSeen = 1;
  assert.ok(!lookBackDue(s));
  s.startedOn = addDays(monday, -5 * 7);
  s.lookBackSeen = undefined;
  assert.ok(!lookBackDue(s), "not in the weeks between");
  s.startedOn = monday;
  assert.ok(!lookBackDue(s), "not in the first month");
});

test("tips: a pool for every phase, rotating daily with no repeats in a week", () => {
  for (const key of ["ready", "land", "settle", "steady", "yearTwo"] as const) {
    assert.ok(TIPS[key].length >= 7);
    const week = Array.from({ length: 7 }, (_, i) => tipFor(key, addDays(monday, i)));
    assert.equal(new Set(week).size, 7, `${key}: no repeats in a week`);
  }
  assert.notEqual(tipFor("land", monday), tipFor("land", addDays(monday, 1)));
  assert.ok(TIPS.evening.includes(tipFor("land", monday, true)));
  const all = Object.values(TIPS).flat().join(" ");
  assert.doesNotMatch(all, /cheat|fail|willpower|back on track|goal weight|journey|guilt-free|detox|superfood/i);
});

test("lessons: getting ready, the year, and year two with refreshers", () => {
  assert.equal(PREP_LESSONS.length, 8); assert.equal(YEAR_TWO_LESSONS.length, 12);
  assert.equal(lessonForWeek(0, 1).key, "r1");
  assert.equal(lessonForWeek(-3, 9).key, "r1", "cycles after eight weeks");
  assert.equal(lessonForWeek(12).key, "w12");
  const first = yearTwoLessonFor(1), next = yearTwoLessonFor(2), month2 = yearTwoLessonFor(5);
  assert.ok(!first.refresher); assert.ok(next.refresher); assert.ok(!month2.refresher);
  assert.notEqual(first.lesson.title, month2.lesson.title);
  assert.equal(lessonByKey(first.key)?.title, first.lesson.title);
  assert.equal(lessonByKey(next.key)?.title, next.lesson.title);
  assert.equal(lessonByKey("x1"), null);
});

test("quick log: a second entry adds to the meal, and Habit Only meals count without grams", () => {
  const s = freshState();
  logProtein(s, "Snack", 15);
  logProtein(s, "Snack", 20);
  assert.equal(proteinToday(s), 35);
  assert.equal(mealsLogged(s), 1);
  s.habits.ids = ["protein", "strength", "pause"];
  logProtein(s, "Breakfast", 15); logProtein(s, "Breakfast", 12);
  assert.ok(s.days[today()].habits?.protein, "breakfast adding up to 25 g ticks the habit");
  logMeal(s, "Lunch"); logMeal(s, "Lunch"); logMeal(s, "Dinner");
  assert.equal(mealsLogged(s), 4);
  assert.equal(proteinToday(s), 62, "no grams added for meals without them");
});

test("weekly habits count once in the week", () => {
  const s = freshState();
  const tue = addDays(monday, 1);
  if (tue > today()) return; // Monday: nothing earlier in the week to tick
  s.days[tue] = { habits: { mealplan: true } };
  assert.ok(isTicked(s, "mealplan"));
  assert.ok(!isTicked(s, "pause"));
});
