// Run: pnpm --filter @landing/engine test
import assert from "node:assert/strict";
import { test } from "node:test";
import { INGREDIENT, RECIPES } from "@landing/content";
import {
  dayTotals, library, personalise, planWeek, profile, rename, replaceMeal, shoppingList, swapOptions, targets, weekSummary,
  quantity, emptyWeek, setMeal, leftoverOptions, progress, type Diet, type Profile, type Week,
} from "../src/index.ts";

const opts = { includeDrafts: true };
const planned = (w: Week) => w.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner, ...d.snacks]).filter((m) => m.recipe);
const linesOf = (w: Week, p: Profile) => planned(w).flatMap((m) => {
  const x = personalise(RECIPES.find((r) => r.id === m.recipe)!, p);
  return x.topUp ? [...x.lines, { i: x.topUp.i, g: x.topUp.g }] : x.lines;
}).map((l) => INGREDIENT[l.i]);

test("every recipe suits the default profile with no swaps", () => {
  for (const r of RECIPES) {
    const x = personalise(r, profile({ kit: ["hob", "oven", "microwave", "kettle"], maxMinutes: 30 }));
    assert.ok(x.ok, `${r.id}: ${x.blocked.join(", ")}`);
    assert.equal(x.swaps.length, 0, r.id);
  }
});

test("only approved recipes are planned unless drafts are asked for", () => {
  assert.equal(library(profile()).length, RECIPES.filter((r) => r.review.status === "approved").length);
  assert.ok(library(profile(), opts).length > 50);
});

const DIETS: Record<Diet, (i: (typeof INGREDIENT)[string]) => boolean> = {
  none: () => true,
  vegetarian: (i) => !["beef", "lamb", "pork", "poultry", "fish", "shellfish"].includes(i.kind),
  vegan: (i) => i.kind === "plant" && !i.allergens.includes("eggs") && !i.allergens.includes("milk") && i.id !== "honey",
  pescatarian: (i) => !["beef", "lamb", "pork", "poultry"].includes(i.kind),
  halal: (i) => i.kind !== "pork",
  kosher: (i) => i.kind !== "pork" && i.kind !== "shellfish",
  "veg-no-egg": (i) => !["beef", "lamb", "pork", "poultry", "fish", "shellfish", "egg"].includes(i.kind) && !i.allergens.includes("eggs"),
  jain: (i) => !["beef", "lamb", "pork", "poultry", "fish", "shellfish", "egg"].includes(i.kind) && !i.allergens.includes("eggs") && !i.root,
};

for (const diet of Object.keys(DIETS) as Diet[]) {
  test(`a ${diet} week keeps to the diet and fills every cooked dinner`, () => {
    const p = profile({ diet });
    const w = planWeek(p, opts);
    for (const ing of linesOf(w, p)) assert.ok(DIETS[diet](ing), `${diet} plan uses ${ing.id}`);
    assert.equal(w.days.filter((d) => d.dinner.kind === "cook").length, p.cookNights);
    for (const d of w.days) assert.ok(d.breakfast.recipe && d.lunch.recipe, `${diet}: ${d.name} has an empty breakfast or lunch`);
  });
}

test("kosher never puts meat and dairy in the same dish", () => {
  const p = profile({ diet: "kosher" });
  for (const x of library(p, opts)) {
    const kinds = x.lines.map((l) => INGREDIENT[l.i]);
    const meat = kinds.some((i) => ["beef", "lamb", "poultry"].includes(i.kind));
    const dairy = kinds.some((i) => i.kind === "dairy" || i.allergens.includes("milk"));
    assert.ok(!(meat && dairy), x.recipe.id);
  }
});

