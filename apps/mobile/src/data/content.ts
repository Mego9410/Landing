// Plan content ported from the prototype (apps/prototype/src/core.js and screens-progress.js): phases, habits,
// lessons, strength sessions and the coach's scripted replies. Dummy content to check before launch, as there.

export type PhaseKey = "land" | "settle" | "steady";
export type Tone = "sky" | "sage" | "lilac" | "apricot" | "butter";

export const PHASES: { key: PhaseKey; name: string; from: number; to: number; tone: Tone; focus: string }[] = [
  { key: "land", name: "Land", from: 1, to: 8, tone: "sky", focus: "Appetite returning, protein at every meal, two strength sessions." },
  { key: "settle", name: "Settle", from: 9, to: 26, tone: "sage", focus: "Meal structure, eating out, handling cravings, a third session." },
  { key: "steady", name: "Steady", from: 27, to: 52, tone: "lilac", focus: "Your own routines, fewer prompts, monthly check-ins." },
];
export const phaseOf = (week: number) => PHASES.find((p) => week <= p.to) ?? PHASES[2];

export type HabitKind = "days" | "sessions" | "plain";
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
  mealplan: { label: "Plan the week's meals", kind: "plain", target: 1, note: "Ten minutes on Sunday" },
  ownRoutine: { label: "Your own routine", kind: "days", target: 5, note: "The habits that stuck, your way" },
};
export const HABIT_SWAPS = [
  { id: "plate", title: "Plate up once", detail: "Serve in the kitchen, not at the table" },
  { id: "walk", title: "Ten-minute walk after dinner", detail: "Helps the evening wind down" },
  { id: "table", title: "Eat at the table", detail: "Screens off for one meal a day" },
  { id: "water", title: "Water before dinner", detail: "One glass while you cook" },
];
export function habitsForWeek(week: number): string[] {
  const p = phaseOf(week).key;
  if (p === "land") return ["protein", "strength", "pause"];
  if (p === "settle") return ["proteinAll", "strength3", "mealplan"];
  return ["ownRoutine", "strength", "pause"];
}

export const LESSONS: Record<PhaseKey, { title: string; week: string; blurb: string; paras: string[]; tries: string[] }> = {
  land: {
    title: "Why protein matters more now", week: "Protein first", blurb: "As appetite returns, building meals around protein keeps you fuller and protects muscle.",
    paras: ["As your appetite comes back, meals built around protein tend to keep you fuller for longer, so hunger feels easier to handle.", "Protein also helps your body hold on to muscle. Muscle is part of what you worked for, and strength sessions plus protein help you keep it."],
    tries: ["A palm-sized portion at each meal: eggs, Greek yoghurt, chicken, fish, tofu, beans or lentils.", "Start with breakfast. It's the meal most people miss."],
  },
  settle: {
    title: "Meals that hold you steady", week: "A rhythm for meals", blurb: "Regular meals with protein and fibre make hunger easier to predict and plan around.",
    paras: ["In Settle, regular meals do a lot of quiet work. When you know roughly when you'll next eat, hunger is easier to sit with.", "Structure is not a rule book. It's a rough rhythm you can bend for a meal out or a busy day."],
    tries: ["Three meals at roughly the same times on five days this week.", "Have a plan for the hungriest time of day, like a protein snack ready to go."],
  },
  steady: {
    title: "Making it yours", week: "Your own routines", blurb: "The habits that stuck are now yours. Fewer prompts, same steady ground.",
    paras: ["By now, the habits that worked are yours. Steady is about keeping them with fewer reminders.", "Check in once a month. If things shift, a reset week is always there."],
    tries: ["Pick the two habits that matter most to you and keep them.", "Put a monthly check-in in your calendar."],
  },
};

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

export const TIPS = {
  day: { label: "TIP FOR TODAY", text: "Hunger often comes back mid-afternoon in the first weeks. Greek yoghurt with berries at 3pm takes the edge off." },
  evening: { label: "TIP FOR TONIGHT", text: "Evenings can feel hungrier. A protein-first dinner and a short walk after often help." },
};

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
