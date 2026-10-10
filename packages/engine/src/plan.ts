// The weekly planner (plan §5.5): 3 to 5 cooked dinners, planned leftovers, a takeaway night and a free night;
// two or three breakfasts and lunches on rotation; a protein snack at the hungriest times. Deterministic for a seed,
// so "shuffle" gives a new week and the same seed always gives the same one.
import { INGREDIENT, RECIPES, type Recipe, type Slot } from "@landing/content";
import { personalise, plainName, swapReason, type Personalised } from "./personalise.ts";
import type { Profile } from "./profile.ts";
import { targets, type Targets } from "./targets.ts";
import { quantity } from "./format.ts";

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

export type MealKind = "cook" | "leftover" | "takeaway" | "free";
export interface Meal {
  slot: Slot;
  kind: MealKind;
  /** Recipe id for cook and leftover meals. */
  recipe?: string;
  /** For leftovers: the day (0 is Monday) it was cooked. */
  from?: number;
  /** Portions to cook this time, including any for leftovers. */
  cook?: number;
}
export interface Day { day: number; name: string; breakfast: Meal; lunch: Meal; dinner: Meal; snacks: Meal[] }
export interface Week { seed: number; days: Day[] }

/** A small seeded random number generator (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Every recipe fitted to the person, for the library screen. Pass `all` to keep the ones that don't suit. */
export function library(p: Profile, { all = false, includeDrafts = false } = {}): Personalised[] {
  return RECIPES.filter((r) => includeDrafts || r.review.status === "approved").map((r) => personalise(r, p)).filter((x) => all || x.ok);
}

const shoppingIds = (x: Personalised) => x.lines.filter((l) => !l.optional && !INGREDIENT[l.i].pantry).map((l) => l.i);

interface Ctx {
  p: Profile; t: Targets; rand: () => number; used: Map<string, number>; cuisines: Set<string>; basket: Set<string>;
  /** Recipes from recent weeks: how many weeks ago each was last planned (1 is last week), and how much it rests. */
  recent?: Map<string, { ago: number; rest: number }>;
  favourites?: Set<string>;
}

/** How hard a recipe planned 1, 2, 3 or 4 weeks ago is held back, so a dinner rests three or four weeks. */
const REST = [0, 12, 9, 6, 2.5];
/** Dinners rest fully; breakfasts and snacks rotate through a small set, so recency counts for less there. */
const REST_WEIGHT: Record<Slot, number> = { dinner: 1, lunch: 0.6, breakfast: 0.25, snack: 0.2 };
/** Weeks a favourite rests before it gets a nudge back in. */
const FAVOURITE_REST = 4;

/** Recent weeks' recipes (newest first) by id: when each was last planned, and a rest that adds up over the weeks it
 *  was in, so where a few recipes must repeat they take turns. */
function recency(recent: string[][] = []): Map<string, { ago: number; rest: number }> {
  const out = new Map<string, { ago: number; rest: number }>();
  recent.slice(0, REST.length - 1).forEach((ids, k) => {
    for (const id of new Set(ids)) {
      const e = out.get(id);
      if (e) e.rest += REST[k + 1]; else out.set(id, { ago: k + 1, rest: REST[k + 1] });
    }
  });
  return out;
}

