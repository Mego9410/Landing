// Plan content ported from the prototype (apps/prototype/src/core.js and screens-progress.js): phases, habits,
// lessons, strength sessions and the coach's scripted replies. Dummy content to check before launch, as there.

export type PhaseKey = "ready" | "land" | "settle" | "steady" | "yearTwo";
export type Tone = "sky" | "sage" | "lilac" | "apricot" | "butter";

export interface Phase { key: PhaseKey; name: string; from: number; to: number; tone: Tone; focus: string }

/** The 12 months, in plan weeks counted from the last jab. */
export const PHASES: Phase[] = [
  { key: "land", name: "Land", from: 1, to: 8, tone: "sky", focus: "Appetite returning, protein at every meal, two strength sessions." },
  { key: "settle", name: "Settle", from: 9, to: 26, tone: "sage", focus: "Meal structure, eating out, handling cravings, a third session." },
  { key: "steady", name: "Steady", from: 27, to: 52, tone: "lilac", focus: "Your own routines, and a calm look back at your month every four weeks." },
];
/** Before the last jab: a few weeks to get the basics in place. Not part of the 12 months. */
export const READY: Phase = { key: "ready", name: "Getting ready", from: -99, to: 0, tone: "butter", focus: "Protein, strength basics and a plan, before your last jab." };
/** After week 52: lighter, with habits you choose and a new lesson each month. */
export const YEAR_TWO: Phase = { key: "yearTwo", name: "Year two", from: 53, to: 9999, tone: "apricot", focus: "The habits you choose, a new lesson each month and a look back every four weeks." };
export const phaseOf = (week: number): Phase => (week < 1 ? READY : week > 52 ? YEAR_TWO : PHASES.find((p) => week <= p.to) ?? PHASES[2]);

/** "weekly" habits are done once in the week (any day), so they sit outside the day's ring. */
export type HabitKind = "days" | "sessions" | "plain" | "weekly";
export const HABITS: Record<string, { label: string; kind: HabitKind; target: number; note: string }> = {
  protein: { label: "Protein at breakfast", kind: "days", target: 5, note: "25 g or more" },
  strength: { label: "Two strength sessions", kind: "sessions", target: 2, note: "25 minutes at home" },
  pause: { label: "Pause before seconds", kind: "plain", target: 5, note: "Wait 10 minutes, then decide" },
  walk: { label: "Walk after dinner", kind: "days", target: 5, note: "10 minutes" },
  plate: { label: "Plate up once", kind: "plain", target: 5, note: "Serve in the kitchen, not at the table" },
  table: { label: "Eat at the table", kind: "plain", target: 5, note: "Screens off for one meal a day" },
  water: { label: "Water before dinner", kind: "plain", target: 5, note: "One glass while you cook" },
  proteinAll: { label: "Protein at every meal", kind: "days", target: 5, note: "A palm-sized portion" },
  strength3: { label: "Three strength sessions", kind: "sessions", target: 3, note: "The third one is optional" },
  mealplan: { label: "Plan the week's meals", kind: "weekly", target: 1, note: "Ten minutes, once this week" },
  ownRoutine: { label: "Your own routine", kind: "days", target: 5, note: "The habits that stuck, your way" },
};
export const HABIT_SWAPS = [
  { id: "plate", title: "Plate up once", detail: "Serve in the kitchen, not at the table" },
  { id: "walk", title: "Ten-minute walk after dinner", detail: "Helps the evening wind down" },
  { id: "table", title: "Eat at the table", detail: "Screens off for one meal a day" },
  { id: "water", title: "Water before dinner", detail: "One glass while you cook" },
];
/** Habits from earlier in the year that can take the place of "Your own routine" in Steady and year two. */
export const OWN_HABITS = ["protein", "proteinAll", "pause", "walk", "plate", "table", "water"];
// The week's three habits. The first two hold for each phase; the third changes every few weeks so there's always
// something fresh to practise. Session habits are counted from the sessions themselves.
const THIRD: [number, string][] = [
  [1, "pause"], [3, "water"], [5, "pause"], [7, "walk"],
  [9, "mealplan"], [13, "table"], [17, "plate"], [21, "walk"], [25, "mealplan"],
  [27, "pause"], [33, "walk"], [39, "table"], [45, "water"], [51, "plate"],
];
/** The plan's habits for a week. Before week 1 they're week 1's; after week 52 the third keeps cycling through Steady's. */
export function habitsForWeek(week: number): string[] {
  const w = week < 1 ? 1 : week > 52 ? 27 + ((week - 53) % 26) : week;
  const p = phaseOf(w).key;
  const third = [...THIRD].reverse().find(([from]) => w >= from)?.[1] ?? "pause";
  if (p === "land") return ["protein", "strength", third];
  if (p === "settle") return ["proteinAll", "strength3", third];
  return ["ownRoutine", "strength", third];
}

