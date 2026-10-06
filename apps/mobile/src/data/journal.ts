// The daily journal, loosely after Whoop's: a few quick questions each morning about yesterday, so that over a few
// weeks the app can show which things go with fuller, steadier days. People choose which questions they get.
// Yes/no questions are the things being compared; the two scales and the next-morning weigh-in are what they're
// compared against. Never add anything about medication or doses here.

export type JournalGroup = "Sleep" | "Food and drink" | "Movement" | "Body and mind";

export interface YesNoQuestion {
  id: string;
  kind: "yesno";
  group: JournalGroup;
  /** The question as asked about yesterday. */
  ask: string;
  /** Finishes "Days with …" in insights, so lower case unless it starts with a number. */
  short: string;
  detail?: string;
  /** In the starting set. */
  starter?: boolean;
}

export interface ScaleQuestion {
  id: "fullness" | "energy";
  kind: "scale";
  ask: string;
  low: string;
  high: string;
}

export const YES_NO: YesNoQuestion[] = [
  { id: "sleep7", kind: "yesno", group: "Sleep", ask: "Did you sleep 7 hours or more the night before?", short: "7 hours' sleep", starter: true },
  { id: "screens", kind: "yesno", group: "Sleep", ask: "Were you on your phone in bed?", short: "your phone in bed" },
  { id: "breakfastProtein", kind: "yesno", group: "Food and drink", ask: "Did you have protein at breakfast?", short: "protein at breakfast", detail: "25 g or more", starter: true },
  { id: "late", kind: "yesno", group: "Food and drink", ask: "Did you eat after 8pm?", short: "food after 8pm", starter: true },
  { id: "drink", kind: "yesno", group: "Food and drink", ask: "Did you have an alcoholic drink?", short: "a drink", starter: true },
  { id: "out", kind: "yesno", group: "Food and drink", ask: "Did you eat out or have a takeaway?", short: "a meal out or takeaway", starter: true },
  { id: "snacks", kind: "yesno", group: "Food and drink", ask: "Did you snack between meals?", short: "snacks between meals" },
  { id: "water", kind: "yesno", group: "Food and drink", ask: "Did you drink 1.5 litres of water?", short: "1.5 litres of water" },
  { id: "steps", kind: "yesno", group: "Movement", ask: "Did you walk 7,000 steps or more?", short: "7,000 steps", starter: true },
  { id: "strength", kind: "yesno", group: "Movement", ask: "Did you do a strength session?", short: "a strength session" },
  { id: "stress", kind: "yesno", group: "Body and mind", ask: "Did you feel stressed?", short: "stress", starter: true },
  { id: "period", kind: "yesno", group: "Body and mind", ask: "Were you on your period?", short: "your period", detail: "Often shows as water weight" },
];

// Fullness follows the design system's HungerScale: 1 is "Very hungry", 5 is "Comfortably full".
export const SCALES: ScaleQuestion[] = [
  { id: "fullness", kind: "scale", ask: "How hungry were you, most of the day?", low: "Very hungry", high: "Comfortably full" },
  { id: "energy", kind: "scale", ask: "How was your energy?", low: "Running low", high: "Plenty" },
];

export const GROUPS: JournalGroup[] = ["Sleep", "Food and drink", "Movement", "Body and mind"];
export const STARTER = YES_NO.filter((q) => q.starter).map((q) => q.id);
export const questionById = (id: string) => YES_NO.find((q) => q.id === id);

/** Days a question needs on each side (yes and no) before the app shows a pattern. */
export const MIN_DAYS = 4;
