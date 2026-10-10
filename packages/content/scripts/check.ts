// Checks the food library before anyone reviews it: every reference resolves, every recipe meets the Easy standard
// (plan §5.2) and the brand's language rules. Exits non-zero on any error. Run: pnpm --filter @landing/content check
import { INGREDIENT, INGREDIENTS, PROTEIN_MIN, RECIPES, SWAPS, TOP_UPS, VEG_PORTION, nutritionOf } from "../src/index.ts";

const errors: string[] = [];
const notes: string[] = [];
const err = (m: string) => errors.push(m);

const dupes = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
for (const d of dupes(INGREDIENTS.map((i) => i.id))) err(`Duplicate ingredient id ${d}`);
for (const d of dupes(RECIPES.map((r) => r.id))) err(`Duplicate recipe id ${d}`);

for (const [from, list] of Object.entries(SWAPS)) {
  if (!INGREDIENT[from]) err(`Swap list for unknown ingredient ${from}`);
  for (const s of list) {
    if (!INGREDIENT[s.to]) err(`Swap ${from} → unknown ${s.to}`);
    if (s.to === from) err(`Swap ${from} → itself`);
    if (!(s.ratio > 0 && s.ratio <= 4)) err(`Swap ${from} → ${s.to} has an odd ratio ${s.ratio}`);
  }
}
for (const t of TOP_UPS) if (!INGREDIENT[t.i]) err(`Top-up uses unknown ${t.i}`);

// Brand language (docs and the design-system README): no diet-culture words, no emoji.
const BANNED = /\b(cheat|guilt|guilty|guilt-free|sinful|junk|clean eating|burn|fail|failure|back on track|naughty|skinny|diet food|willpower|journey|detox|superfoods?|goal weight)\b/i;
const EMOJI = /\p{Extended_Pictographic}/u;
const words = (r: (typeof RECIPES)[number]) => [
  r.name, r.blurb, ...r.steps, r.storeCupboard ?? "", ...Object.values(r.nameFor ?? {}),
  ...Object.values(r.stepsFor ?? {}).flatMap((v) => (Array.isArray(v) ? v : Object.values(v))),
];

for (const r of RECIPES) {
  const where = `${r.id}:`;
  const unknown = r.ingredients.filter((l) => !INGREDIENT[l.i]);
  for (const l of unknown) err(`${where} unknown ingredient ${l.i}`);
  if (unknown.length) continue;

  const shopping = r.ingredients.filter((l) => !l.optional && !INGREDIENT[l.i].pantry);
  const n = nutritionOf(r.ingredients);
  const batch = r.serves >= 4;
  // Tray bakes may run past 20 minutes because the oven does the work (decided 6 October 2026), up to 40.
  const trayBake = r.kit.includes("tray");

  if (shopping.length > 6) err(`${where} ${shopping.length} shopping ingredients (Easy standard: 6 or fewer)`);
  if (r.handsOn > 15) err(`${where} ${r.handsOn} minutes hands-on (Easy standard: 15 or fewer)`);
  if (r.handsOn > r.total) err(`${where} hands-on time is longer than the total`);
  if (r.total > 20 && !batch && !trayBake) err(`${where} ${r.total} minutes in total (Easy standard: 20, or a tray bake or batch)`);
  if (r.total > 40 && trayBake && !batch) err(`${where} ${r.total} minutes is too long for a tray bake (40 at most)`);
  if (r.total > 45) err(`${where} ${r.total} minutes is too long even for a batch`);
  if (r.handsOn !== r.time.active || r.total !== r.time.active + r.time.wait) err(`${where} times don't add up`);
  if (r.total > 20 && trayBake && !batch) notes.push(`${r.id}: ready in ${r.total} minutes, ${r.handsOn} hands-on (tray bake)`);
  if (r.washUp > 3) err(`${where} ${r.washUp} things to wash up (Easy standard: 3 or fewer)`);
  if (n.protein < PROTEIN_MIN[r.slot]) err(`${where} ${n.protein.toFixed(1)} g protein (minimum for ${r.slot}: ${PROTEIN_MIN[r.slot]} g)`);
  if ((r.slot === "lunch" || r.slot === "dinner") && n.vegGrams < VEG_PORTION) err(`${where} ${Math.round(n.vegGrams)} g veg (a main needs a portion, ${VEG_PORTION} g)`);
  if (r.collections.includes("gentle") && (r.spicy || n.fat > 15)) err(`${where} tagged gentle but ${r.spicy ? "spicy" : `${Math.round(n.fat)} g fat`}`);
  if (r.collections.includes("batch") && !batch) err(`${where} tagged batch but serves ${r.serves}`);
  if (r.collections.includes("no-cook") && !r.kit.includes("none")) err(`${where} tagged no-cook but needs ${r.kit.join(", ")}`);
  if (r.collections.includes("microwave") && r.kit.some((k) => k !== "microwave" && k !== "none")) err(`${where} tagged microwave but needs ${r.kit.join(", ")}`);
  if (!r.steps.length) err(`${where} has no steps`);
  // A recipe's own wording for a swap names substitutes it can actually get.
  for (const key of [...Object.keys(r.stepsFor ?? {}), ...Object.keys(r.nameFor ?? {})]) {
    for (const part of key.split("+")) {
      const [a, b] = part.split(">");
      if (!INGREDIENT[b ?? a] || (b && !r.ingredients.some((l) => l.i === a))) err(`${where} has wording for an unknown swap ${part}`);
    }
  }
  for (const [from, alts] of Object.entries(r.only ?? {})) {
    if (!r.ingredients.some((l) => l.i === from)) err(`${where} limits swaps for ${from}, which it doesn't use`);
    for (const a of alts) if (!INGREDIENT[a]) err(`${where} allows unknown swap ${a}`);
  }
  if (r.review.status === "approved" && !r.review.by) err(`${where} approved without a reviewer`);
  // Times live in the recipe's time fields and are shown by the app; a name or blurb that states one goes out of date.
  if (/\b(minute|minutes|mins?)\b/i.test(r.name + " " + r.blurb)) err(`${where} states a time in its name or blurb`);
  for (const t of words(r)) {
    if (BANNED.test(t)) err(`${where} uses "${t.match(BANNED)![0]}"`);
    if (EMOJI.test(t)) err(`${where} contains an emoji`);
  }
}

const slots = ["breakfast", "lunch", "dinner", "snack"] as const;
console.log(`${INGREDIENTS.length} ingredients, ${RECIPES.length} recipes: ${slots.map((k) => `${RECIPES.filter((r) => r.slot === k).length} ${k}`).join(", ")}`);
console.log(`Review: ${RECIPES.filter((r) => r.review.status === "approved").length} approved, ${RECIPES.filter((r) => r.review.status !== "approved").length} waiting for the dietitian and the cook`);
if (process.argv.includes("--table")) {
  for (const r of RECIPES) {
    const n = nutritionOf(r.ingredients);
    console.log(`${r.slot.padEnd(9)} ${r.id.padEnd(28)} ${String(r.handsOn).padStart(2)}+${String(r.time.wait).padStart(2)}=${String(r.total).padStart(2)} min  protein ${n.protein.toFixed(0).padStart(3)} g  fibre ${n.fibre.toFixed(0).padStart(2)} g  veg ${n.vegGrams.toFixed(0).padStart(3)} g  fat ${n.fat.toFixed(0).padStart(2)} g  salt ${n.salt.toFixed(1)} g`);
  }
}
for (const m of notes) console.log(`note: ${m}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  console.error(`${errors.length} error(s)`);
  process.exit(1);
}
console.log("All recipes meet the Easy standard.");