/** How well a recipe suits this slot this week. Higher is better. */
export function score(x: Personalised, ctx: Ctx, slot: Slot): number {
  const { p, t } = ctx, r = x.recipe, n = x.nutrition;
  const target = t.protein[slot];
  let s = n.protein >= target ? 3 : -(target - n.protein) / 2;
  if (p.goal === "strength") s += Math.min(2, (n.protein - target) / 8);
  if (p.goal === "fuller") s += n.fibre / 5 + Math.min(2, n.vegGrams / 150);
  if (t.phase === "land") {
    if (r.collections.includes("gentle")) s += 2;
    if (r.handsOn <= 8) s += 1;
    if (n.fat > 20) s -= 1;
    if (n.fibre > t.fibreDay * 0.5) s -= 1.5; // a big jump in fibre at once can mean bloating
  }
  if (t.phase === "settle") {
    if (r.collections.includes("fakeaway")) s += 1.5;
    if (slot === "dinner" && r.collections.includes("batch")) s += 1;
  }
  if (!ctx.cuisines.has(r.cuisine)) s += t.phase === "steady" ? 1.5 : 0.5;
  if (p.cuisines.includes(r.cuisine)) s += 1.5;
  if (p.conditions.includes("reflux") && slot === "dinner") s -= (r.spicy ? 2 : 0) + (n.fat > 15 ? 1 : 0);
  if (p.conditions.includes("type-2-diabetes")) s += n.carbs > 60 ? -1.5 : n.carbs <= 45 ? 0.5 : 0;
  // Ingredient overlap: prefer meals that use up packs already on the list (plan §5.5).
  const shared = shoppingIds(x).filter((i) => ctx.basket.has(i)).length;
  s += Math.min(3, shared * 0.6);
  s -= (ctx.used.get(r.id) ?? 0) * 14; // twice in one week is worse than a dinner from last week
  if (x.swaps.length) s -= 0.3 * x.swaps.length;
  // Freshness: recent recipes rest, and favourites come back once they've rested (roughly monthly).
  const rested = ctx.recent?.get(r.id);
  if (rested) s -= rested.rest * REST_WEIGHT[slot];
  if (ctx.favourites?.has(r.id) && (!rested || rested.ago >= FAVOURITE_REST)) s += 4;
  return s + ctx.rand() * 1.5;
}

function pick(cands: Personalised[], ctx: Ctx, slot: Slot, filter: (x: Personalised) => boolean = () => true): Personalised | undefined {
  let best: Personalised | undefined, bestScore = -Infinity;
  for (const x of cands) {
    if (!filter(x)) continue;
    const s = score(x, ctx, slot);
    if (s > bestScore) { best = x; bestScore = s; }
  }
  if (best) {
    ctx.used.set(best.recipe.id, (ctx.used.get(best.recipe.id) ?? 0) + 1);
    ctx.cuisines.add(best.recipe.cuisine);
    for (const i of shoppingIds(best)) ctx.basket.add(i);
  }
  return best;
}

/** Which nights are cooked, and which are leftovers of an earlier night, for 3, 4 or 5 cook nights. */
const DINNER_PATTERN: Record<3 | 4 | 5, (MealKind | number)[]> = {
  3: ["cook", 0, "cook", 2, "takeaway", "cook", "free"],
  4: ["cook", "cook", 1, "cook", "takeaway", "cook", "free"],
  5: ["cook", "cook", "cook", 2, "takeaway", "cook", "cook"],
};

export interface PlanOptions {
  seed?: number; includeDrafts?: boolean;
  /** Recipe ids planned in recent weeks, newest first (recent[0] is last week), so meals rest before they come back. */
  recent?: string[][];
  /** Recipes to bring back now and then ("Have it again"). */
  favourites?: string[];
  /** Recipes never to plan ("Not for me"). */
  avoid?: string[];
}

