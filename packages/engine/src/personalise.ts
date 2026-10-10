// The swap resolver (plan §5.4): fits one recipe to one person. Hard rules (diet, allergens, pregnancy) are never
// "probably fine"; a line that can't be swapped to something safe rules the recipe out.
import { INGREDIENT, nutritionOf, rounded, SWAPS, TOP_UPS, type Ingredient, type Line, type Nutrition, type Recipe, type Slot } from "@landing/content";
import type { Profile } from "./profile.ts";
import { swapText, tidy } from "./words.ts";

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
  /** The method with the swaps written in, or the recipe's own version for those swaps (Recipe.stepsFor). */
  steps: string[];
  /** Anything to do ahead, left out when it was about an ingredient that's been swapped. */
  ahead?: string;
  /** An ingredient couldn't be swapped to something safe (diet, allergy, pregnancy), so `lines` aren't safe to cook. */
  unsafe?: boolean;
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
  // Two lines swapped to the same thing (prawns and egg, both to tofu) become one.
  if (lines) lines = lines.reduce<Line[]>((out, l) => {
    const same = out.find((o) => o.i === l.i && !o.optional === !l.optional);
    if (same) same.g += l.g; else out.push({ ...l });
    return out;
  }, []);

  // Recipe-level rules: kit, time, budget, heat, richness, salt.
  if (!kitOk(r, p)) blocked.push(`needs ${r.kit.filter((k) => k !== "none").join(" and ")}`);
  if (r.handsOn > p.maxMinutes) blocked.push(`${r.handsOn} minutes hands-on`);
  if (r.cost > p.budget) blocked.push("over your budget");
  if (r.spicy && p.aversions.includes("spicy")) blocked.push("spicy");

  let nutrition = nutritionOf(lines ?? r.ingredients);
  if (p.aversions.includes("rich") && nutrition.fat > 20) blocked.push("rich");
  const lowSalt = p.conditions.includes("high-blood-pressure") || p.conditions.includes("kidney");
  if (lowSalt && nutrition.salt > 1.5) blocked.push(p.safeMode ? "on the salty side" : `${nutrition.salt.toFixed(1)} g salt`);

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
  if (lines && nutrition.protein < min && !noTopUps) blocked.push(p.safeMode ? "not enough protein after swaps" : `only ${Math.round(nutrition.protein)} g protein after swaps`);

  // The recipe's own wording is already written for the swaps it was keyed by; the others are written in after.
  let own = r.steps.map((text) => ({ text, done: [] as SwapMade[] }));
  for (const o of matching(r.stepsFor, swaps)) {
    own = Array.isArray(o.v) ? o.v.map((text) => ({ text, done: o.covers })) : own.map((st, i) => (o.v as Record<number, string>)[i + 1] ? { text: (o.v as Record<number, string>)[i + 1], done: o.covers } : st);
  }
  const steps = own.filter((st) => st.text).map((st) => swapText(st.text, swaps.filter((s) => !st.done.includes(s))));
  const ahead = r.ahead && swaps.some((s) => INGREDIENT[s.from].short && r.ahead!.toLowerCase().includes(INGREDIENT[s.from].short!.toLowerCase())) ? undefined : r.ahead;
  return {
    recipe: r, name: rename(r.name, swaps, r.nameFor), ok: blocked.length === 0 && !!lines, blocked, lines: lines ?? r.ingredients, swaps, topUp, nutrition: rounded(nutrition),
    steps, ...(ahead ? { ahead } : {}), ...(lines ? {} : { unsafe: true }),
  };
}

/**
 * The recipe's own versions for these swaps, least specific first. A key names substitutes ("tofu") or swaps
 * ("eggs>tofu"), joined with "+"; it matches when every part was made.
 */
function matching<T, S extends { from: string; to: string }>(map: Record<string, T> | undefined, swaps: S[]): { v: T; covers: S[] }[] {
  if (!map || !swaps.length) return [];
  const hits = (part: string) => { const [a, b] = part.split(">"); return swaps.filter((s) => (b ? s.from === a && s.to === b : s.to === a)); };
  const weight = (parts: string[]) => parts.length * 2 + parts.filter((p) => p.includes(">")).length;
  return Object.entries(map)
    .map(([key, v]) => ({ parts: key.split("+"), v }))
    .filter((o) => o.parts.every((part) => hits(part).length))
    .sort((a, b) => weight(a.parts) - weight(b.parts))
    .map((o) => ({ v: o.v, covers: o.parts.flatMap(hits) }));
}

const ALLERGEN_WORD: Record<string, string> = { "tree-nuts": "tree nuts", eggs: "eggs", milk: "milk" };
/** Why a swap was made, as a phrase to follow it: "to keep it vegetarian", "as you avoid gluten". */
export function swapReason(why: string): string {
  const allergy = why.match(/^allergy: (.+)$/);
  if (allergy) return `as you avoid ${ALLERGEN_WORD[allergy[1]] ?? allergy[1]}`;
  const face = why.match(/^you can't face (.+)$/);
  if (face) return `as you can't face ${face[1]}`;
  switch (why) {
    case "vegetarian, no eggs": return "to keep it vegetarian, with no eggs";
    case "kosher: no meat with dairy": return "to keep meat and dairy apart";
    case "lactose": return "as you avoid lactose";
    case "you'd rather not": return "as you'd rather not have it";
    case "pregnancy": return "while you're pregnant";
    case "strong smells": return "to keep strong smells down";
    default: return `to keep it ${why}`;
  }
}

/** A short everyday name: "red lentils", not "Red lentils (dry)". */
export const plainName = (id: string) => INGREDIENT[id].name.replace(/\s*\(.*?\)/g, "").replace(/^\d+% fat /, "").toLowerCase();

/**
 * "Chicken tikka traybake" with chicken swapped for tofu becomes "Tofu tikka traybake"; "Beans and eggs on toast" for a
 * vegan becomes "Beans and tofu on toast". A recipe can name itself for a swap where that reads better (Recipe.nameFor),
 * and "Tofu and tofu fried rice" becomes "Tofu fried rice".
 */
export function rename(name: string, swaps: { from: string; to: string; why?: string }[], nameFor?: Record<string, string>): string {
  const own = matching(nameFor, swaps).pop();
  const word = (id: string) => INGREDIENT[id].short ?? INGREDIENT[id].step ?? plainName(id);
  const out = tidy(swapText(own?.v ?? name, swaps.filter((s) => word(s.from) !== word(s.to) && !own?.covers.includes(s)), word));
  return out.charAt(0).toUpperCase() + out.slice(1);
}