export interface Move { name: string; anim: string; easier?: string; sets: number; reps: string; cue: string }
export const SESSIONS: Record<"A" | "B", { name: string; minutes: number; moves: Move[] }> = {
  A: { name: "Strength A", minutes: 25, moves: [
    { name: "Sit to stand", anim: "squat-2", sets: 3, reps: "10", cue: "Sit back to a chair, stand tall, control the way down." },
    { name: "Wall press-up", anim: "push-1", sets: 3, reps: "10", cue: "Hands at shoulder height, body straight, lower slowly." },
    { name: "Step-up", anim: "lunge-3", sets: 3, reps: "8 each leg", cue: "Use a stair, push through the front heel." },
    { name: "Overhead band pull-apart", anim: "pulldown-1", sets: 3, reps: "12", cue: "Arms up, band taut. Pull it apart and down behind your head." },
    { name: "Side plank", anim: "rotation-5", easier: "rotation-3", sets: 2, reps: "20 seconds each side", cue: "Knees down if you need, hips lifted." },
  ] },
  B: { name: "Strength B", minutes: 25, moves: [
    { name: "Goblet squat", anim: "squat-4", easier: "squat-2", sets: 3, reps: "10", cue: "Hold the weight at your chest, sit between your heels, stand tall." },
    { name: "Glute bridge", anim: "hinge-1", sets: 3, reps: "12", cue: "Feet flat, push through your heels, squeeze at the top for a second." },
    { name: "Counter press-up", anim: "push-2", easier: "push-1", sets: 3, reps: "8", cue: "Hands on a worktop, body in one line. Lower your chest, press away." },
    { name: "One-arm row", anim: "row-4", sets: 3, reps: "10 each arm", cue: "Hand on a chair or bench, back flat. Pull the weight to your hip." },
    { name: "Dead bug", anim: "core-2", sets: 2, reps: "8 each side", cue: "Low back pressed down, reach opposite arm and leg away slowly." },
  ] },
};

// Day tips by phase, and a set for evenings. Each set has at least seven, so a tip never repeats within a week.
export const TIPS: Record<PhaseKey | "evening", string[]> = {
  ready: [
    "Try a protein breakfast a few times this week, while your appetite is still quiet. It's easier to start now.",
    "Strength sessions now mean the habit is already there when your appetite comes back.",
    "Write down your three easiest protein breakfasts. Future you will thank you on a busy morning.",
    "Jot down any questions about stopping for your prescriber, so they're ready for your next appointment.",
    "Notice the times of day you think about food most. That's useful to know before the jabs stop.",
    "Stock the cupboard with easy protein: tinned fish, beans, eggs and yoghurt.",
    "A ten-minute walk after a meal is a lovely habit to start before anything changes.",
  ],
  land: [
    "Hunger often comes back mid-afternoon in the first weeks. Greek yoghurt with berries at 3pm takes the edge off.",
    "Start each meal with the protein on your plate. It helps fullness arrive sooner.",
    "A glass of water before a snack is a quick way to tell thirst from hunger.",
    "A short session still counts. Three moves done is better than none.",
    "Keep a protein snack in your bag for the hungriest part of the day.",
    "Eggs, yoghurt, tofu, chicken, fish and beans all count as protein. Pick the ones you enjoy.",
    "If a meal leaves you hungry an hour later, add a little more protein next time.",
    "A steady bedtime makes the next day's appetite easier to handle.",
  ],
  settle: [
    "Meals at roughly the same times make hunger easier to predict.",
    "A craving usually passes within 15 to 20 minutes. A short walk can help it along.",
    "Before a meal out, look at the menu and choose your main first.",
    "Cook once, eat twice: a batch recipe turns a tired evening into an easy one.",
    "Add a handful of beans or lentils to one meal today for a little more fibre.",
    "If you'd like a treat, have it on a plate, sitting down. Planned is different from grazing.",
    "On a stressful day, keep one habit and let the rest go.",
    "Weekends can have their own rhythm. A protein breakfast, even a late one, is a good anchor.",
  ],
  steady: [
    "The habits that stuck are yours now. Notice one that happens without thinking.",
    "A wobbly week is just a week. The trend over months is what counts.",
    "Make one meal today without a recipe: protein, veg, something filling and a sauce.",
    "If the week is full, decide your minimum: one session and protein at breakfast is plenty.",
    "Try a harder version of one strength move this week.",
    "Tell someone close what helps you. People usually want to, but don't know how.",
    "A walk, a call or ten minutes outside can shift a mood as well as a snack can.",
  ],
  yearTwo: [
    "A year of habits is a real foundation. Keep the two that matter most.",
    "If a routine has slipped, the smallest version of it is the way back in.",
    "Try a new kind of movement this month, just for the fun of it.",
    "Protein at each meal is still one of the simplest steady habits.",
    "Look at what next month holds and adjust one routine to fit it.",
    "Strength holds well with one or two sessions a week. Keep one in the diary.",
    "Be as kind to yourself as you would be to a friend on a harder day.",
  ],
  evening: [
    "Evenings can feel hungrier. A protein-first dinner and a short walk after often help.",
    "Wait ten minutes before seconds, then decide. Fullness takes a little while to arrive.",
    "Eat dinner at the table tonight, screens off, and notice when you've had enough.",
    "A cup of tea after dinner is a gentle signal that the kitchen is closed.",
    "If you're peckish late on, a yoghurt or a boiled egg is a good bridge to breakfast.",
    "Getting tomorrow's breakfast ready tonight makes the morning easier.",
    "A wind-down without screens tonight can make tomorrow's hunger easier to handle.",
  ],
};