export function planWeek(p: Profile, { seed = 1, includeDrafts = false, recent, favourites, avoid = [] }: PlanOptions = {}): Week {
  const t = targets(p);
  const ctx: Ctx = { p, t, rand: rng(seed), used: new Map(), cuisines: new Set(), basket: new Set(), recent: recency(recent), favourites: new Set(favourites) };
  const lib = library(p, { includeDrafts }).filter((x) => !avoid.includes(x.recipe.id));
  const bySlot = (s: Slot) => lib.filter((x) => x.recipe.slot === s);
  const days: Day[] = DAYS.map((name, day) => ({ day, name, breakfast: { slot: "breakfast", kind: "free" }, lunch: { slot: "lunch", kind: "free" }, dinner: { slot: "dinner", kind: "free" }, snacks: [] }));

  // Dinners first: they drive the shopping list and the leftovers.
  const keeps = (x: Personalised) => x.recipe.fridgeDays >= 1;
  DINNER_PATTERN[p.cookNights].forEach((k, d) => {
    if (k === "cook") {
      const feedsDinner = DINNER_PATTERN[p.cookNights][d + 1] === d;
      const x = pick(bySlot("dinner"), ctx, "dinner", feedsDinner ? keeps : undefined) ?? pick(bySlot("dinner"), ctx, "dinner");
      if (x) days[d].dinner = { slot: "dinner", kind: "cook", recipe: x.recipe.id, cook: p.household };
    } else if (typeof k === "number") {
      const src = days[k].dinner;
      if (src.kind === "cook" && src.recipe && personaliseById(src.recipe, p).recipe.fridgeDays >= 1) {
        days[d].dinner = { slot: "dinner", kind: "leftover", recipe: src.recipe, from: k };
        src.cook! += p.household;
      }
    } else {
      days[d].dinner = { slot: "dinner", kind: k };
    }
  });

  // Planned leftovers for lunch: a cooked dinner that keeps becomes the next day's lunch, up to twice a week.
  let leftoverLunches = 0;
  for (let d = 0; d < 6 && leftoverLunches < 2; d++) {
    const din = days[d].dinner;
    if (din.kind !== "cook" || !din.recipe || days[d + 1].dinner.from === d) continue;
    const x = personaliseById(din.recipe, p);
    if (x.recipe.fridgeDays >= 1 && !x.recipe.collections.includes("fakeaway") || x.recipe.collections.includes("batch")) {
      days[d + 1].lunch = { slot: "lunch", kind: "leftover", recipe: din.recipe, from: d };
      din.cook! += 1;
      leftoverLunches++;
    }
  }

  // Lunches on rotation, breakfasts on rotation (two for weekdays, one for the weekend), snacks at hungry times.
  const lunches = [pick(bySlot("lunch"), ctx, "lunch"), pick(bySlot("lunch"), ctx, "lunch"), pick(bySlot("lunch"), ctx, "lunch")].filter(Boolean) as Personalised[];
  let li = 0;
  for (const day of days) if (day.lunch.kind === "free" && lunches.length) day.lunch = { slot: "lunch", kind: "cook", recipe: lunches[li++ % lunches.length].recipe.id, cook: 1 };

  const quick = (x: Personalised) => x.recipe.handsOn <= 5;
  const hungryMorning = p.hungryTimes.includes("morning");
  const weekday = [pick(bySlot("breakfast"), ctx, "breakfast", quick), pick(bySlot("breakfast"), ctx, "breakfast", quick)].filter(Boolean) as Personalised[];
  if (hungryMorning) weekday.sort((a, b) => b.nutrition.protein - a.nutrition.protein);
  const weekend = pick(bySlot("breakfast"), ctx, "breakfast") ?? weekday[0];
  days.forEach((day, d) => {
    const b = d >= 5 ? weekend : weekday[d % Math.max(1, weekday.length)] ?? weekend;
    if (b) day.breakfast = { slot: "breakfast", kind: "cook", recipe: b.recipe.id, cook: 1 };
  });

  const perDay = snackCount(p);
  const snacks = Array.from({ length: Math.min(4, perDay * 2) }, () => pick(bySlot("snack"), ctx, "snack")).filter(Boolean) as Personalised[];
  days.forEach((day, d) => {
    for (let k = 0; k < perDay && snacks.length; k++) day.snacks.push({ slot: "snack", kind: "cook", recipe: snacks[(d + k * 2) % snacks.length].recipe.id, cook: 1 });
  });

  return { seed, days };
}

const cache = new WeakMap<Profile, Map<string, Personalised>>();
/** Personalise by id, cached per profile object. */
export function personaliseById(id: string, p: Profile): Personalised {
  let m = cache.get(p);
  if (!m) cache.set(p, (m = new Map()));
  let x = m.get(id);
  if (!x) {
    const r = RECIPES.find((r) => r.id === id);
    if (!r) throw new Error(`Unknown recipe ${id}`);
    m.set(id, (x = personalise(r, p)));
  }
  return x;
}

/** Protein and fibre for a day, counting only planned meals (not the takeaway or free night). */
export function dayTotals(day: Day, p: Profile): { protein: number; fibre: number; planned: number } {
  let protein = 0, fibre = 0, planned = 0;
  for (const m of [day.breakfast, day.lunch, day.dinner, ...day.snacks]) {
    if (!m.recipe) continue;
    const n = personaliseById(m.recipe, p).nutrition;
    protein += n.protein; fibre += n.fibre; planned++;
  }
  return { protein, fibre, planned };
}

