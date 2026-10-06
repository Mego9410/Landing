// Ingredients with approximate nutrition per 100 g. These are typical UK values (CoFID-style, and pack labels for
// convenience foods) written down from general knowledge, NOT yet checked against CoFID 2021 or the products we'll
// recommend. Plan §7.5: the dietitian checks them, and the CMS replaces them with sourced values before launch.
import type { Aisle, Allergen, Ingredient, Kind } from "./types.ts";

type Opts = Omit<Ingredient, "id" | "name" | "per100" | "kind" | "allergens" | "aisle">;
const ing = (id: string, name: string, [protein, carbs, fibre, fat, salt]: number[], kind: Kind, allergens: Allergen[], aisle: Aisle, o: Opts = {}): Ingredient =>
  ({ id, name, per100: { protein, carbs, fibre, fat, salt }, kind, allergens, aisle, ...o });

const tin = (size: number) => ({ unit: "tin", plural: "tins", size });
const pack = (size: number) => ({ unit: "pack", plural: "packs", size });
const pouch = (size: number) => ({ unit: "pouch", plural: "pouches", size });
const bag = (size: number) => ({ unit: "bag", plural: "bags", size });
const pot = (size: number) => ({ unit: "pot", plural: "pots", size });
const jar = (size: number) => ({ unit: "jar", plural: "jars", size });