test("allergens are a hard filter, after swaps and top-ups", () => {
  const p = profile({ allergens: ["gluten", "peanuts", "tree-nuts", "milk", "eggs", "sesame"] });
  for (const x of library(p, opts)) {
    const all = x.topUp ? [...x.lines, { i: x.topUp.i, g: x.topUp.g }] : x.lines;
    for (const l of all) for (const a of INGREDIENT[l.i].allergens) assert.ok(!p.allergens.includes(a), `${x.recipe.id} has ${a} via ${l.i}`);
  }
  assert.ok(library(p, opts).filter((x) => x.recipe.slot === "dinner").length >= 8, "too few dinners left for a common allergy mix");
});

test("pregnancy leaves out cold-smoked fish and switches off protein targets and top-ups", () => {
  const p = profile({ conditions: ["pregnancy"] });
  for (const x of library(p, opts)) {
    assert.ok(!x.lines.some((l) => INGREDIENT[l.i].pregnancyAvoid), x.recipe.id);
    assert.equal(x.topUp, undefined);
  }
  assert.equal(targets(p).proteinDay, null);
});

test("lactose intolerance keeps dairy protein by swapping to lactose-free", () => {
  const x = personalise(RECIPES.find((r) => r.id === "yoghurt-bowl")!, profile({ lactoseFree: true }));
  assert.equal(x.lines[0].i, "lactose-free-yoghurt");
  assert.ok(x.nutrition.protein >= 20);
});

test("a swap renames the dish and tops up protein when it falls short", () => {
  assert.equal(rename("Chicken tikka traybake", [{ from: "chicken-breast", to: "tofu", why: "vegan" }]), "Tofu tikka traybake");
  assert.equal(rename("Bacon and egg breakfast wrap", [{ from: "eggs", to: "tofu", why: "vegan" }]), "Bacon and tofu breakfast wrap");
  const x = personalise(RECIPES.find((r) => r.id === "tuna-bean-salad")!, profile({ diet: "vegan" }));
  assert.ok(x.ok);
  assert.match(x.name, /chickpea/i);
  assert.ok(x.nutrition.protein >= 25);
  for (const s of x.swaps) if (s.note?.includes("top-up")) assert.ok(x.topUp, "a note promises a top-up that isn't there");
  const strength = personalise(RECIPES.find((r) => r.id === "tuna-bean-salad")!, profile({ diet: "vegan", goal: "strength" }));
  assert.ok(strength.topUp, "chickpeas for tuna fall short of a 30 g target, so a top-up is added");
  assert.ok(strength.nutrition.protein >= 30);
});

test("kit, time, heat and salt rules", () => {
  const microwaveOnly = profile({ kit: ["microwave", "kettle"] });
  for (const x of library(microwaveOnly, opts)) assert.ok(x.recipe.kit.every((k) => k === "microwave" || k === "kettle" || k === "none"), x.recipe.id);
  for (const x of library(profile({ maxMinutes: 10 }), opts)) assert.ok(x.recipe.serves >= 4 ? x.recipe.handsOn <= 10 : x.recipe.total <= 10, x.recipe.id);
  for (const x of library(profile({ aversions: ["spicy"] }), opts)) assert.ok(!x.recipe.spicy, x.recipe.id);
  for (const x of library(profile({ conditions: ["high-blood-pressure"] }), opts)) assert.ok(x.nutrition.salt <= 1.5, x.recipe.id);
});

test("planned mains reach the protein minimum", () => {
  for (const diet of ["none", "vegan", "jain"] as Diet[]) {
    const p = profile({ diet });
    for (const m of planned(planWeek(p, opts))) {
      const x = personalise(RECIPES.find((r) => r.id === m.recipe)!, p);
      const min = { breakfast: 15, lunch: 25, dinner: 25, snack: 10 }[m.slot];
      assert.ok(x.nutrition.protein >= min, `${diet}: ${m.recipe} has ${x.nutrition.protein} g`);
    }
  }
});