/** Up to `n` alternatives for one meal: same slot, similar effort, enough protein, not already this week. */
export function swapOptions(week: Week, p: Profile, day: number, slot: Slot, { n = 3, includeDrafts = false, seed = 7, recent, favourites, avoid = [] }: { n?: number; includeDrafts?: boolean; seed?: number } & Omit<PlanOptions, "seed" | "includeDrafts"> = {}): Personalised[] {
  const meal = slot === "snack" ? week.days[day].snacks[0] : week.days[day][slot];
  const current = meal?.recipe ? personaliseById(meal.recipe, p) : undefined;
  const t = targets(p);
  const inWeek = new Set(week.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner, ...d.snacks].map((m) => m.recipe)).filter(Boolean));
  const ctx: Ctx = { p, t, rand: rng(seed + day * 31 + slot.length), used: new Map(), cuisines: new Set(), basket: new Set(), recent: recency(recent), favourites: new Set(favourites) };
  for (const d of week.days) for (const m of [d.breakfast, d.lunch, d.dinner, ...d.snacks]) if (m.recipe && m.recipe !== meal?.recipe) for (const i of shoppingIds(personaliseById(m.recipe, p))) ctx.basket.add(i);
  return library(p, { includeDrafts })
    .filter((x) => x.recipe.slot === slot && !inWeek.has(x.recipe.id) && !avoid.includes(x.recipe.id))
    .filter((x) => !current || x.recipe.handsOn <= current.recipe.handsOn + 5)
    .filter((x) => x.nutrition.protein >= Math.min(t.protein[slot], current?.nutrition.protein ?? Infinity) - 2)
    .map((x) => ({ x, s: score(x, ctx, slot) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((o) => o.x);
}

/** What can go into one meal: a recipe, leftovers of an earlier dinner, a takeaway night or nothing yet. */
export type Choice = { recipe: string } | { leftoverFrom: number } | { kind: "takeaway" | "free" };

const mealRef = (week: Week, day: number, slot: Slot, index = 0): Meal | undefined =>
  slot === "snack" ? week.days[day].snacks[index] : week.days[day][slot];

/**
 * Sets one meal and keeps the week consistent: leftovers of a replaced dinner follow the new dinner if it keeps,
 * or become free to choose; portions are recounted.
 */
export function setMeal(week: Week, p: Profile, day: number, slot: Slot, choice: Choice, index = 0): Week {
  const next: Week = JSON.parse(JSON.stringify(week));
  const target = mealRef(next, day, slot, index);
  if (!target) return next;
  delete target.from; delete target.recipe; delete target.cook;
  if ("recipe" in choice) Object.assign(target, { kind: "cook", recipe: choice.recipe, cook: slot === "dinner" ? p.household : 1 });
  else if ("leftoverFrom" in choice) Object.assign(target, { kind: "leftover", recipe: next.days[choice.leftoverFrom].dinner.recipe, from: choice.leftoverFrom });
  else target.kind = choice.kind;
  if (slot === "dinner") {
    const keeps = "recipe" in choice && personaliseById(choice.recipe, p).recipe.fridgeDays >= 1;
    for (const d of next.days) for (const m of [d.lunch, d.dinner]) {
      if (m === target || m.kind !== "leftover" || m.from !== day) continue;
      if (keeps) m.recipe = (choice as { recipe: string }).recipe;
      else { m.kind = "free"; delete m.recipe; delete m.from; }
    }
  }
  return recount(next, p);
}

/** Puts a recipe into one meal (see setMeal). */
export function replaceMeal(week: Week, p: Profile, day: number, slot: Slot, recipe: string, index = 0): Week {
  return setMeal(week, p, day, slot, { recipe }, index);
}

/** Earlier cooked dinners that would still keep by this meal, to offer as leftovers. */
export function leftoverOptions(week: Week, p: Profile, day: number, slot: Slot): { from: number; recipe: string; name: string }[] {
  if (slot !== "lunch" && slot !== "dinner") return [];
  const out: { from: number; recipe: string; name: string }[] = [];
  for (let f = day - 1; f >= 0; f--) {
    const src = week.days[f].dinner;
    if (src.kind !== "cook" || !src.recipe) continue;
    const x = personaliseById(src.recipe, p);
    if (x.recipe.fridgeDays >= day - f) out.push({ from: f, recipe: src.recipe, name: x.name });
  }
  return out;
}

/** A week with nothing chosen, for people who'd rather pick every meal themselves. */
export function emptyWeek(p: Profile, seed = 1): Week {
  const free = (slot: Slot): Meal => ({ slot, kind: "free" });
  return {
    seed,
    days: DAYS.map((name, day) => ({ day, name, breakfast: free("breakfast"), lunch: free("lunch"), dinner: free("dinner"), snacks: Array.from({ length: snackCount(p) }, () => free("snack")) })),
  };
}

/** Protein snacks a day: one for each of the hungriest times in the afternoon or later, up to two. */
export function snackCount(p: Profile): number {
  const times = p.hungryTimes.filter((h) => h === "afternoon" || h === "evening" || h === "late-night").length;
  return Math.min(2, Math.max(times, p.goal === "fuller" ? 1 : 0));
}

/** How much of the week is decided: meals with a recipe, leftovers or a takeaway, out of all meals. */
export function progress(week: Week): { chosen: number; total: number } {
  const all = week.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner, ...d.snacks]);
  return { chosen: all.filter((m) => m.kind !== "free").length, total: all.length };
}

