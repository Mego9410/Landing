// Kitchen amounts for a recipe line: "2 eggs", "1 tbsp", "150 ml", "120 g". Grams stay the source of truth.
import { INGREDIENT } from "@landing/content";

const LIQUID = new Set(["milk", "lactose-free-milk", "soya-milk", "protein-milk", "stock", "coconut-milk", "passata"]);
const SPOON = new Set(["soy-sauce", "tamari", "sweet-chilli", "curry-paste", "thai-paste", "vegan-thai-paste", "pesto", "peanut-butter", "light-mayo", "honey", "ginger", "garlic", "hummus", "salsa", "seeds", "almonds"]);
const PINCH = new Set(["spices", "chilli-flakes", "asafoetida"]);

const half = (n: number) => {
  const r = Math.round(n * 2) / 2;
  const whole = Math.floor(r);
  return r - whole ? (whole ? `${whole}½` : "½") : String(whole);
};

/** A friendly amount for `g` grams of an ingredient. */
export function quantity(id: string, g: number): string {
  const ing = INGREDIENT[id];
  if (!ing) return `${Math.round(g)} g`;
  if (ing.each) {
    const n = g / ing.each.grams;
    const word = n > 1.25 ? ing.each.plural ?? ing.each.name + "s" : ing.each.name;
    return `${half(Math.max(0.5, n))} ${word}`;
  }
  if (LIQUID.has(id)) return `${Math.max(5, Math.round(g / 5) * 5)} ml`;
  if (id === "oil") return g <= 5 ? "1 tsp" : `${half(g / 5)} tsp`;
  if (PINCH.has(id)) return g <= 1 ? "a pinch" : `${half(g / 2)} tsp`;
  if (SPOON.has(id)) return g < 12 ? `${half(g / 5)} tsp` : `${half(g / 15)} tbsp`;
  return `${Math.max(5, Math.round(g / 5) * 5)} g`;
}
