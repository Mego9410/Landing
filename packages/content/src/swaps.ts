// The vetted swap lists (plan §5.4). For each ingredient, substitutes in order of preference; the engine takes the
// first one that suits the person's diet, allergies and dislikes, and recalculates nutrition. Grams scale by `ratio`.
// The coach may only offer swaps from this table. Dietitian to review with the recipes.
import type { Swap } from "./types.ts";

const s = (to: string, ratio = 1, note?: string): Swap => (note ? { to, ratio, note } : { to, ratio });

export const SWAPS: Record<string, Swap[]> = {
  // proteins: meat and fish to plant proteins keep roughly the same protein where they can, and say so where not
  "chicken-breast": [s("chicken-thigh"), s("turkey-mince"), s("quorn-pieces", 1.3), s("tofu", 1.4), s("paneer", 0.9), s("chickpeas", 1.6, "Less protein than chicken, so we add a top-up")],
  "chicken-thigh": [s("chicken-breast"), s("quorn-pieces", 1.3), s("tofu", 1.4), s("paneer", 0.9)],
  "cooked-chicken": [s("turkey-slices"), s("tuna-tin"), s("smoked-tofu", 1.4), s("quorn-pieces", 1.6), s("chickpeas", 2, "Less protein than chicken, so we add a top-up")],
  "turkey-mince": [s("beef-mince"), s("quorn-mince", 1.4), s("soya-mince", 1.2), s("red-lentils", 0.5, "Less protein than mince, so we add a top-up")],
  "beef-mince": [s("turkey-mince"), s("quorn-mince", 1.4), s("soya-mince", 1.2), s("red-lentils", 0.5, "Less protein than mince, so we add a top-up")],
  "turkey-slices": [s("cooked-chicken"), s("ham-slices"), s("smoked-tofu", 1.3)],
  "ham-slices": [s("turkey-slices"), s("cooked-chicken"), s("smoked-tofu", 1.3)],
  "bacon-medallions": [s("turkey-slices"), s("smoked-tofu"), s("mushrooms", 1.5, "No protein in mushrooms, so we add a top-up")],
  "chicken-sausages": [s("quorn-pieces"), s("smoked-tofu", 0.9)],
  "pork-loin": [s("chicken-breast"), s("tofu", 1.4)],
  "chorizo": [s("smoked-tofu", 1.2), s("chicken-sausages")],
  "salmon-fillet": [s("cod-fillet", 1.15), s("salmon-tin"), s("tofu", 1.5), s("chicken-breast", 0.9)],
  "cod-fillet": [s("salmon-fillet", 0.85), s("prawns"), s("tofu", 1.3), s("chicken-breast", 0.8)],
  "tuna-tin": [s("salmon-tin"), s("cooked-chicken", 0.9), s("chickpeas", 2, "Less protein than tuna, so we add a top-up")],
  "salmon-tin": [s("tuna-tin"), s("cooked-chicken", 0.8), s("chickpeas", 2, "Less protein than salmon, so we add a top-up")],
  "mackerel-smoked": [s("salmon-tin"), s("tuna-tin"), s("smoked-tofu")],
  "smoked-salmon": [s("salmon-tin"), s("tuna-tin"), s("smoked-tofu")],
  "sardines-tin": [s("mackerel-smoked"), s("tuna-tin"), s("baked-beans", 2, "Less protein than sardines, so we add a top-up")],
  "prawns": [s("cooked-chicken", 0.6), s("tofu", 1.3), s("edamame", 1.4)],
  "eggs": [s("tofu", 1.2, "Scramble the tofu with a pinch of turmeric")],
  "paneer": [s("halloumi", 0.8), s("tofu", 1.3), s("chickpeas", 1.5, "Less protein than paneer, so we add a top-up")],
  "halloumi": [s("paneer"), s("smoked-tofu", 1.2)],
  "feta": [s("mozzarella-light"), s("smoked-tofu"), s("chickpeas", 1.5)],
  "mozzarella-light": [s("cheddar-light", 0.6), s("feta", 0.8), s("smoked-tofu")],
  "cheddar-light": [s("mozzarella-light", 1.4), s("smoked-tofu", 1.4)],
  "quorn-pieces": [s("tofu"), s("chicken-breast", 0.7)],
  "quorn-mince": [s("soya-mince"), s("turkey-mince", 0.7)],

  // dairy: soya is the only plant yoghurt or milk with comparable protein
  "greek-yoghurt": [s("lactose-free-yoghurt"), s("skyr"), s("soya-yoghurt", 1.2, "Soya keeps most of the protein")],
  "skyr": [s("greek-yoghurt"), s("lactose-free-yoghurt"), s("soya-yoghurt", 1.3, "Soya keeps most of the protein")],
  "cottage-cheese": [s("greek-yoghurt"), s("lactose-free-yoghurt"), s("soya-yoghurt", 1.3)],
  "milk": [s("lactose-free-milk"), s("soya-milk")],
  "protein-milk": [s("lactose-free-milk", 1.2), s("soya-milk", 1.5, "Less protein than a protein drink")],

  // bases: gluten-free and grain swaps
  "wholemeal-bread": [s("gf-bread")],
  "wrap": [s("gf-wrap")],
  "pitta": [s("gf-wrap"), s("gf-bread")],
  "bagel": [s("gf-bread", 0.85)],
  "roll": [s("gf-bread", 1.2)],
  "rye-crispbread": [s("oatcakes"), s("gf-bread", 1.5)],
  "pasta": [s("gf-pasta")],
  "fresh-pasta": [s("gf-pasta", 0.6, "Gluten-free pasta is dried, so cook it first for the time on the pack")],
  "noodles": [s("rice-noodles")],
  "couscous": [s("quinoa-pouch", 3)],
  "gnocchi": [s("new-potatoes", 1.2)],
  "oats": [s("gf-oats", 1, "Most people with coeliac disease can eat gluten-free oats; check with your dietitian")],
  "oatcakes": [s("rye-crispbread"), s("gf-bread", 1.5)],
  "soy-sauce": [s("tamari", 0.8)],
  "potato": [s("courgette", 1.2), s("quinoa-pouch", 0.6)],
  "new-potatoes": [s("rice-pouch", 0.8), s("quinoa-pouch", 0.8)],
  "sweet-potato": [s("rice-pouch", 0.6), s("quinoa-pouch", 0.6)],

  // veg and flavour: for Jain diets (no root veg), allergies and the foods someone can't face right now
  "onion": [s("peppers"), s("courgette")],
  "red-onion": [s("cucumber"), s("peppers")],
  "spring-onions": [s("coriander", 0.3)],
  "carrots": [s("peppers"), s("cucumber")],
  "beetroot": [s("cherry-tomatoes"), s("roasted-peppers")],
  "garlic": [s("asafoetida", 0.1)],
  "ginger": [s("spices", 0.5)],
  "thai-paste": [s("vegan-thai-paste")],
  "curry-paste": [s("spices", 0.5, "Use dried spices instead of the paste")],
  "pesto": [s("salsa", 1.5)],
  "light-mayo": [s("greek-yoghurt", 1.2), s("soya-yoghurt", 1.2)],
  "hummus": [s("greek-yoghurt"), s("soya-yoghurt")],
  "peanut-butter": [s("seeds", 0.8)],
  "almonds": [s("seeds")],
  "seeds": [s("berries", 2, "Less protein than seeds")],
  "honey": [s("banana", 2)],
  "avocado": [s("cucumber", 1.2)],
  "olives": [s("cherry-tomatoes", 1.5)],
  "mushrooms": [s("courgette"), s("peppers")],
};

/** Protein top-ups the engine can add when a swap leaves a meal short (plan §5.4: "top-up offered"). */
export const TOP_UPS: { i: string; g: number; label: string }[] = [
  { i: "greek-yoghurt", g: 150, label: "A pot of Greek yoghurt on the side" },
  { i: "soya-yoghurt", g: 150, label: "A pot of soya yoghurt on the side" },
  { i: "edamame", g: 80, label: "A handful of edamame on the side" },
  { i: "eggs", g: 58, label: "A boiled egg on the side" },
  { i: "seeds", g: 20, label: "A spoonful of seeds on top" },
];
