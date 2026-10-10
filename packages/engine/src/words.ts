// The words recipes use for their ingredients, so a swap can rewrite a method ("Add the chicken" becomes "Add the tofu")
// and a cook-along step can show what it needs. Names come from the ingredient table: `step` is the word a method
// uses, `short` the word in a dish name, `words` any others ("fish" for cod).
import { INGREDIENT } from "@landing/content";

const ADJ = /^(tinned|frozen|fresh|dried|cooked|chopped|sliced|grated|plain|light|low-fat|reduced-fat|reduced-salt|reduced-sugar and salt|wholemeal|wholegrain|wholewheat|smoked|ready-cooked|microwave|straight-to-wok|baby|cherry|red|green|spring|black|greek|greek-style|0% fat|skimmed|semi-skimmed|lactose-free|gluten-free|lean|bagged|boneless|pitted|unsweetened|high-protein|firm|king|puy|rye|porridge|baking|new|mixed|turkey breast|egg)\s+/;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A short everyday name for a list or a chip: "tinned chickpeas", not "Tinned chickpeas, drained". */
export const chipName = (id: string) => INGREDIENT[id].name.replace(/\s*\(.*?\)/g, "").split(",")[0].replace(/^\d+% fat /, "").trim().toLowerCase();

/** The word to write into a method for an ingredient: "tofu", "soya milk", "quinoa". */
export const sayOf = (id: string) => INGREDIENT[id].step ?? INGREDIENT[id].short ?? chipName(id);

const formCache = new Map<string, string[]>();
/** Every way a method might name an ingredient, longest first: "tinned chopped tomatoes", "chopped tomatoes", "tomatoes". */
export function formsOf(id: string): string[] {
  const hit = formCache.get(id);
  if (hit) return hit;
  const ing = INGREDIENT[id];
  const n = chipName(id);
  const out = [n];
  // "Cannellini or butter beans" names two things; the parts are forms too.
  for (const part of n.split(/ or /)) {
    let bare = part.trim();
    out.push(bare);
    while (ADJ.test(bare)) { bare = bare.replace(ADJ, ""); out.push(bare); }
  }
  for (const w of [ing.step, ing.short, ...(ing.words ?? [])]) if (w) out.push(w.toLowerCase());
  const forms = [...new Set(out)].filter((f) => f.length >= 3 && !/ and | or /.test(f) && !VAGUE.has(f)).sort((a, b) => b.length - a.length);
  formCache.set(id, forms);
  return forms;
}
// Words too vague to find an ingredient by on their own.
const VAGUE = new Set(["oil", "spray", "water", "salt", "pinch", "spices and herbs", "pouch", "mix", "drink", "fillet", "fillets", "slices", "pieces"]);

/** Words that aren't the food here: "salt and pepper" is the seasoning, "wrap in foil" and "roll the mince" are verbs. */
function seasoning(text: string, at: number, form: string) {
  if (form === "pepper") return /(salt and|salt,|black|white)\s+$/i.test(text.slice(Math.max(0, at - 12), at));
  if (form === "wrap" || form === "roll") return /^\s+(in|it|up|the|into|tightly)\b/i.test(text.slice(at + form.length));
  return false;
}

/** A regex for one form, whole words only, with an optional plural: "egg" finds "eggs", "sauce" doesn't find "saucepan". */
const formRe = (f: string, flags = "i") => new RegExp(`\\b${esc(f)}(?:e?s)?\\b`, flags);

/** Where the text mentions the ingredient, as [start, end] spans. */
function spans(text: string, id: string): [number, number][] {
  const out: [number, number][] = [];
  for (const f of formsOf(id)) {
    for (const m of text.matchAll(formRe(f, "gi"))) if (!seasoning(text, m.index ?? 0, f)) out.push([m.index ?? 0, (m.index ?? 0) + m[0].length]);
  }
  return out;
}

/** True if the text mentions the ingredient. */
export const mentions = (text: string, id: string) => spans(text, id).length > 0;

/** The ingredients (ids) a text mentions. A mention inside a longer one ("tofu" in "smoked tofu") counts for the longer. */
export function mentioned(text: string, ids: string[]): string[] {
  const found = [...new Set(ids)].map((id) => ({ id, at: spans(text, id) })).filter((f) => f.at.length);
  const inside = ([a, b]: [number, number], [c, d]: [number, number]) => c <= a && b <= d && d - c > b - a;
  return found.filter((f) => !f.at.every((sp) => found.some((o) => o !== f && o.at.some((big) => inside(sp, big))))).map((f) => f.id);
}

/**
 * The text with swaps written in, all in one pass so a word put in by one swap isn't swapped again. "Flake the salmon
 * on top" with salmon swapped for chickpeas becomes "Flake the chickpeas on top"; "an egg" becomes "a tofu" only if
 * nothing better was written for the recipe (see Recipe.stepsFor).
 */
export function swapText(text: string, swaps: { from: string; to: string }[], say: (id: string) => string = sayOf): string {
  const pairs: { form: string; to: string; id: string }[] = [];
  for (const s of swaps) for (const f of formsOf(s.from)) if (!pairs.some((p) => p.form === f)) pairs.push({ form: f, to: say(s.to), id: s.to });
  if (!pairs.length) return text;
  pairs.sort((a, b) => b.form.length - a.form.length);
  const re = new RegExp(`\\b(?:(an?|An?) )?(${pairs.map((p) => esc(p.form)).join("|")})(e?s)?\\b`, "gi");
  const out = text.replace(re, (m, article: string | undefined, word: string, plural: string | undefined, at: number) => {
    const pair = pairs.find((p) => p.form === word.toLowerCase());
    if (!pair || seasoning(text, at + (article ? article.length + 1 : 0), pair.form)) return m;
    let to = pair.to;
    // "warm wraps" stays plural when the substitute is counted the same way.
    const each = INGREDIENT[pair.id].each;
    if (plural && each && each.name === to) to = each.plural ?? to + "s";
    if (word[0] !== word[0].toLowerCase() && !article) to = to[0].toUpperCase() + to.slice(1);
    if (!article) return to;
    const a = /^[aeiou]/i.test(to) ? "an" : "a";
    return `${article[0] === "A" ? a[0].toUpperCase() + a.slice(1) : a} ${to}`;
  });
  return out === text ? out : tidy(out);
}

/** Two swaps to the same thing: "smoked tofu, smoked tofu and leaves" and "peppers and peppers" each say it once. */
export const tidy = (text: string) => text
  .replace(/, ([\w-]+(?: [\w-]+)?) and \1\b/gi, " and $1")
  .replace(/\b([\w-]+(?: [\w-]+)?)(?:,| and) \1\b/gi, "$1");
