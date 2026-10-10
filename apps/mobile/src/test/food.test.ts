/// <reference types="node" />
// Meals: swaps written into methods and dish names, cook-along chips and timers, meals resting between weeks,
// favourites and "not for me", and next week kept safe after a change of diet. Run with `pnpm --filter @landing/mobile test`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { RECIPE, RECIPES } from "@landing/content";
import { personalise, planWeek, profile, quantity, shoppingList, swapOptions, swapReason, type Profile, type Week } from "@landing/engine";
import { chipLabel, ingredientsIn, timersIn, withSwaps } from "@/data/cook";
import { freshState } from "@/state/store";

const vegan = profile({ diet: "vegan" });
const fit = (id: string, p: Profile) => personalise(RECIPE[id], p);
const dinners = (w: Week) => [...new Set(w.days.filter((d) => d.dinner.kind === "cook").map((d) => d.dinner.recipe!))];
const cooked = (w: Week) => w.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner, ...d.snacks]).filter((m) => m.kind === "cook" && m.recipe).map((m) => m.recipe!);

test("a vegan's method says tofu, never chicken or salmon", () => {
  const tikka = fit("chicken-tikka-traybake", vegan);
  assert.ok(tikka.steps.some((st) => /tofu/.test(st)));
  for (const st of tikka.steps) assert.doesNotMatch(st, /chicken/i, st);
  assert.equal(withSwaps("Roast until the chicken is cooked through.", [{ from: "chicken-breast", to: "tofu" }]), "Roast until the tofu is cooked through.");

  const pasta = fit("salmon-pea-pasta", vegan);
  for (const st of pasta.steps) assert.doesNotMatch(st, /salmon|fresh pasta|flake/i, st);
  assert.match(pasta.steps.join(" "), /10 minutes/, "dried gluten-free pasta gets its own time, not 3 minutes");

  // The swap word goes in, not the full name, so sentences still read.
  assert.equal(fit("protein-milk", vegan).steps[0], "Shake and drink.");
  assert.match(fit("salmon-noodle-salad", vegan).steps[1], /Scatter the chickpeas on top\.$/);
  const gf = profile({ allergens: ["gluten"] });
  assert.doesNotMatch(fit("ginger-chicken-broth", gf).steps.join(" "), /soy tamari/);
  assert.doesNotMatch(fit("prawn-rice-bowl", vegan).steps.join(" "), /defrost/i);
  assert.equal(fit("prawn-rice-bowl", vegan).ahead, undefined, "no defrosting ahead for tofu");
  assert.doesNotMatch(fit("halloumi-couscous", gf).steps.join(" "), /boiling water/, "a quinoa pouch goes in the microwave");
});

test("dish names follow the swaps", () => {
  assert.equal(fit("microwave-eggs", vegan).name, "Microwave tofu scramble on toast");
  assert.doesNotMatch(fit("beans-eggs-toast", vegan).name, /egg/i);
  assert.equal(fit("prawn-fried-rice", vegan).name, "Tofu fried rice");
  assert.equal(fit("chicken-tikka-traybake", vegan).name, "Tofu tikka traybake");
  const fish = profile({ allergens: ["fish"] });
  assert.equal(fit("air-fryer-fish-chips", fish).name, "Air-fryer prawns, chips and peas");
  assert.doesNotMatch(fit("sardines-toast", fish).name, /sardine/i);
  const peanut = profile({ allergens: ["peanuts"] });
  for (const id of ["tofu-peanut-stir-fry", "peanut-stew", "tofu-peanut-slaw", "pb-banana-toast"]) assert.doesNotMatch(fit(id, peanut).name, /peanut/i, id);
  assert.doesNotMatch(fit("turkey-bagel", vegan).name, /smoked tofu, smoked tofu/i, "no doubled words");
});

test("cook-along chips find the main ingredient, and only whole words", () => {
  assert.deepEqual(ingredientsIn("Add the thinly sliced chicken and poach for 8 minutes.", ["chicken-breast", "stock", "broccoli"]), ["chicken-breast"]);
  assert.deepEqual(ingredientsIn("Bring the stock to a simmer in a saucepan.", ["stock", "soy-sauce", "sweet-chilli"]), ["stock"]);
  assert.deepEqual(ingredientsIn("Beat the eggs with salt and pepper.", ["eggs", "peppers"]), ["eggs"]);
  assert.deepEqual(ingredientsIn("Flake the mackerel and add the carrot.", ["mackerel-smoked", "carrots"]), ["mackerel-smoked", "carrots"]);
  assert.deepEqual(ingredientsIn("Fry the smoked tofu.", ["tofu", "smoked-tofu"]), ["smoked-tofu"]);
  assert.equal(chipLabel("chickpeas"), "tinned chickpeas");
});

