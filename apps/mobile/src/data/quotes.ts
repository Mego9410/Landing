// Today's thought: one line a day in Steadie's own voice, the same for everyone that day, through all 60 before any
// comes round again.
import { daysBetween } from "./dates";

export const QUOTES: readonly string[] = [
  "Steady isn't never wobbling. It's coming back to the middle.",
  "Small, kind and often beats big and rarely.",
  "You don't need a perfect day. Just the next good choice.",
  "A wobble is information, not a verdict.",
  "Begin where you are today, not where you think you should be.",
  "Habits are built on ordinary Tuesdays.",
  "Rest is part of the plan, not a break from it.",
  "Progress is quieter than you think.",
  "One good meal doesn't fix a week, and one hard meal doesn't break it.",
  "Be the friend to yourself you'd be to anyone else.",
  "Strong legs, steady days.",
  "The next five minutes count more than the last five days.",
  "Consistency is just coming back, again and again.",
  "You've done hard things before. This one gets easier.",
  "Hunger isn't a failing. It's a signal to listen to.",
  "A slow day still moves you forward.",
  "Make the easy choice the obvious one.",
  "Plan for the tricky moments, then trust the plan.",
  "Notice, don't judge.",
  "Each session adds to a stronger you.",
  "Protein at breakfast is a kindness to your afternoon self.",
  "Wobbly weeks are part of every steady year.",
  "You're allowed to start again at lunchtime.",
  "Small habits, kept gently, become who you are.",
  "Not every day needs to feel good to be a good day.",
  "Muscle is quiet support you build for later.",
  "Your pace is the right pace.",
  "Comparison takes energy you could spend on you.",
  "Done is kinder than perfect.",
  "A walk after dinner is a small gift to tomorrow.",
  "Listen to your body. It's on your side.",
  "You don't have to feel ready to take the next step.",
  "Keep it simple: protein, movement, sleep, repeat.",
  "There's no wagon to fall off. Just a path to keep walking.",
  "Today's effort is tomorrow's ease.",
  "Be patient with the parts of you still catching up.",
  "Sometimes courage is just showing up for ten minutes.",
  "Steady is a practice, not a destination.",
  "What you do most days matters more than what you do some days.",
  "Kind words land better than harsh ones, especially your own.",
  "A plan is a promise to your future self.",
  "Needing help is normal. Asking for it is smart.",
  "Little by little is still a lot.",
  "You've already shown you can change. Now you're learning to keep it.",
  "One glass of water, one deep breath, one next step.",
  "Strength isn't just in your arms. It's in coming back.",
  "Notice the small wins. They add up.",
  "Tired days count too.",
  "Make room for the foods you love, and for the habits that help.",
  "Your wellbeing is the point, not perfection.",
  "Calm choices come easier on a calm morning.",
  "The best time for a gentle start is now.",
  "Look at how far you've come before how far there is to go.",
  "You're building a year, not chasing a day.",
  "Feelings pass. Habits stay.",
  "Every steady week started with one steady day.",
  "Go gently. You're doing better than you think.",
  "Your body has carried you through a lot. Treat it well today.",
  "Same time tomorrow? That's how it sticks.",
  "Steady days are made of small, ordinary choices.",
];

const EPOCH = "2026-01-01";

/** The thought for a date (the ISO day `today()` gives). Counted in whole UTC days from a fixed start, so time zones and
 *  clock changes never skip or repeat one. */
export function quoteFor(date: string): string {
  const n = daysBetween(EPOCH, date) % QUOTES.length;
  return QUOTES[(n + QUOTES.length) % QUOTES.length];
}
