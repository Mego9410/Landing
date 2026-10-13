// The words, temperatures, amounts and helpline behind US mode, as plain functions of the text and the country so they
// can be tested without the app. data/region.ts applies them for the country shown right now.
export type Region = "uk" | "us";

// UK words and their US versions, longest first so "semi-skimmed milk" wins over "semi-skimmed". Whole words only, and
// a capital stays a capital. "Beat" (the verb, in recipes) and brand names are left alone.
const SWAPS: [string, string][] = [
  ["semi-skimmed milk", "2% milk"], ["semi-skimmed", "2%"], ["skimmed milk", "skim milk"],
  ["porridge oats", "rolled oats"], ["porridge", "oatmeal"],
  ["spring onions", "scallions"], ["spring onion", "scallion"],
  ["turkey breast mince", "ground turkey breast"], ["lean beef mince", "lean ground beef"], ["soya mince", "soy crumbles"],
  ["beef mince", "ground beef"], ["turkey mince", "ground turkey"], ["pork mince", "ground pork"], ["lamb mince", "ground lamb"], ["chicken mince", "ground chicken"],
  ["Quorn mince", "Quorn mince"], ["veggie mince", "veggie grounds"], ["mince", "ground meat"],
  ["muffin tin", "muffin pan"], ["roasting tin", "roasting pan"], ["baking tin", "baking pan"],
  ["jacket-potato", "baked-potato"], ["jacket potatoes", "baked potatoes"], ["jacket potato", "baked potato"],
  ["rapeseed oil", "canola oil"], ["plain flour", "all-purpose flour"], ["kitchen paper", "paper towel"], ["frying pan", "skillet"],
  ["fizzy drinks", "soda"], ["takeaways", "takeouts"], ["takeaway", "takeout"],
  ["A&E", "the ER"], ["GPs", "doctors"], ["GP’s", "doctor’s"], ["GP's", "doctor's"], ["GP", "doctor"],
  ["jabs", "shots"], ["jab", "shot"],
  ["prawns", "shrimp"], ["prawn", "shrimp"], ["courgettes", "zucchini"], ["courgette", "zucchini"], ["aubergines", "eggplants"], ["aubergine", "eggplant"],
  ["soya", "soy"], ["coriander", "cilantro"], ["sweetcorn", "corn"], ["beetroot", "beets"],
  // Chips are fries, and crisps are chips: one pass, so a swapped word is never swapped again.
  ["chips", "fries"], ["crisps", "chips"],
  ["hob", "stovetop"], ["tinned", "canned"], ["tins", "cans"], ["tin", "can"],
  ["yoghurts", "yogurts"], ["yoghurt", "yogurt"], ["fibre", "fiber"], ["programmes", "programs"], ["programme", "program"],
  ["favourites", "favorites"], ["favourite", "favorite"], ["flavours", "flavors"], ["flavour", "flavor"], ["colours", "colors"], ["colour", "color"],
  ["litres", "liters"], ["litre", "liter"], ["centre", "center"],
  ["999", "911"],
];
// Whole phrases first: the eating disorder helpline is Beat in the UK and ANAD in the US.
const PHRASES: [RegExp, string][] = [
  [/Beat, the UK[’']s eating disorder charity/g, "ANAD, a US eating disorder charity"],
  [/Beat[’']s helpline/g, "ANAD’s helpline"],
  [/0808 801 0677/g, "1-888-375-7767"],
  [/beateatingdisorders\.org\.uk/g, "anad.org"],
];
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const LOOKUP = new Map(SWAPS.map(([uk, us]) => [uk.toLowerCase(), us]));
const WORDS = new RegExp(`(?<![\\w-])(${SWAPS.map(([uk]) => esc(uk)).join("|")})(?![\\w-])`, "gi");

// "Prawns" gives "Shrimp", but an initialism such as "GP" or "A&E" says nothing about the capital: "your GP" is "your doctor".
const isUpper = (ch = "") => ch !== ch.toLowerCase(), isLower = (ch = "") => ch !== ch.toUpperCase();
const cap = (from: string, to: string) => (isUpper(from[0]) && isLower(from[1]) ? to[0].toUpperCase() + to.slice(1) : to);
const f5 = (c: number) => Math.round((c * 9) / 5 + 32);

/** UK text as someone in the US reads it. Unchanged in the UK. */
export function localiseFor(text: string, r: Region): string {
  if (r === "uk" || !text) return text;
  return PHRASES.reduce((t, [uk, us]) => t.replace(uk, us), text)
    // A fan oven at 180°C is a conventional one at 200°C, about 400°F (rounded to the 25s ovens use).
    .replace(/(\d+)\s?°C fan/g, (_, c) => `${Math.round(f5(+c + 20) / 25) * 25}°F`)
    .replace(/(\d+)\s?°C/g, (_, c) => `${Math.round(f5(+c) / 5) * 5}°F`)
    .replace(WORDS, (m) => cap(m, LOOKUP.get(m.toLowerCase()) ?? m));
}

const half = (n: number) => {
  const w = Math.floor(n), q = Math.round((n - w) * 4);
  const frac = ["", "¼", "½", "¾"][q % 4], whole = q === 4 ? w + 1 : w;
  return whole ? `${whole}${frac}` : frac || "0";
};

/** A recipe or shopping amount in US measures: grams to ounces (pounds over a pound), millilitres to tablespoons or cups,
 *  litres to quarts. Spoons and counts stay as they are. Unchanged in the UK. */
export function amountFor(text: string, r: Region): string {
  if (r === "uk" || !text) return text;
  return localiseFor(text, r)
    .replace(/(\d+(?:\.\d+)?)\s?kg\b/g, (_, kg) => `${half(+kg * 2.20462)} lb`)
    .replace(/(\d+(?:\.\d+)?)\s?g\b/g, (_, g) => {
      const oz = +g / 28.3495;
      return oz >= 16 ? `${half(oz / 16)} lb` : `${oz < 1 ? half(Math.max(0.25, oz)) : Math.round(oz * 2) / 2} oz`;
    })
    .replace(/(\d+(?:\.\d+)?)\s?(?:ml|millilitres?|milliliters?)\b/g, (_, ml) => (+ml < 60 ? `${half(+ml / 15)} tbsp` : `${half(+ml / 240)} ${+ml / 240 > 1.1 ? "cups" : "cup"}`))
    .replace(/(\d+(?:\.\d+)?)\s?(?:l|litres?|liters?)\b/g, (_, l) => `${half(+l * 1.05669)} qt`);
}

/** Who to talk to when food or eating feels hard: Beat in the UK, ANAD in the US. */
export const HELPLINE: Record<Region, { name: string; who: string; phone: string; tel: string; web: string }> = {
  uk: { name: "Beat", who: "Beat, the UK’s eating disorder charity", phone: "0808 801 0677", tel: "tel:08088010677", web: "beateatingdisorders.org.uk" },
  us: { name: "ANAD", who: "ANAD, a US eating disorder charity", phone: "1-888-375-7767", tel: "tel:18883757767", web: "anad.org" },
};