test("timers have a label and skip times inside another timer", () => {
  assert.equal(timersIn("Add the broccoli for the last 4 minutes and the rice for the last 2.").length, 0);
  assert.equal(timersIn("Pour 60 ml boiling water over the couscous, cover for 5 minutes and serve with the stew.")[0].label, "Cover");
  const profiles = [profile(), vegan, profile({ allergens: ["gluten", "fish"] })];
  for (const p of profiles) for (const r of RECIPES) for (const st of personalise(r, p).steps) for (const t of timersIn(st)) assert.notEqual(t.label, "Timer", `${r.id}: ${st}`);
});

test("Habit Only words reasons without numbers, and swap reasons read as phrases", () => {
  const x = fit("cheese-oatcakes", profile({ diet: "vegan", safeMode: true }));
  for (const b of x.blocked) assert.doesNotMatch(b, /\d/, b);
  assert.equal(swapReason("vegetarian"), "to keep it vegetarian");
  assert.equal(swapReason("allergy: gluten"), "as you avoid gluten");
  assert.equal(quantity("hummus", 260), "260 g", "a week of hummus reads in grams");
});

test("dinners rest three or four weeks before they come back", () => {
  const recent: string[][] = [];
  const last = new Map<string, number>(), count = new Map<string, number>();
  for (let w = 1; w <= 52; w++) {
    const p = profile({ weeksSinceLastDose: w, weeksOnPlan: w });
    const week = planWeek(p, { seed: 1000 + w * 7, includeDrafts: true, recent });
    for (const id of dinners(week)) {
      if (last.has(id)) assert.ok(w - last.get(id)! >= 3, `${id} back after ${w - last.get(id)!} weeks`);
      last.set(id, w); count.set(id, (count.get(id) ?? 0) + 1);
    }
    recent.unshift(cooked(week)); recent.length = Math.min(4, recent.length);
  }
  assert.ok(count.size >= 25, `${count.size} different dinners in a year`);
  assert.ok(Math.max(...count.values()) <= 13, "no dinner fills a quarter of the year");
});

test("favourites come back about monthly, and 'not for me' is never planned or suggested", () => {
  const recent: string[][] = [];
  let fav = 0;
  const avoid = ["chicken-goulash", "chicken-tikka-traybake"];
  for (let w = 1; w <= 24; w++) {
    const p = profile({ weeksSinceLastDose: w, weeksOnPlan: w });
    const week = planWeek(p, { seed: 77 + w, includeDrafts: true, recent, favourites: ["turkey-chilli"], avoid });
    const ids = cooked(week);
    for (const id of avoid) assert.ok(!ids.includes(id), `${id} planned`);
    if (dinners(week).includes("turkey-chilli")) fav++;
    for (const x of swapOptions(week, p, 0, "dinner", { n: 10, includeDrafts: true, avoid })) assert.ok(!avoid.includes(x.recipe.id));
    recent.unshift(ids); recent.length = Math.min(4, recent.length);
  }
  assert.ok(fav >= 5 && fav <= 8, `favourite planned in ${fav} of 24 weeks`);
});

test("changing diet keeps next week safe, and the history marks what's new", async () => {
  const { personaliseById } = await import("@landing/engine");
  const { isNew, profileOf, recentFor, refitNext, saveThisWeek, startNextWeek, thisWeek } = await import("@/state/food");
  const s = freshState(); s.onboarded = true; s.food.joinedWeek = 1;
  startNextWeek(s, "suggested");
  s.food.diet = "vegan"; s.food.allergens = ["peanuts"];
  refitNext(s);
  const p = profileOf(s, 1);
  for (const id of cooked(s.food.next!.week)) assert.ok(personaliseById(id, p).ok, `${id} still planned`);
  const names = shoppingList(s.food.next!.week, p).aisles.flatMap((a) => a.items.map((i) => i.id));
  for (const bad of ["eggs", "beef-mince", "peanut-butter", "chicken-breast"]) assert.ok(!names.includes(bad), `${bad} on next week's list`);

  // This week is remembered once saved; with no earlier week, nothing is flagged as new.
  saveThisWeek(s, thisWeek(s));
  assert.equal(s.food.recent?.length, 1);
  assert.equal(isNew(s, cooked(thisWeek(s))[0]), false);
  assert.deepEqual(recentFor(s, 1)[0].sort(), cooked(thisWeek(s)).filter((id, i, a) => a.indexOf(id) === i).sort(), "next week rests this week's meals");
  // An earlier week makes everything else new.
  s.food.recent!.push({ start: "2000-01-03", ids: ["red-lentil-dhal"] });
  assert.equal(isNew(s, "red-lentil-dhal"), false);
  assert.equal(isNew(s, "chana-masala"), true);
});