test("the same seed gives the same week, and a new seed shuffles it", () => {
  const p = profile();
  assert.deepEqual(planWeek(p, { ...opts, seed: 4 }), planWeek(p, { ...opts, seed: 4 }));
  const a = planned(planWeek(p, { ...opts, seed: 4 })).map((m) => m.recipe).join();
  const b = planned(planWeek(p, { ...opts, seed: 5 })).map((m) => m.recipe).join();
  assert.notEqual(a, b);
});

test("the week has a takeaway night, leftovers point back at a cooked dinner, and portions count them", () => {
  const p = profile({ household: 2 });
  const w = planWeek(p, opts);
  assert.ok(w.days.some((d) => d.dinner.kind === "takeaway"));
  const lefts = w.days.flatMap((d) => [d.lunch, d.dinner]).filter((m) => m.kind === "leftover");
  assert.ok(lefts.length >= 1);
  for (const m of lefts) {
    const src = w.days[m.from!].dinner;
    assert.equal(src.recipe, m.recipe);
    assert.ok(src.cook! > p.household);
  }
});

test("protein snacks follow the hungriest times", () => {
  assert.equal(planWeek(profile({ hungryTimes: ["morning"] }), opts).days[0].snacks.length, 0);
  assert.equal(planWeek(profile({ hungryTimes: ["afternoon", "evening"] }), opts).days[0].snacks.length, 2);
  assert.equal(planWeek(profile({ hungryTimes: [], goal: "fuller" }), opts).days[0].snacks.length, 1);
});

test("the fibre guide ramps up 5 g a week to 30 g, and the phase follows weeks since the last dose", () => {
  assert.deepEqual([1, 2, 3, 4, 9].map((w) => targets(profile({ weeksOnPlan: w })).fibreDay), [15, 20, 25, 30, 30]);
  assert.deepEqual([1, 8, 9, 26, 27].map((w) => targets(profile({ weeksSinceLastDose: w })).phase), ["land", "land", "settle", "settle", "steady"]);
  assert.ok(targets(profile({ goal: "strength" })).protein.dinner > targets(profile()).protein.dinner);
});

test("swapping a meal offers similar effort, and leftovers follow a replaced dinner", () => {
  const p = profile();
  const w = planWeek(p, opts);
  const d = w.days.findIndex((x, i) => x.dinner.kind === "cook" && w.days.some((y) => y.dinner.from === i || y.lunch.from === i));
  const options = swapOptions(w, p, d, "dinner", opts);
  assert.ok(options.length > 0);
  const current = personalise(RECIPES.find((r) => r.id === w.days[d].dinner.recipe)!, p);
  for (const o of options) assert.ok(o.recipe.handsOn <= current.recipe.handsOn + 5);
  const keeper = options.find((o) => o.recipe.fridgeDays >= 1)!;
  const next = replaceMeal(w, p, d, "dinner", keeper.recipe.id);
  for (const day of next.days) for (const m of [day.lunch, day.dinner]) if (m.kind === "leftover" && m.from === d) assert.equal(m.recipe, keeper.recipe.id);
});

test("the shopping list leaves out the pantry, counts eggs and rounds up to packs", () => {
  const p = profile();
  const w = planWeek(p, opts);
  const list = shoppingList(w, p);
  const items = list.aisles.flatMap((a) => a.items);
  for (const it of items) assert.ok(!INGREDIENT[it.id].pantry, it.id);
  assert.ok(items.length > 5);
  const eggs = items.find((i) => i.id === "eggs");
  if (eggs) assert.match(eggs.label, /box/);
  for (const it of items) assert.ok(!/^0 /.test(it.label), it.label);
});

test("day totals and the week summary", () => {
  const p = profile();
  const w = planWeek(p, opts);
  const t = dayTotals(w.days[0], p);
  assert.ok(t.protein >= 70, `Monday has ${t.protein} g protein`);
  const s = weekSummary(w, p);
  assert.ok(s.protein > 0 && s.fibre > 0);
});