/** Recomputes cook portions from the leftovers that point at each cooked dinner. */
export function recount(week: Week, p: Profile): Week {
  for (const d of week.days) if (d.dinner.kind === "cook") d.dinner.cook = p.household;
  for (const d of week.days) for (const m of [d.lunch, d.dinner]) {
    if (m.kind !== "leftover" || m.from === undefined) continue;
    const src = week.days[m.from].dinner;
    const keeps = !!src.recipe && personaliseById(src.recipe, p).recipe.fridgeDays >= d.day - m.from;
    if (src.kind === "cook" && src.recipe === m.recipe && keeps) src.cook = (src.cook ?? p.household) + (m.slot === "dinner" ? p.household : 1);
    else { m.kind = "cook"; m.cook = m.slot === "dinner" ? p.household : 1; delete m.from; }
  }
  return week;
}

/** One dish's share of a list item. */
export interface Use { name: string; day: number; slot: Slot; grams: number; amount: string }
/**
 * One thing to buy, combined across every dish that needs it: `total` is the kitchen amount ("400 g", "6 eggs"),
 * `label` what to pick up ("1 pack"), and `uses` the dishes it's for, so the sum is easy to check.
 */
export interface ListItem { id: string; name: string; grams: number; total: string; label: string; detail?: string; recipes: string[]; uses: Use[] }
export interface ShoppingList { aisles: { aisle: string; items: ListItem[] }[]; pantry: string[]; batchNotes: string[] }

const AISLE_ORDER = ["Fruit and veg", "Bakery", "Meat and fish", "Dairy and eggs", "Chilled", "Frozen", "Tins and jars", "Rice, pasta and grains", "World foods", "Store cupboard"];

function amount(id: string, grams: number): { label: string; detail?: string } {
  const ing = INGREDIENT[id];
  const count = ing.each ? Math.max(1, Math.ceil(grams / ing.each.grams - 0.15)) : 0;
  const counted = ing.each ? `${count} ${count === 1 ? ing.each.name : ing.each.plural ?? ing.each.name + "s"}` : undefined;
  if (ing.buy) {
    const n = Math.max(1, Math.ceil(grams / ing.buy.size - 0.1));
    return { label: `${n} ${n === 1 ? ing.buy.unit : ing.buy.plural ?? ing.buy.unit + "s"}`, detail: counted ? `${counted} this week` : undefined };
  }
  return counted ? { label: counted } : { label: `${Math.round(grams / 10) * 10} g` };
}

/** The week's shopping, by aisle, with the pantry staples listed separately to check (plan §6.2). */
export function shoppingList(week: Week, p: Profile): ShoppingList {
  const totals = new Map<string, { grams: number; recipes: Set<string>; uses: Use[] }>();
  const pantry = new Set<string>();
  const batchNotes: string[] = [];
  for (const d of week.days) for (const m of [d.breakfast, d.lunch, d.dinner, ...d.snacks]) {
    if (m.kind !== "cook" || !m.recipe) continue;
    const x = personaliseById(m.recipe, p);
    // A meal planned before a change of diet or allergies may no longer be safe: leave it off and say so.
    if (x.unsafe) { batchNotes.push(`${x.name} isn't on the list as it doesn't suit your diet or allergies now. Swap it from the meal plan.`); continue; }
    const used = new Map<string, number>();
    let portions = m.cook ?? 1;
    if (x.recipe.serves >= 4 && portions < x.recipe.serves) {
      batchNotes.push(`${x.name} makes ${x.recipe.serves}. Freeze what's left.`);
      portions = x.recipe.serves;
    }
    const lines = x.topUp ? [...x.lines, { i: x.topUp.i, g: x.topUp.g }] : x.lines;
    for (const l of lines) {
      if (l.optional) continue;
      const ing = INGREDIENT[l.i];
      if (ing.pantry) { pantry.add(ing.name); continue; }
      used.set(l.i, (used.get(l.i) ?? 0) + l.g * portions);
    }
    for (const [i, g] of used) {
      const e = totals.get(i) ?? { grams: 0, recipes: new Set<string>(), uses: [] };
      e.grams += g;
      e.recipes.add(x.name);
      e.uses.push({ name: x.name, day: d.day, slot: m.slot, grams: Math.round(g), amount: quantity(i, g) });
      totals.set(i, e);
    }
  }
  const aisles = new Map<string, ListItem[]>();
  for (const [id, e] of totals) {
    const ing = INGREDIENT[id];
    const list = aisles.get(ing.aisle) ?? [];
    list.push({ id, name: ing.name, grams: Math.round(e.grams), total: quantity(id, e.grams), ...amount(id, e.grams), recipes: [...e.recipes], uses: e.uses });
    aisles.set(ing.aisle, list);
  }
  return {
    aisles: AISLE_ORDER.filter((a) => aisles.has(a)).map((aisle) => ({ aisle, items: aisles.get(aisle)!.sort((a, b) => a.name.localeCompare(b.name)) })),
    pantry: [...pantry].sort(),
    batchNotes: [...new Set(batchNotes)],
  };
}

