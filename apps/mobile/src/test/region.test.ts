/// <reference types="node" />
// US mode: UK words, oven temperatures, recipe amounts and the helpline as someone in the US reads them, and the UK
// text left exactly as written. Run with `npm test`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { amountFor as amount, HELPLINE, localiseFor as localise } from "@/data/usWords";
import { kgFromLb, weight } from "@/data/units";

test("region: the UK sees the text as written", () => {
  const t = "Ask your GP about the jab. Prawns, courgette and 200 g yoghurt at 180°C fan.";
  assert.equal(localise(t, "uk"), t);
  assert.equal(amount("150 ml", "uk"), "150 ml");
});

test("region: US words, keeping capitals and whole words", () => {
  assert.equal(localise("Ask your GP before the next jab.", "us"), "Ask your doctor before the next shot.");
  assert.equal(localise("Prawn and courgette stir-fry", "us"), "Shrimp and zucchini stir-fry");
  assert.equal(localise("Chips or crisps?", "us"), "Fries or chips?");
  assert.equal(localise("Beef mince, spring onions and tinned tomatoes", "us"), "Ground beef, scallions and canned tomatoes");
  assert.equal(localise("Turkey breast mince (2% fat) and frozen soya mince", "us"), "Ground turkey breast (2% fat) and frozen soy crumbles");
  assert.equal(localise("A jacket-potato lunch", "us"), "A baked-potato lunch");
  assert.equal(localise("Greek yoghurt for fibre and flavour", "us"), "Greek yogurt for fiber and flavor");
  assert.equal(localise("Call 999 or go to A&E.", "us"), "Call 911 or go to the ER.");
  // Not inside other words, and "Beat the eggs" is a recipe step, not the charity.
  assert.equal(localise("Beat the eggs. Tinsel, hobby, mincemeat.", "us"), "Beat the eggs. Tinsel, hobby, mincemeat.");
});

test("region: oven temperatures in Fahrenheit", () => {
  assert.equal(localise("Heat the oven to 180°C fan.", "us"), "Heat the oven to 400°F.");
  assert.equal(localise("Bake at 200°C", "us"), "Bake at 390°F");
});

test("region: recipe amounts in US measures", () => {
  assert.equal(amount("120 g", "us"), "4 oz");
  assert.equal(amount("500 g", "us"), "1 lb");
  assert.equal(amount("10 g", "us"), "¼ oz");
  assert.equal(amount("30 ml", "us"), "2 tbsp");
  assert.equal(amount("240 ml", "us"), "1 cup");
  assert.equal(amount("1 kg", "us"), "2¼ lb");
  assert.equal(amount("2 eggs", "us"), "2 eggs");
  assert.equal(amount("1 tbsp", "us"), "1 tbsp");
});

test("region: the eating disorder helpline is ANAD in the US", () => {
  const note = "If food feels hard, Beat, the UK’s eating disorder charity, is there to talk to: 0808 801 0677, or beateatingdisorders.org.uk.";
  assert.equal(localise(note, "us"), "If food feels hard, ANAD, a US eating disorder charity, is there to talk to: 1-888-375-7767, or anad.org.");
  assert.equal(localise("Beat's helpline is there to talk to.", "us"), "ANAD’s helpline is there to talk to.");
  assert.equal(HELPLINE.us.tel, "tel:18883757767");
});

test("region: pounds-only weights", () => {
  assert.equal(weight(80, "lb"), "176.4 lb");
  assert.ok(Math.abs(kgFromLb(176.4) - 80) < 0.05);
});