test("sparse settings still give a full week, and say so", () => {
  const p = profile({ diet: "vegan", allergens: ["soya", "gluten"], kit: ["microwave"], maxMinutes: 10 });
  const w = planWeek(p, opts);
  assert.ok(planned(w).length > 0);
  assert.ok(Array.isArray(weekSummary(w, p).notes));
});

test("kitchen amounts read the way people cook", () => {
  assert.equal(quantity("eggs", 116), "2 eggs");
  assert.equal(quantity("eggs", 58), "1 egg");
  assert.equal(quantity("milk", 250), "250 ml");
  assert.equal(quantity("soy-sauce", 10), "2 tsp");
  assert.equal(quantity("curry-paste", 30), "2 tbsp");
  assert.equal(quantity("spices", 1), "a pinch");
  assert.equal(quantity("chicken-breast", 132), "130 g");
  assert.equal(quantity("wholemeal-bread", 72), "2 slices");
});

test("a recipe's method limits its swaps", () => {
  const vegan = profile({ diet: "vegan" });
  assert.equal(personalise(RECIPES.find((r) => r.id === "egg-pot")!, vegan).ok, false, "boiled eggs can't become tofu");
  assert.equal(personalise(RECIPES.find((r) => r.id === "microwave-eggs")!, vegan).ok, true, "scrambled eggs can");
  const burger = personalise(RECIPES.find((r) => r.id === "smash-burger")!, profile({ aversions: ["meat"] }));
  assert.equal(burger.ok, false);
  const oats = personalise(RECIPES.find((r) => r.id === "overnight-oats")!, profile({ allergens: ["gluten"] }));
  assert.equal(oats.lines[0].i, "gf-oats");
});

test("picking a week by hand: the shopping list adds up the same ingredient across dishes", () => {
  const p = profile({ household: 1 });
  let w = emptyWeek(p);
  assert.deepEqual(progress(w), { chosen: 0, total: 7 * (3 + 1) });
  w = setMeal(w, p, 0, "dinner", { recipe: "chicken-tikka-traybake" }); // 150 g chicken breast a portion
  w = setMeal(w, p, 3, "dinner", { recipe: "chicken-fajita-tray" }); // 130 g
  w = setMeal(w, p, 4, "dinner", { kind: "takeaway" });
  const chicken = shoppingList(w, p).aisles.flatMap((a) => a.items).find((i) => i.id === "chicken-breast")!;
  assert.equal(chicken.grams, 280);
  assert.equal(chicken.total, "280 g");
  assert.deepEqual(chicken.uses.map((u) => [u.day, u.grams]), [[0, 150], [3, 130]]);
  assert.equal(progress(w).chosen, 3);

  const family = profile({ household: 2 });
  const two = setMeal(setMeal(emptyWeek(family), family, 0, "dinner", { recipe: "chicken-tikka-traybake" }), family, 3, "dinner", { recipe: "chicken-fajita-tray" });
  assert.equal(shoppingList(two, family).aisles.flatMap((a) => a.items).find((i) => i.id === "chicken-breast")!.grams, 560);
});

test("leftovers chosen by hand add portions to the night they're cooked, and only while they keep", () => {
  const p = profile();
  let w = setMeal(emptyWeek(p), p, 0, "dinner", { recipe: "turkey-chilli" }); // keeps 3 days
  assert.deepEqual(leftoverOptions(w, p, 1, "lunch").map((o) => o.from), [0]);
  assert.deepEqual(leftoverOptions(w, p, 5, "dinner"), [], "too long after Monday");
  w = setMeal(w, p, 1, "lunch", { leftoverFrom: 0 });
  w = setMeal(w, p, 2, "dinner", { leftoverFrom: 0 });
  assert.equal(w.days[0].dinner.cook, 3);
  w = setMeal(w, p, 0, "dinner", { kind: "free" });
  assert.equal(w.days[1].lunch.kind, "free", "leftovers of a cleared dinner are cleared too");
});
