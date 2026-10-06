// The swap resolver (plan §5.4): fits one recipe to one person. Hard rules (diet, allergens, pregnancy) are never
// "probably fine"; a line that can't be swapped to something safe rules the recipe out.
import { INGREDIENT, nutritionOf, rounded, SWAPS, TOP_UPS, type Ingredient, type Line, type Nutrition, type Recipe, type Slot } from "@landing/content";
import type { Profile } from "./profile.ts";

const MEAT = new Set(["beef", "lamb", "pork", "poultry"]);
const ANIMAL = new Set([...MEAT, "fish", "shellfish"]);
const STRONG_SMELLS = new Set(["mackerel-smoked", "sardines-tin", "smoked-salmon", "salmon-tin", "thai-paste"]);

export interface SwapMade { from: string; to: string; note?: string; why: string }
export interface Personalised {
  recipe: Recipe;
  /** The recipe's name, renamed when the star of it was swapped ("Tofu tikka traybake"). */
  name: string;
  ok: boolean;
  /** Why it doesn't suit, for "show everything" lists. Empty when ok. */
  blocked: string[];
  /** The recipe's lines after swaps, per portion. */
  lines: Line[];
  swaps: SwapMade[];
  topUp?: { i: string; g: number; label: string };
  /** Per portion, after swaps and any top-up, rounded for display. */
  nutrition: Nutrition;
}

/** Why an ingredient can't be used, or null if it can. `withMeat` is for kosher's no-meat-with-dairy rule. */
export function refuse(ing: Ingredient, p: Profile, withMeat = false): string | null {
  const k = ing.kind;
  switch (p.diet) {
    case "vegetarian": if (ANIMAL.has(k)) return "vegetarian"; break;
    case "veg-no-egg": if (ANIMAL.has(k) || k === "egg" || ing.allergens.includes("eggs")) return "vegetarian, no eggs"; break;
    case "jain": if (ANIMAL.has(k) || k === "egg" || ing.allergens.includes("eggs") || ing.root) return "Jain"; break;
    case "vegan": if (ANIMAL.has(k) || k === "egg" || k === "dairy" || ing.allergens.includes("eggs") || ing.allergens.includes("milk") || ing.id === "honey") return "vegan"; break;
    case "pescatarian": if (MEAT.has(k)) return "pescatarian"; break;
    case "halal": if (k === "pork") return "halal"; break;
    case "kosher": if (k === "pork" || k === "shellfish") return "kosher"; if (withMeat && (k === "dairy" || ing.allergens.includes("milk"))) return "kosher: no meat with dairy"; break;
  }
  const allergen = ing.allergens.find((a) => p.allergens.includes(a));
  if (allergen) return `allergy: ${allergen}`;
  if (p.lactoseFree && ing.allergens.includes("milk") && !ing.lactoseFree) return "lactose";
  if (p.dislikes.includes(ing.id)) return "you'd rather not";
  if (p.conditions.includes("pregnancy") && ing.pregnancyAvoid) return "pregnancy";
  const av = p.aversions;
  if (av.includes("meat") && MEAT.has(k)) return "you can't face meat at the moment";
  if (av.includes("fish") && (k === "fish" || k === "shellfish")) return "you can't face fish at the moment";
  if (av.includes("eggs") && k === "egg" && ing.id === "eggs") return "you can't face eggs at the moment";
  if (av.includes("dairy") && k === "dairy") return "you can't face dairy at the moment";
  if (av.includes("strong-smells") && STRONG_SMELLS.has(ing.id)) return "strong smells";
  return null;
}

const slotTarget = (slot: Slot, p: Profile) => proteinTarget(slot, p);

/** The protein a meal should reach for this person, in grams. Minimums follow the Easy standard (plan §5.2). */
export function proteinTarget(slot: Slot, p: Profile): number {
  const noTargets = p.conditions.includes("kidney") || p.conditions.includes("pregnancy");
  if (slot === "snack") return 10;
  if (noTargets) return slot === "breakfast" ? 15 : 25;
  if (slot === "breakfast") return p.goal === "steady" ? 20 : 25;
  return p.goal === "strength" ? 30 : 25;
}

function kitOk(r: Recipe, p: Profile): boolean {
  return r.kit.every((k) => k === "none" || (k === "tray" ? p.kit.includes("oven") || p.kit.includes("air-fryer") : p.kit.includes(k)));
}

