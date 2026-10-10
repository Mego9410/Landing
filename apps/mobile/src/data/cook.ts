// Cook-along helpers: the timers a recipe step mentions ("Simmer for 10 to 15 minutes"), the ingredients it uses, and
// the step reworded for this person's swaps. Pure, so it can be tested.

export interface StepTimer {
  /** Seconds to set: the shorter time when the step gives a range. */
  seconds: number;
  /** The longer end of a range ("10 to 15 minutes"), if there is one. */
  upTo?: number;
  /** What it's for, from the words before the time: "Simmer", "Boil the eggs". */
  label: string;
  /** The time as written, for the button: "10 to 15 min". */
  text: string;
}

const UNIT: Record<string, number> = { second: 1, sec: 1, minute: 60, min: 60, hour: 3600, hr: 3600 };
const TIME = /(\d+(?:\.\d+)?)(?:\s*(?:to|-|–)\s*(\d+(?:\.\d+)?))?\s*(seconds?|secs?|minutes?|mins?|hours?|hrs?)\b/gi;
const SHORT: Record<string, string> = { second: "sec", sec: "sec", minute: "min", min: "min", hour: "hr", hr: "hr" };
const VERBS = "microwave|stir-fry|fry|cook|bake|roast|simmer|boil|warm|soften|leave|brown|grill|toast|rest|poach|steam|defrost|heat|chill|marinate|soak|stand|sear|reduce|blitz|whisk|knead|bubble";
const VERB = new RegExp(`\\b(${VERBS})\\b((?:\\s+(?!in\\b|for\\b|with\\b|and\\b|on\\b|to\\b|until\\b|together\\b|over\\b|under\\b|at\\b|a\\b|an\\b)[a-z-]+){0,2})?`, "gi");
const SKIP = new Set(["the", "it", "them", "your", "some", "all", "everything"]);

/** A short label from the cooking verb nearest before the time ("Simmer", "Boil eggs", "Fry halloumi"). Looks in the
 *  clause the time is in, then the whole step before it. */
function labelFor(step: string, at: number) {
  const before = step.slice(0, at);
  const clause = before.split(/[.;!?]/).pop() ?? "";
  for (const text of [clause, before]) {
    const all = [...text.matchAll(VERB)];
    const m = all[all.length - 1];
    if (!m) continue;
    const obj = (m[2] ?? "").trim().split(/\s+/).filter((w) => w && !SKIP.has(w.toLowerCase())).filter((w) => !/^(sliced|chopped|diced|cubed|grated|halved|defrosted|frozen)$/i.test(w)).slice(0, 1);
    const label = [m[1].toLowerCase(), ...obj].join(" ");
    return label[0].toUpperCase() + label.slice(1);
  }
  return "Timer";
}

/** The timers in a step, in order. "45 seconds, stir, then 30 seconds at a time" gives two. */
export function timersIn(step: string): StepTimer[] {
  const out: StepTimer[] = [];
  for (const m of step.matchAll(TIME)) {
    const unitKey = m[3].toLowerCase().replace(/s$/, "");
    const unit = UNIT[unitKey] ?? 60;
    const lo = parseFloat(m[1]), hi = m[2] ? parseFloat(m[2]) : undefined;
    if (!(lo > 0) || lo * unit > 6 * 3600) continue;
    // "Defrost overnight, or ... for 5 minutes" is fine; "cool for 5" without a unit isn't caught, and that's fine too.
    const short = SHORT[unitKey] ?? "min";
    out.push({ seconds: Math.round(lo * unit), ...(hi && hi > lo ? { upTo: Math.round(hi * unit) } : {}), label: labelFor(step, m.index ?? 0), text: `${m[1]}${hi ? ` to ${m[2]}` : ""} ${short}` });
  }
  return out;
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const ADJ = /^(tinned|frozen|fresh|dried|cooked|chopped|sliced|grated|plain|light|low-fat|reduced-fat|wholemeal|wholegrain|smoked|ready-cooked|microwave|turkey breast|chicken breast|kidney|baby|cherry|red|green|spring|greek|skimmed|semi-skimmed)\s+/;
// Main nouns too vague to match on their own.
const VAGUE = new Set(["oil", "spray", "water", "salt", "pepper", "pinch", "spices", "herbs", "pouch", "stock", "mix", "paste"]);
/** Simple forms of a name to look for in a step: "tinned chopped tomatoes" also matches "chopped tomatoes" and
 *  "tomatoes"; "tinned kidney beans, drained" matches "beans". */
function forms(name: string) {
  const n = name.toLowerCase().replace(/\([^)]*\)/g, "").split(",")[0].replace(/\s+/g, " ").trim();
  const out = [n];
  let bare = n;
  while (ADJ.test(bare)) { bare = bare.replace(ADJ, ""); out.push(bare); }
  const head = n.split(" ").pop() ?? "";
  if (head.length >= 4 && !VAGUE.has(head) && !n.includes(" and ")) out.push(head);
  return [...new Set(out)].filter((f) => f.length >= 3);
}

/** The ingredients (ids) a step mentions, by their plain names. */
export function ingredientsIn(step: string, ids: string[], nameOf: (id: string) => string): string[] {
  const t = step.toLowerCase();
  return ids.filter((id) => forms(nameOf(id)).some((f) => new RegExp(`\\b${esc(f)}`, "i").test(t)));
}

/** The step with this person's swaps written in: "Add the chicken" becomes "Add the tofu". */
export function withSwaps(step: string, swaps: { from: string; to: string }[], nameOf: (id: string) => string): string {
  let out = step;
  for (const sw of swaps) {
    const to = nameOf(sw.to).toLowerCase();
    for (const f of forms(nameOf(sw.from)).sort((a, b) => b.length - a.length)) {
      out = out.replace(new RegExp(`\\b${esc(f)}\\b`, "gi"), (m) => (m[0] === m[0].toUpperCase() ? to[0].toUpperCase() + to.slice(1) : to));
    }
  }
  return out;
}

/** "4:05", "1:02:30". */
export function clock(seconds: number) {
  const s = Math.max(0, Math.ceil(seconds)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}` : `${m}:${String(r).padStart(2, "0")}`;
}