/** Why a recipe suits this person this week, for the recipe screen. Numbers only outside safe mode. */
export function reasons(x: Personalised, p: Profile, week?: Week): string[] {
  const t = targets(p), r = x.recipe, n = x.nutrition, out: string[] = [];
  if (n.protein >= t.protein[r.slot]) out.push(p.safeMode ? "Protein-rich" : `About ${n.protein} g protein`);
  if (r.collections.includes("gentle") && t.phase === "land") out.push("Gentle while your appetite settles");
  if (r.handsOn <= 5) out.push(`${r.handsOn <= 1 ? "No" : r.handsOn + " minutes"} hands-on`);
  if (r.collections.includes("batch")) out.push(`Makes ${r.serves}, so there's some for later`);
  if (r.collections.includes("fakeaway")) out.push("A takeaway favourite, made at home");
  if (p.goal === "fuller" && n.fibre >= 8) out.push(p.safeMode ? "Plenty of fibre" : `About ${n.fibre} g fibre`);
  if (p.cuisines.includes(r.cuisine)) out.push(`${r.cuisine}, as you asked`);
  for (const s of x.swaps) { const t = plainName(s.to); out.push(`${t.charAt(0).toUpperCase() + t.slice(1)} instead of ${plainName(s.from)}, ${swapReason(s.why)}`); }
  if (week) {
    const others = new Set<string>();
    for (const d of week.days) for (const m of [d.breakfast, d.lunch, d.dinner, ...d.snacks]) if (m.recipe && m.recipe !== r.id) for (const i of shoppingIds(personaliseById(m.recipe, p))) others.add(i);
    const shared = shoppingIds(x).filter((i) => others.has(i)).map(plainName);
    if (shared.length) out.push(`Uses up ${shared.slice(0, 2).join(" and ")} from this week's list`);
  }
  return out;
}

export interface WeekSummary { protein: number; fibre: number; cooks: number; notes: string[] }

/** Averages over the days with planned meals, and notes when the week is out of step with the targets. */
export function weekSummary(week: Week, p: Profile): WeekSummary {
  const t = targets(p);
  const days = week.days.map((d) => dayTotals(d, p)).filter((x) => x.planned >= 3);
  const avg = (k: "protein" | "fibre") => Math.round(days.reduce((a, d) => a + d[k], 0) / Math.max(1, days.length));
  const protein = avg("protein"), fibre = avg("fibre");
  const notes: string[] = [];
  if (fibre > t.fibreDay + 8) notes.push("This week's meals are high in fibre. If that's more than you usually eat, drink plenty and swap a meal or two if you feel bloated.");
  if (t.proteinDay && protein < t.proteinDay[0] - 10) notes.push("Protein is a little low this week. A protein snack at your hungriest time would help.");
  const ids = week.days.flatMap((d) => [d.dinner]).filter((m) => m.kind === "cook").map((m) => m.recipe);
  if (new Set(ids).size < ids.length) notes.push("Your settings leave only a few dinners to choose from, so some repeat. Adding kit or loosening the time limit opens up more.");
  return { protein, fibre, cooks: ids.length, notes };
}