/** Today's tip for a phase: a different one each day, with none repeated within a week. */
export function tipFor(phase: PhaseKey, day: string, evening = false): string {
  const pool = TIPS[evening ? "evening" : phase];
  const n = Math.round(Date.parse(`${day}T12:00:00Z`) / 864e5);
  return pool[((n % pool.length) + pool.length) % pool.length];
}

const MED = /\b(dose|doses|dosage|taper|tapering|restart|go back on|come off|stop(ping)? (the |my )?(jab|injection|medication|meds)|medication|meds|mounjaro|wegovy|ozempic|saxenda|tirzepatide|semaglutide|liraglutide|mg)\b/i;
/** The coach's scripted replies. Any medication question gets the prescriber redirect, never advice. */
export function coachReply(text: string, safeMode: boolean): { text: string; redirect?: boolean } {
  if (MED.test(text)) return { redirect: true, text: "That's a decision for your prescriber, so I can't help with doses. I can make a one-page summary of your trend and habits to take with you." };
  const t = text.toLowerCase();
  if (/meal plan|shopping|recipe|dinner|cook/.test(t)) return { text: "Your meal plan is in the Plan tab. You can swap any meal, pick next week's meals and get one shopping list that adds everything up." };
  if (/savoury|savory|lunch/.test(t)) return { text: "A tuna and bean salad, or cottage cheese on rye with tomatoes. Both get you 25 to 30 g with almost no cooking." };
  if (/breakfast/.test(t)) return { text: "Eggs on toast, Greek yoghurt with seeds, or porridge made with milk and a scoop of protein. All three get you past 25 g." };
  if (/hungry|hunger|tonight|craving|snack|sweet/.test(t)) return { text: "Evening hunger is common now your appetite is back. Have the protein on your plate first, then wait ten minutes before deciding on more. If you still want something, a yoghurt or a boiled egg is a good bridge." };
  if (/out|restaurant|holiday|party|weekend|takeaway/.test(t)) return { text: "Have a look at the menu before you go and pick a protein-first main. Enjoy the meal. One evening out won't undo a steady week." };
  if (/workout|strength|exercise|gym|session|sore/.test(t)) return { text: "Two short sessions a week is plenty right now. If a session feels like too much, do the first three moves and call it done." };
  if (/bad day|hard day|struggl|rubbish|awful|give up/.test(t)) return { text: "Hard days happen to everyone, and nothing is undone by one of them. Pick the smallest habit you can manage this evening and leave the rest for tomorrow." };
  if (/weight|scale|gain|heavier/.test(t)) return safeMode ? { text: "Let's keep the focus on routines. Which habit felt easiest this week? We can build from that one." } : { text: "Day-to-day weight moves with water, salt and sleep. Your 7-day average is the number to watch, and the steady zone is there so small changes don't worry you." };
  if (/thank/.test(t)) return { text: "Any time. I'm here whenever you want ideas or a hand with a tricky day." };
  return { text: "I can help with high-protein meal ideas, planning for meals out, and getting through harder days. What would help most right now?" };
}
