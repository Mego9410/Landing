// The onboarding flow: its screens in order, the act each belongs to, how far along the bar is, which welcome screen
// someone sees (A/B/C, fixed per install), and the wording the later screens build from earlier answers.
import type { Href } from "expo-router";
import { install } from "./install";
import type { AppState, Story, Where } from "./store";

export type Act = "Hello" | "Your story" | "The practical bits" | "Your plan";

/** The screens with a progress bar, in order. The welcome, building, paywall, thank-you and account screens sit outside. */
export const FLOW: { route: string; act: Act }[] = [
  { route: "name", act: "Hello" },
  { route: "before", act: "Hello" },
  { route: "where", act: "Your story" },
  { route: "last-jab", act: "Your story" },
  { route: "why", act: "Your story" },
  { route: "feel", act: "Your story" },
  { route: "biology", act: "Your story" },
  { route: "matters", act: "Your story" },
  { route: "consent", act: "The practical bits" },
  { route: "health", act: "The practical bits" },
  { route: "numbers", act: "The practical bits" },
  { route: "food-noise", act: "The practical bits" },
  { route: "if-then", act: "The practical bits" },
  { route: "eat", act: "The practical bits" },
  { route: "strength", act: "The practical bits" },
  { route: "helps", act: "The practical bits" },
  { route: "nudge", act: "Your plan" },
  { route: "first-week", act: "Your plan" },
  { route: "promise", act: "Your plan" },
  { route: "first-checkin", act: "Your plan" },
];

export const stepOf = (route: string) => {
  const i = FLOW.findIndex((f) => f.route === route);
  return { act: FLOW[Math.max(0, i)].act, progress: (i + 1) / (FLOW.length + 1) };
};
export const hrefOf = (route: string) => `/onboarding/${route}` as Href;

/** Welcome screen A, B or C, the same every time on this install (from its random ID), so the three can be compared. */
export async function welcomeVariant(): Promise<"A" | "B" | "C"> {
  const { id } = await install();
  const n = parseInt(id.replace(/-/g, "").slice(0, 8), 16);
  return (["A", "B", "C"] as const)[n % 3];
}

/* ---------- where they are with the jab ---------- */
export const WHERE: { id: Where; label: string; reply: string }[] = [
  { id: "on", label: "Still on it, planning to stop", reply: "Getting ready before you stop is a great head start." },
  { id: "tapering", label: "Coming down slowly", reply: "That’s a really sensible place to start. We’ll plan around it." },
  { id: "recent", label: "Had my last one recently", reply: "The first weeks are when a plan helps most. Good timing." },
  { id: "while", label: "Off it for a while", reply: "It’s never too late to get steady. We’ll start from where you are." },
  { id: "break", label: "Taking a break", reply: "A break is a good time to build habits that last. We’ll plan around it." },
];
/** Whether they're still to have their last jab (so we ask when they plan it), rather than when it was. */
export const stillToStop = (w: Where | null) => w === "on" || w === "tapering";
export const statusFor = (w: Where): AppState["ob"]["status"] => (w === "on" ? "on" : w === "tapering" ? "soon" : "stopped");
export const WHERE_PHRASE: Record<Where, string> = {
  on: "getting ready to stop", tapering: "coming down slowly", recent: "your last jab being recent", while: "being off it for a while", break: "taking a break",
};

/* ---------- food noise and the if-then plan ---------- */
export const FOOD_NOISE: { id: string; label: string; hungry?: AppState["ob"]["hungryTimes"][number]; when: string; title: string }[] = [
  { id: "midmorning", label: "Mid-morning", hungry: "Morning", when: "When it’s mid-morning and food noise gets loud", title: "When food noise gets loud mid-morning" },
  { id: "afternoon", label: "Late afternoon", hungry: "Afternoon", when: "When it’s late afternoon and food noise gets loud", title: "When it gets loud in the late afternoon" },
  { id: "evening", label: "Evenings", hungry: "Evening", when: "When it’s evening and food noise gets loud", title: "When it gets loud in the evening" },
  { id: "weekend", label: "Weekends", when: "When it’s the weekend and food noise gets loud", title: "When it gets loud at the weekend" },
  { id: "hardday", label: "After a hard day", when: "After a hard day, when food noise gets loud", title: "When it gets loud after a hard day" },
];
export const NOT_REALLY = "none";
export const IF_THEN: { id: string; label: string; action: string }[] = [
  { id: "protein", label: "Have a protein snack ready", action: "have a protein snack ready" },
  { id: "walk", label: "A 10-minute walk", action: "go for a 10-minute walk" },
  { id: "warm", label: "Something warm to drink", action: "make something warm to drink" },
  { id: "checkin", label: "A two-minute check-in with Steadie", action: "do a two-minute check-in with Steadie" },
];
/** The moment their if-then plan is for: the first time they picked, or any time food noise gets loud. */
export function noiseMoment(story: Story) {
  const m = FOOD_NOISE.find((f) => story.foodNoise.includes(f.id));
  return m ? { when: m.when, title: m.title, short: m.label.toLowerCase() } : { when: "If food noise gets loud", title: "When food noise gets loud", short: "food-noise" };
}
/** "When it's late afternoon and food noise gets loud, I'll have a protein snack ready." */
export function ifThenSentence(story: Story) {
  const a = IF_THEN.find((x) => x.id === story.ifThen) ?? IF_THEN[0];
  return { when: noiseMoment(story).when, action: a.action };
}

/* ---------- finishing ---------- */
const FREE: Record<string, string> = { gluten: "gluten-free", milk: "dairy-free", peanuts: "nut-free", eggs: "egg-free", fish: "fish-free" };
const DIET_WORD: Partial<Record<AppState["food"]["diet"], string>> = { vegetarian: "vegetarian", vegan: "vegan", pescatarian: "pescatarian", halal: "halal", kosher: "kosher", "veg-no-egg": "vegetarian, egg-free", jain: "Jain" };
/** "vegetarian, dairy-free meals", or "meals for your kitchen" when there's nothing to say. */
export function mealsPhrase(s: AppState) {
  const words = [DIET_WORD[s.food.diet], ...s.food.allergens.map((a) => FREE[a]).filter(Boolean)].filter(Boolean);
  return words.length ? `${[...new Set(words)].join(", ")} meals` : "meals that suit your kitchen";
}
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
/** "Tue and Thu", "Mon, Wed and Fri". */
export function daysPhrase(days: number[]) {
  const n = days.map((d) => DAY_NAMES[d]);
  return n.length <= 1 ? n.join("") : `${n.slice(0, -1).join(", ")} and ${n[n.length - 1]}`;
}
/** Where they go after the first check-in: the paywall (when billing is on and they aren't subscribed), else the
 *  account screen (when accounts are on and they aren't signed in), else Today. */
export function afterPlan(opts: { billing: boolean; subscribed: boolean; accounts: boolean; signedIn: boolean }): Href {
  if (opts.billing && !opts.subscribed) return { pathname: "/paywall", params: { from: "onboarding" } } as Href;
  if (opts.accounts && !opts.signedIn) return { pathname: "/onboarding/account", params: { from: "onboarding" } } as Href;
  return "/";
}
