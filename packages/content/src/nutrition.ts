// Nutrition for a list of ingredient lines, per portion. Shown in the app as "approx." in whole grams (plan §5.7).
import { INGREDIENT } from "./ingredients.ts";
import type { Line } from "./types.ts";

export interface Nutrition { protein: number; carbs: number; fibre: number; fat: number; salt: number; vegGrams: number }

export function nutritionOf(lines: Line[], { includeOptional = false } = {}): Nutrition {
  const n: Nutrition = { protein: 0, carbs: 0, fibre: 0, fat: 0, salt: 0, vegGrams: 0 };
  for (const l of lines) {
    if (l.optional && !includeOptional) continue;
    const ing = INGREDIENT[l.i];
    if (!ing) throw new Error(`Unknown ingredient "${l.i}"`);
    const k = l.g / 100;
    n.protein += ing.per100.protein * k;
    n.carbs += ing.per100.carbs * k;
    n.fibre += ing.per100.fibre * k;
    n.fat += ing.per100.fat * k;
    n.salt += ing.per100.salt * k;
    if (ing.veg) n.vegGrams += l.g;
  }
  return n;
}

/** Rounded for display: whole grams, salt to one decimal place. */
export function rounded(n: Nutrition): Nutrition {
  const r = Math.round;
  return { protein: r(n.protein), carbs: r(n.carbs), fibre: r(n.fibre), fat: r(n.fat), salt: r(n.salt * 10) / 10, vegGrams: r(n.vegGrams) };
}