export function personalise(r: Recipe, p: Profile): Personalised {
  const blocked: string[] = [];
  const swaps: SwapMade[] = [];

  const resolveLines = (withMeat: boolean): Line[] | null => {
    const out: Line[] = [];
    for (const l of r.ingredients) {
      const ing = INGREDIENT[l.i];
      const why = refuse(ing, p, withMeat);
      if (!why) { out.push(l); continue; }
      const allowed = r.only?.[l.i];
      const alt = (SWAPS[l.i] ?? []).find((s) => (!allowed || allowed.includes(s.to)) && !refuse(INGREDIENT[s.to], p, withMeat));
      if (alt) {
        out.push({ ...l, i: alt.to, g: Math.round(l.g * alt.ratio) });
        swaps.push({ from: l.i, to: alt.to, note: alt.note, why });
      } else if (l.optional) {
        continue;
      } else {
        blocked.push(`${ing.name} (${why})`);
        return null;
      }
    }
    return out;
  };

  let lines = resolveLines(false);
  if (lines && p.diet === "kosher" && lines.some((l) => MEAT.has(INGREDIENT[l.i].kind))) {
    swaps.length = 0;
    lines = resolveLines(true);
  }

  // Recipe-level rules: kit, time, budget, heat, richness, salt.
  if (!kitOk(r, p)) blocked.push(`needs ${r.kit.filter((k) => k !== "none").join(" and ")}`);
  if (r.handsOn > p.maxMinutes) blocked.push(`${r.handsOn} minutes hands-on`);
  if (r.cost > p.budget) blocked.push("over your budget");
  if (r.spicy && p.aversions.includes("spicy")) blocked.push("spicy");

  let nutrition = nutritionOf(lines ?? r.ingredients);
  if (p.aversions.includes("rich") && nutrition.fat > 20) blocked.push("rich");
  const lowSalt = p.conditions.includes("high-blood-pressure") || p.conditions.includes("kidney");
  if (lowSalt && nutrition.salt > 1.5) blocked.push(`${nutrition.salt.toFixed(1)} g salt`);

  // A swap that drops the protein below the target gets a top-up from the vetted list, unless targets are off.
  let topUp: Personalised["topUp"];
  const noTopUps = p.conditions.includes("kidney") || p.conditions.includes("pregnancy");
  if (lines && !noTopUps && swaps.length && nutrition.protein < slotTarget(r.slot, p) && r.slot !== "snack") {
    topUp = TOP_UPS.find((t) => !refuse(INGREDIENT[t.i], p) && !lines!.some((l) => l.i === t.i));
    if (topUp) nutrition = nutritionOf([...lines, { i: topUp.i, g: topUp.g }]);
  }
  // Only promise a top-up where one was added.
  if (!topUp) for (const s of swaps) if (s.note && /top-up/.test(s.note)) delete s.note;
  const min = r.slot === "snack" ? 10 : r.slot === "breakfast" ? 15 : 25;
  if (lines && nutrition.protein < min && !noTopUps) blocked.push(`only ${Math.round(nutrition.protein)} g protein after swaps`);

  return { recipe: r, name: rename(r.name, swaps), ok: blocked.length === 0 && !!lines, blocked, lines: lines ?? r.ingredients, swaps, topUp, nutrition: rounded(nutrition) };
}

/** A short everyday name: "red lentils", not "Red lentils (dry)". */
export const plainName = (id: string) => INGREDIENT[id].name.replace(/\s*\(.*?\)/g, "").replace(/^\d+% fat /, "").toLowerCase();

/** "Chicken tikka traybake" with chicken swapped for tofu becomes "Tofu tikka traybake". */
export function rename(name: string, swaps: SwapMade[]): string {
  let out = name;
  for (const s of swaps) {
    const from = INGREDIENT[s.from].short, to = INGREDIENT[s.to].short;
    if (!from || !to || from === to) continue;
    const re = new RegExp(`\\b${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    const m = out.match(re);
    if (!m) continue;
    const word = m.index === 0 ? to.charAt(0).toUpperCase() + to.slice(1) : to;
    out = out.slice(0, m.index) + word + out.slice(m.index! + m[0].length);
  }
  return out;
}