export const INGREDIENTS: Ingredient[] = [
  // meat and poultry
  ing("chicken-breast", "Chicken breast", [24, 0, 0, 1.5, 0.15], "poultry", [], "Meat and fish", { short: "chicken", buy: pack(500) }),
  ing("chicken-thigh", "Boneless chicken thighs", [19.5, 0, 0, 6, 0.2], "poultry", [], "Meat and fish", { short: "chicken", buy: pack(500) }),
  ing("cooked-chicken", "Cooked chicken pieces", [29, 0.5, 0, 3, 1], "poultry", [], "Chilled", { short: "chicken", buy: pack(180) }),
  ing("turkey-mince", "Turkey breast mince (2% fat)", [23, 0, 0, 2, 0.15], "poultry", [], "Meat and fish", { short: "turkey", buy: pack(500) }),
  ing("turkey-slices", "Cooked turkey slices", [24, 1.5, 0, 1.5, 1.8], "poultry", [], "Chilled", { short: "turkey", buy: pack(120) }),
  ing("chicken-sausages", "Chicken sausages", [17, 5, 0.5, 6, 1.6], "poultry", ["gluten"], "Meat and fish", { short: "sausage", buy: pack(400), each: { name: "sausage", plural: "sausages", grams: 67 } }),
  ing("beef-mince", "Lean beef mince (5% fat)", [21.5, 0, 0, 5, 0.2], "beef", [], "Meat and fish", { short: "beef", buy: pack(500) }),
  ing("pork-loin", "Pork loin steaks, fat trimmed", [22, 0, 0, 4, 0.15], "pork", [], "Meat and fish", { short: "pork", buy: pack(400) }),
  ing("bacon-medallions", "Bacon medallions", [22, 0.5, 0, 3, 2.8], "pork", [], "Meat and fish", { short: "bacon", buy: pack(180), each: { name: "medallion", plural: "medallions", grams: 25 } }),
  ing("ham-slices", "Lean ham slices", [20, 1.5, 0, 2.5, 2], "pork", [], "Chilled", { short: "ham", buy: pack(125) }),
  ing("chorizo", "Chorizo", [24, 2, 0, 30, 4], "pork", [], "Chilled", { short: "chorizo", buy: pack(200) }),

  // fish and seafood
  ing("salmon-fillet", "Salmon fillet", [20.5, 0, 0, 13, 0.1], "fish", ["fish"], "Meat and fish", { short: "salmon", buy: pack(240), each: { name: "fillet", plural: "fillets", grams: 120 } }),
  ing("cod-fillet", "Frozen cod fillet", [17.5, 0, 0, 0.7, 0.2], "fish", ["fish"], "Frozen", { short: "cod", buy: bag(520), each: { name: "fillet", plural: "fillets", grams: 130 } }),
  ing("tuna-tin", "Tinned tuna in spring water, drained", [25, 0, 0, 1, 0.6], "fish", ["fish"], "Tins and jars", { short: "tuna", buy: tin(112) }),
  ing("salmon-tin", "Tinned salmon, drained", [22, 0, 0, 7, 0.8], "fish", ["fish"], "Tins and jars", { short: "salmon", buy: tin(170) }),
  ing("mackerel-smoked", "Smoked mackerel fillets", [19, 0, 0, 30, 2.4], "fish", ["fish"], "Chilled", { short: "smoked mackerel", buy: pack(200) }),
  ing("smoked-salmon", "Smoked salmon", [23, 0, 0, 5, 3], "fish", ["fish"], "Chilled", { short: "smoked salmon", buy: pack(100), pregnancyAvoid: true }),
  ing("sardines-tin", "Tinned sardines in tomato sauce", [17, 1.5, 0.3, 9, 0.9], "fish", ["fish"], "Tins and jars", { short: "sardines", buy: tin(120) }),
  ing("prawns", "Cooked king prawns", [17, 0, 0, 0.8, 1.2], "shellfish", ["crustaceans"], "Frozen", { short: "prawn", buy: bag(225) }),

  // eggs and dairy
  ing("eggs", "Eggs", [12.6, 0.1, 0, 9.5, 0.4], "egg", ["eggs"], "Dairy and eggs", { short: "egg", buy: { unit: "box of 6", plural: "boxes of 6", size: 348 }, each: { name: "egg", plural: "eggs", grams: 58 } }),
  ing("greek-yoghurt", "0% fat Greek-style yoghurt", [10.3, 3.5, 0, 0.2, 0.1], "dairy", ["milk"], "Dairy and eggs", { short: "yoghurt", buy: pot(500) }),
  ing("skyr", "Skyr (plain)", [11, 4, 0, 0.2, 0.1], "dairy", ["milk"], "Dairy and eggs", { short: "skyr", buy: pot(450) }),
  ing("cottage-cheese", "Reduced-fat cottage cheese", [11, 3, 0, 1.5, 0.7], "dairy", ["milk"], "Dairy and eggs", { buy: pot(300) }),
  ing("feta", "Feta", [16, 1, 0, 20, 2.5], "dairy", ["milk"], "Dairy and eggs", { short: "feta", buy: pack(200) }),
  ing("halloumi", "Light halloumi", [24, 2, 0, 16, 2.7], "dairy", ["milk"], "Dairy and eggs", { short: "halloumi", buy: pack(200) }),
  ing("mozzarella-light", "Light mozzarella", [20, 1, 0, 10, 0.5], "dairy", ["milk"], "Dairy and eggs", { short: "mozzarella", buy: pack(125) }),
  ing("cheddar-light", "Reduced-fat Cheddar", [27, 0.1, 0, 22, 1.7], "dairy", ["milk"], "Dairy and eggs", { short: "cheese", buy: pack(350), lactoseFree: true }),
  ing("paneer", "Paneer", [18, 3, 0, 22, 0.1], "dairy", ["milk"], "Dairy and eggs", { short: "paneer", buy: pack(226) }),
  ing("milk", "Semi-skimmed milk", [3.6, 4.8, 0, 1.8, 0.1], "dairy", ["milk"], "Dairy and eggs", { short: "milk", buy: { unit: "litre", plural: "litres", size: 1000 } }),
  ing("lactose-free-milk", "Lactose-free semi-skimmed milk", [3.6, 2.4, 0, 1.8, 0.1], "dairy", ["milk"], "Dairy and eggs", { short: "milk", buy: { unit: "litre", plural: "litres", size: 1000 }, lactoseFree: true }),
  ing("protein-milk", "High-protein milk drink", [7.6, 5, 0, 0.5, 0.2], "dairy", ["milk"], "Chilled", { short: "protein milk", buy: { unit: "bottle", plural: "bottles", size: 330 } }),
  ing("lactose-free-yoghurt", "Lactose-free Greek-style yoghurt", [9, 3.5, 0, 1, 0.1], "dairy", ["milk"], "Dairy and eggs", { short: "yoghurt", buy: pot(450), lactoseFree: true }),

  // plant proteins
  ing("tofu", "Firm tofu", [13, 1, 0.5, 7, 0], "plant", ["soya"], "Chilled", { short: "tofu", buy: pack(280) }),
  ing("smoked-tofu", "Smoked tofu", [16, 1, 0.5, 9, 1], "plant", ["soya"], "Chilled", { short: "smoked tofu", buy: pack(225) }),
  ing("quorn-pieces", "Quorn pieces", [14, 4.5, 5.5, 2.6, 0.1], "plant", ["eggs"], "Frozen", { short: "Quorn", buy: bag(300) }),
  ing("quorn-mince", "Quorn mince", [14.5, 4.5, 5.5, 2, 0.1], "plant", ["eggs"], "Frozen", { short: "Quorn", buy: bag(300) }),
  ing("soya-mince", "Frozen soya mince", [18, 5, 5, 3, 0.6], "plant", ["soya"], "Frozen", { short: "soya", buy: bag(500) }),
  ing("soya-yoghurt", "High-protein soya yoghurt (plain)", [7, 3, 1.2, 3, 0.2], "plant", ["soya"], "Dairy and eggs", { short: "soya yoghurt", buy: pot(400) }),
  ing("soya-milk", "Unsweetened soya milk", [3.3, 0.4, 0.5, 1.8, 0.1], "plant", ["soya"], "Dairy and eggs", { short: "soya milk", buy: { unit: "litre", plural: "litres", size: 1000 } }),
  ing("edamame", "Frozen edamame beans", [11.5, 5, 5, 5, 0], "plant", ["soya"], "Frozen", { short: "edamame", buy: bag(400), veg: true }),
  ing("red-lentils", "Red lentils (dry)", [24, 50, 10, 1.5, 0], "plant", [], "Rice, pasta and grains", { short: "lentil", buy: bag(500) }),
  ing("lentil-pouch", "Cooked Puy lentils (pouch)", [9, 15, 5, 1, 0.3], "plant", [], "Rice, pasta and grains", { short: "lentil", buy: pouch(250) }),
  ing("chickpeas", "Tinned chickpeas, drained", [7.2, 15, 5, 2.5, 0.2], "plant", [], "Tins and jars", { short: "chickpea", buy: tin(240) }),
  ing("cannellini", "Tinned cannellini or butter beans, drained", [6.5, 12, 6, 0.5, 0.1], "plant", [], "Tins and jars", { short: "bean", buy: tin(240) }),
  ing("kidney-beans", "Tinned kidney beans, drained", [7, 15, 6.5, 0.5, 0.1], "plant", [], "Tins and jars", { buy: tin(240) }),
  ing("black-beans", "Tinned black beans, drained", [7.5, 14, 7, 0.5, 0.1], "plant", [], "Tins and jars", { buy: tin(240) }),
  ing("baked-beans", "Reduced-sugar and salt baked beans", [5, 12, 4.5, 0.4, 0.5], "plant", [], "Tins and jars", { buy: tin(415) }),
  ing("hummus", "Reduced-fat hummus", [7, 9, 6, 13, 0.9], "plant", ["sesame"], "Chilled", { short: "hummus", buy: pot(200) }),
  ing("peanut-butter", "Peanut butter (no added sugar)", [25, 12, 7, 50, 0.5], "plant", ["peanuts"], "Store cupboard", { short: "peanut butter", buy: jar(340) }),
  ing("seeds", "Pumpkin and sunflower seeds", [22, 10, 8, 45, 0], "plant", [], "Store cupboard", { short: "seed", buy: bag(200) }),
  ing("almonds", "Flaked almonds", [21, 6, 12.5, 50, 0], "plant", ["tree-nuts"], "Store cupboard", { buy: bag(100) }),

  // veg and fruit
  ing("spinach", "Baby spinach", [2.8, 1.6, 2.1, 0.5, 0.2], "plant", [], "Fruit and veg", { buy: bag(200), veg: true }),
  ing("frozen-spinach", "Frozen spinach", [2.8, 0.8, 2.3, 0.5, 0.1], "plant", [], "Frozen", { buy: bag(900), veg: true }),
  ing("stir-fry-veg", "Frozen stir-fry veg", [2.5, 6, 3, 0.5, 0], "plant", [], "Frozen", { buy: bag(500), veg: true }),
  ing("mixed-veg", "Frozen mixed veg", [3, 7, 3.5, 0.5, 0], "plant", [], "Frozen", { buy: bag(1000), veg: true }),
  ing("peppers", "Peppers (fresh or frozen sliced)", [1, 4.5, 1.7, 0.3, 0], "plant", [], "Fruit and veg", { short: "pepper", buy: { unit: "pack of 3", plural: "packs of 3", size: 480 }, veg: true }),
  ing("peas", "Frozen peas", [5.5, 9, 5, 0.9, 0], "plant", [], "Frozen", { buy: bag(900), veg: true }),
  ing("broccoli", "Broccoli (fresh or frozen)", [4.4, 2.2, 3, 0.6, 0], "plant", [], "Fruit and veg", { buy: { unit: "head", plural: "heads", size: 350 }, veg: true }),
  ing("green-beans", "Frozen green beans", [1.9, 4, 3, 0.3, 0], "plant", [], "Frozen", { buy: bag(750), veg: true }),
  ing("cherry-tomatoes", "Cherry tomatoes", [0.8, 3.5, 1.2, 0.3, 0], "plant", [], "Fruit and veg", { buy: pack(250), veg: true }),
  ing("chopped-tomatoes", "Tinned chopped tomatoes", [1.2, 3.5, 1, 0.2, 0.05], "plant", [], "Tins and jars", { buy: tin(400), veg: true }),
  ing("passata", "Passata", [1.4, 4.5, 1.2, 0.2, 0.1], "plant", [], "Tins and jars", { buy: { unit: "carton", plural: "cartons", size: 500 }, veg: true }),
  ing("onion", "Onion (or frozen chopped onion)", [1.2, 7.9, 1.4, 0.2, 0], "plant", [], "Fruit and veg", { each: { name: "onion", plural: "onions", grams: 150 }, veg: true, root: true }),
  ing("red-onion", "Red onion", [1.2, 7.9, 1.4, 0.2, 0], "plant", [], "Fruit and veg", { each: { name: "red onion", plural: "red onions", grams: 150 }, veg: true, root: true }),
  ing("spring-onions", "Spring onions", [2, 3, 1.5, 0.5, 0], "plant", [], "Fruit and veg", { buy: { unit: "bunch", plural: "bunches", size: 100 }, root: true }),
  ing("carrots", "Carrots", [0.6, 7.9, 2.4, 0.3, 0.1], "plant", [], "Fruit and veg", { buy: bag(1000), veg: true, root: true }),
  ing("cucumber", "Cucumber", [0.6, 1.5, 0.6, 0.1, 0], "plant", [], "Fruit and veg", { each: { name: "cucumber", plural: "cucumbers", grams: 350 }, veg: true }),
  ing("salad-leaves", "Bagged salad leaves", [1, 1.7, 1.2, 0.3, 0], "plant", [], "Fruit and veg", { buy: bag(120), veg: true }),
  ing("mushrooms", "Mushrooms", [1.8, 0.4, 1.1, 0.5, 0], "plant", [], "Fruit and veg", { short: "mushroom", buy: pack(250), veg: true }),
  ing("courgette", "Courgette", [1.8, 1.8, 1.1, 0.4, 0], "plant", [], "Fruit and veg", { short: "courgette", each: { name: "courgette", plural: "courgettes", grams: 200 }, veg: true }),
  ing("sweetcorn", "Tinned sweetcorn, drained", [2.9, 17, 2.5, 1.2, 0.3], "plant", [], "Tins and jars", { buy: tin(165), veg: true }),
  ing("avocado", "Avocado", [1.9, 1.9, 3.4, 19.5, 0], "plant", [], "Fruit and veg", { each: { name: "avocado", plural: "avocados", grams: 140 } }),
  ing("beetroot", "Cooked beetroot (not in vinegar)", [1.7, 7.8, 2.5, 0.1, 0.2], "plant", [], "Fruit and veg", { short: "beetroot", buy: pack(250), veg: true, root: true }),
  ing("sweet-potato", "Sweet potato", [1.6, 20, 3, 0.1, 0.1], "plant", [], "Fruit and veg", { short: "sweet potato", each: { name: "sweet potato", plural: "sweet potatoes", grams: 250 }, root: true }),
  ing("potato", "Baking potato", [2, 17, 1.8, 0.1, 0], "plant", [], "Fruit and veg", { short: "potato", each: { name: "potato", plural: "potatoes", grams: 250 }, root: true }),
  ing("new-potatoes", "New potatoes", [1.7, 15, 1.7, 0.3, 0], "plant", [], "Fruit and veg", { short: "potato", buy: bag(750), root: true }),
  ing("roasted-peppers", "Roasted peppers from a jar", [1, 5, 1.5, 0.5, 0.9], "plant", [], "Tins and jars", { buy: jar(220), veg: true }),
  ing("berries", "Frozen mixed berries", [1, 6.5, 4, 0.3, 0], "plant", [], "Frozen", { buy: bag(500) }),
  ing("banana", "Banana", [1.2, 20, 1.4, 0.3, 0], "plant", [], "Fruit and veg", { each: { name: "banana", plural: "bananas", grams: 100 } }),
  ing("apple", "Apple", [0.4, 11.6, 2, 0.1, 0], "plant", [], "Fruit and veg", { each: { name: "apple", plural: "apples", grams: 150 } }),
  ing("lemon", "Lemon", [0.4, 3.2, 0, 0.3, 0], "plant", [], "Fruit and veg", { each: { name: "lemon", plural: "lemons", grams: 30 } }),
  ing("coriander", "Fresh coriander", [2.1, 3.7, 2.8, 0.5, 0.1], "plant", [], "Fruit and veg", { buy: pack(30) }),
  ing("ginger", "Ginger paste", [1.5, 10, 2, 0.8, 1], "plant", [], "World foods", { pantry: true, root: true }),

  // bread, grains and carbs
  ing("oats", "Porridge oats", [11, 60, 9, 8, 0], "plant", ["gluten"], "Store cupboard", { buy: bag(1000) }),
  ing("gf-oats", "Gluten-free oats", [11, 60, 9, 8, 0], "plant", [], "Store cupboard", { short: "oats", buy: bag(450) }),
  ing("wholemeal-bread", "Wholemeal bread", [10, 42, 7, 2.5, 1], "plant", ["gluten"], "Bakery", { buy: { unit: "loaf", plural: "loaves", size: 800 }, each: { name: "slice", plural: "slices", grams: 36 } }),
  ing("gf-bread", "Gluten-free bread", [5, 45, 6, 5, 1], "plant", [], "Bakery", { short: "toast", buy: { unit: "loaf", plural: "loaves", size: 400 }, each: { name: "slice", plural: "slices", grams: 36 } }),
  ing("rye-crispbread", "Rye crispbreads", [8.5, 67, 16.5, 1.5, 0.8], "plant", ["gluten"], "Bakery", { buy: pack(250), each: { name: "crispbread", plural: "crispbreads", grams: 10 } }),
  ing("wrap", "Wholemeal wraps", [9, 45, 6.5, 6, 1], "plant", ["gluten"], "Bakery", { short: "wrap", buy: { unit: "pack of 6", plural: "packs of 6", size: 372 }, each: { name: "wrap", plural: "wraps", grams: 62 } }),
  ing("gf-wrap", "Gluten-free wraps", [4, 50, 5, 6, 1], "plant", [], "Bakery", { short: "wrap", buy: { unit: "pack of 6", plural: "packs of 6", size: 360 }, each: { name: "wrap", plural: "wraps", grams: 60 } }),
  ing("pitta", "Wholemeal pittas", [10, 46, 6, 1.5, 1], "plant", ["gluten"], "Bakery", { short: "pitta", buy: { unit: "pack of 6", plural: "packs of 6", size: 348 }, each: { name: "pitta", plural: "pittas", grams: 58 } }),
  ing("roll", "Wholemeal rolls", [10, 44, 6, 3, 1], "plant", ["gluten"], "Bakery", { buy: { unit: "pack of 4", plural: "packs of 4", size: 240 }, each: { name: "roll", plural: "rolls", grams: 60 } }),
  ing("bagel", "Bagels", [10, 48, 3, 1.5, 1], "plant", ["gluten"], "Bakery", { short: "bagel", buy: { unit: "pack of 4", plural: "packs of 4", size: 340 }, each: { name: "bagel", plural: "bagels", grams: 85 } }),
  ing("pasta", "Wholewheat pasta (dry)", [13, 62, 9, 2.5, 0], "plant", ["gluten"], "Rice, pasta and grains", { short: "pasta", buy: bag(500) }),
  ing("gf-pasta", "Gluten-free pasta (dry)", [7, 75, 3, 1.5, 0], "plant", [], "Rice, pasta and grains", { short: "pasta", buy: bag(500) }),
  ing("noodles", "Straight-to-wok egg noodles", [5.5, 26, 1.5, 2, 0.4], "plant", ["gluten", "eggs"], "World foods", { short: "noodle", buy: pouch(150) }),
  ing("rice-noodles", "Straight-to-wok rice noodles", [2, 30, 1, 0.5, 0.1], "plant", [], "World foods", { short: "noodle", buy: pouch(150) }),
  ing("rice-pouch", "Microwave wholegrain rice (pouch)", [3.4, 30, 2, 1.5, 0.1], "plant", [], "Rice, pasta and grains", { short: "rice", buy: pouch(250) }),
  ing("quinoa-pouch", "Microwave quinoa (pouch)", [5, 22, 4, 3, 0.3], "plant", [], "Rice, pasta and grains", { short: "quinoa", buy: pouch(250) }),
  ing("couscous", "Wholewheat couscous (dry)", [13, 66, 7, 2, 0], "plant", ["gluten"], "Rice, pasta and grains", { short: "couscous", buy: bag(500) }),
  ing("gnocchi", "Gnocchi", [4, 33, 1.6, 0.4, 1], "plant", ["gluten"], "Chilled", { short: "gnocchi", buy: pack(500) }),
  ing("oatcakes", "Oatcakes", [10, 58, 8, 18, 1.2], "plant", ["gluten"], "Bakery", { buy: pack(300), each: { name: "oatcake", plural: "oatcakes", grams: 10 } }),

  // sauces and pantry
  ing("pesto", "Green pesto", [5, 4, 1.5, 40, 2.5], "dairy", ["milk", "tree-nuts"], "Tins and jars", { short: "pesto", buy: jar(190), lactoseFree: true }),
  ing("salsa", "Tomato salsa (jar)", [1.4, 6, 1.5, 0.3, 1], "plant", [], "World foods", { short: "salsa", buy: jar(300) }),
  ing("sweet-chilli", "Sweet chilli sauce", [0.3, 50, 0.5, 0.2, 2], "plant", [], "World foods", { buy: jar(250) }),
  ing("light-mayo", "Light mayonnaise", [0.8, 7, 0, 27, 1.4], "egg", ["eggs", "mustard"], "Tins and jars", { buy: jar(400) }),
  ing("coconut-milk", "Light coconut milk", [1, 2, 0, 6, 0.1], "plant", [], "World foods", { buy: tin(400) }),
  ing("olives", "Pitted olives", [1, 1, 3, 13, 2.2], "plant", [], "Tins and jars", { buy: jar(160) }),
  ing("oil", "Olive oil or spray", [0, 0, 0, 100, 0], "plant", [], "Store cupboard", { pantry: true }),
  ing("soy-sauce", "Reduced-salt soy sauce", [8, 5, 0, 0, 9], "plant", ["soya", "gluten"], "World foods", { pantry: true }),
  ing("tamari", "Tamari (gluten-free soy sauce)", [10, 5, 0, 0, 12], "plant", ["soya"], "World foods", { pantry: true }),
  ing("stock", "Reduced-salt stock, made up", [0.3, 0.6, 0, 0.2, 0.4], "plant", ["celery"], "Store cupboard", { pantry: true }),
  ing("curry-paste", "Curry paste (tikka or korma)", [3, 12, 3, 20, 4], "plant", ["mustard"], "World foods", { pantry: true }),
  ing("thai-paste", "Thai green curry paste", [2, 12, 3, 8, 6], "fish", ["fish", "crustaceans"], "World foods", { pantry: true }),
  ing("vegan-thai-paste", "Vegan Thai green curry paste", [2, 12, 3, 8, 5], "plant", [], "World foods", { pantry: true }),
  ing("garlic", "Garlic (lazy or granules)", [6, 16, 2, 0.5, 0], "plant", [], "Store cupboard", { pantry: true, root: true }),
  ing("asafoetida", "Asafoetida (hing)", [4, 68, 4, 1, 0], "plant", ["gluten"], "World foods", { pantry: true }),
  ing("spices", "Dried herbs and spices", [10, 50, 25, 10, 0.1], "plant", [], "Store cupboard", { pantry: true }),
  ing("chilli-flakes", "Chilli flakes or powder", [12, 50, 30, 15, 0.1], "plant", [], "Store cupboard", { pantry: true }),
  ing("honey", "Honey", [0.4, 82, 0, 0, 0], "plant", [], "Store cupboard", { pantry: true }),
];

export const INGREDIENT = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i])) as Record<string, Ingredient>;

/** Kinds that aren't plant or dairy: honey is the one plant item vegans leave out, handled in the engine. */
export const NOT_VEGAN_PLANT = new Set(["honey"]);
